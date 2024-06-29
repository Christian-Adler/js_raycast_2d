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

const walls = [];
for (let i = 0; i < 5; i++) {
  walls.push(new Boundary(new Vector(Math.random() * worldWidth, Math.random() * worldHeight), new Vector(Math.random() * worldWidth, Math.random() * worldHeight)))
}
const particle = new Particle(new Vector(40, 40));


const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  for (const wall of walls) {
    wall.draw(ctx);
  }
  particle.draw(ctx);
  particle.look(ctx, walls);


  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

window.addEventListener("mousemove", (evt) => {
  particle.update(evt.x, evt.y);
})
