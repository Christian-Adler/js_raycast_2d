import {scale} from "./utils.mjs";

class View {
  constructor() {
    this.canvas = document.getElementById("view");
    this.ctx = this.canvas.getContext('2d');
  }

  draw(scene) {

    const ctx = this.ctx;
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    const maxViewWidth = 400;
    const sliceWidth = 400 / scene.length;
    for (let i = 0; i < scene.length; i++) {
      const distance = Math.min(scene[i], maxViewWidth);
      const b = scale(distance, 0, maxViewWidth, 255, 0);
      const h = scale(distance, 0, maxViewWidth, 400, 0);
      ctx.fillStyle = `rgb(${b}, ${b}, ${b})`;
      ctx.beginPath();
      ctx.rect(i * sliceWidth, 200 - h / 2, sliceWidth + 1, h);
      ctx.fill();
    }

    // ctx.beginPath();
    // ctx.arc(50, 50, 20, 0, Math.PI);
    // ctx.stroke();
  }
}

export {View};