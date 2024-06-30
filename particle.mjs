import {Ray} from "./ray.mjs";
import {deg2rad, rad2deg} from "./utils.mjs";
import {Vector} from "./vector.mjs";

class Particle {
  constructor(pos) {
    this.pos = pos;
    this.rays = [];
    this.fovDeg = 90;
    // this.dir = Vector.fromAngle(0);
    this.angleDeg = 0;
    this.rayDegStep = 0.2;
    for (let i = -this.fovDeg / 2; i <= this.fovDeg / 2; i += this.rayDegStep) {
      this.rays.push(new Ray(this.pos, i + this.angleDeg));
    }
  }

  lookAt(vec) {
    const prevAngleDeg = this.angleDeg;
    this.angleDeg = rad2deg(vec.clone().subVec(this.pos).toRadians());
    const deltaAngleDeg = this.angleDeg - prevAngleDeg;
    for (const ray of this.rays) {
      ray.rotate(deltaAngleDeg);
    }
  }

  updateFOV(deltaAngleDeg) {
    this.rays = [];
    this.fovDeg += deltaAngleDeg;
    this.fovDeg = Math.max(20, Math.min(180, this.fovDeg));
    for (let i = -this.fovDeg / 2; i <= this.fovDeg / 2; i += this.rayDegStep) {
      this.rays.push(new Ray(this.pos, i + this.angleDeg));
    }
  }

  rotate(deltaAngleDeg) {
    this.angleDeg += deltaAngleDeg;
    for (const ray of this.rays) {
      ray.rotate(deltaAngleDeg);
    }
  }

  step(deltaStep) {
    this.pos.addVec(Vector.fromAngle(deg2rad(this.angleDeg)).mult(deltaStep));
  }

  draw(ctx) {
    // ctx.beginPath();
    // ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2);
    // ctx.fill();

    // for (const ray of this.rays) {
    //   ray.draw(ctx);
    // }
  }

  look(ctx, walls) {
    const scene = new Array(this.rays.length);

    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let minPt = null;
      let minDist = Number.MAX_SAFE_INTEGER;
      let minWall = null;
      let minWallColor = null;
      for (const wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let dist = this.pos.distance(pt);
          dist *= Math.cos(deg2rad(ray.angleDeg - this.angleDeg)); // remove fisheye - use distance parallel to view angle
          if (dist < minDist) {
            minPt = pt;
            minDist = dist;
            minWall = wall;
            minWallColor = wall.hslColorValRad;
          }
        }
      }
      if (minPt) {
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(minPt.x, minPt.y);
        ctx.stroke();

        minWall.hitByRay();
      }
      scene[i] = {minDist, minWallColor};
    }
    return scene;
  }

  update(x, y) {
    this.pos.set(x, y);
  }
}

export {Particle}