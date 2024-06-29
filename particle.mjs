import {Ray} from "./ray.mjs";
import {deg2rad} from "./utils.mjs";

class Particle {
  constructor(pos) {
    this.pos = pos;
    this.rays = [];
    for (let i = 0; i < 360; i += 10) {
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

  look(ctx, wall) {
    for (const ray of this.rays) {
      const pt = ray.cast(wall);
      if (pt) {
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }
}

export {Particle}