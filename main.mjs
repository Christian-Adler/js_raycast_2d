import {Vector} from "./vector.mjs";
import {Boundary} from "./boundary.mjs";
import {Particle} from "./particle.mjs";

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

const wall = new Boundary(new Vector(200, 10), new Vector(200, 200));
const particle = new Particle(new Vector(40, 40));


const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  wall.draw(ctx);
  particle.draw(ctx);
  particle.look(ctx, wall);


  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

window.addEventListener("mousemove", (evt) => {
  particle.update(evt.x, evt.y);
})
