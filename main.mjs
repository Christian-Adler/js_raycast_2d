import {Vector} from "./vector.mjs";
import {Boundary} from "./boundary.mjs";
import {Ray} from "./ray.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;
let worldWidth2 = worldWidth / 2;
let worldHeight2 = worldHeight / 2;
let worldUpdated = true;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    worldWidth2 = worldWidth / 2;
    worldHeight2 = worldHeight / 2;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
    worldUpdated = true;
  }
};

updateWorldSettings();

const boundary = new Boundary(new Vector(10, 10), new Vector(200, 50));
const ray = new Ray(new Vector(40, 40), new Vector(40, -5));


const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  boundary.draw(ctx);
  ray.draw(ctx);

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();