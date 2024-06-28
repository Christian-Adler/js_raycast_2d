class Boundary {
  constructor(vecA, vecB) {
    this.a = vecA;
    this.b = vecB;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

export {Boundary}