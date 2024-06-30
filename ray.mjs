import {Vector} from "./vector.mjs";
import {deg2rad} from "./utils.mjs";

class Ray {
  constructor(pos, angleDeg) {
    this.pos = pos;
    this.angleDeg = angleDeg;
  }

  rotate(deltaAngleDeg) {
    this.angleDeg += deltaAngleDeg;
  }

  // setDir(dir) {
  //   this.dir = dir.normalize();
  // }
  //
  // lookAt(vec) {
  //   this.dir.x = vec.x - this.pos.x;
  //   this.dir.y = vec.y - this.pos.y;
  //   this.dir = this.dir.normalize();
  // }

  // draw(ctx) {
  //   ctx.save();
  //
  //   ctx.translate(this.pos.x, this.pos.y);
  //
  //   ctx.beginPath();
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(this.dir.x * 10, this.dir.y * 10);
  //   ctx.stroke();
  //
  //   ctx.restore();
  // }

  cast(boundary) {
    const dirVec = Vector.fromAngle(deg2rad(this.angleDeg));

    const x1 = boundary.a.x;
    const y1 = boundary.a.y;
    const x2 = boundary.b.x;
    const y2 = boundary.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + dirVec.x;
    const y4 = this.pos.y + dirVec.y;


    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator === 0) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    if (0 < t && t < 1 && u > 0) {
      return new Vector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    } else
      return null;
  }
}

export {Ray}