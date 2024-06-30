import {rad2deg} from "./utils.mjs";

let idProvider = 0;

class Boundary {
  constructor(vecA, vecB) {
    this.id = idProvider++
    this.a = vecA;
    this.b = vecB;
    this.age = 0;

    this.hslColorValRad = rad2deg(vecB.clone().subVec(vecA).toRadians());
  }

  hitByRay() {
    this.age = 1;
  }

  draw(ctx) {
    if (this.age <= 0) return;
    this.age -= 0.001;

    ctx.strokeStyle = 'hsl(' + this.hslColorValRad + ', 100%, 50%, ' + (this.age) + ')';
    // ctx.strokeStyle = "rgba(255,255,255," + this.age + ")";
    // ctx.lineWidth = this.age * 3;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

export {Boundary}