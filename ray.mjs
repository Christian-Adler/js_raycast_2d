class Ray {
  constructor(pos, dir) {
    this.pos = pos;
    this.dir = dir.normalize();
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.dir.x * 10, this.dir.y * 10);
    ctx.stroke();

    ctx.restore();
  }
}

export {Ray}