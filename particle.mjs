import {Ray} from "./ray.mjs";
import {deg2rad} from "./utils.mjs";

class Particle {
  constructor(pos) {
    this.pos = pos;
    this.rays = [];
    const rayDegStep = 0.2;
    for (let i = 0; i < 360 - rayDegStep; i += rayDegStep) {
      this.rays.push(new Ray(this.pos, deg2rad(i)));
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
    ctx.fill();

    for (const ray of this.rays) {
      ray.draw(ctx);
    }
  }

  look(ctx, walls) {
    for (const ray of this.rays) {
      let minPt = null;
      let minDist = Number.MAX_SAFE_INTEGER;
      let minWall = null;
      for (const wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const dist = this.pos.distance(pt);
          if (dist < minDist) {
            minPt = pt;
            minDist = dist;
            minWall = wall;
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
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }
}

export {Particle}