class Boundary {
  constructor(vecA, vecB) {
    this.a = vecA;
    this.b = vecB;
    this.age = 0;
  }

  hitByRay() {
    this.age = 1;
  }

  draw(ctx) {
    if (this.age <= 0) return;
    this.age -= 0.001;
    ctx.strokeStyle = "rgba(255,255,255," + this.age + ")";
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

export {Boundary}