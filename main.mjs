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
// for (let i = 0; i < 5; i++) {
//   walls.push(new Boundary(new Vector(Math.random() * worldWidth, Math.random() * worldHeight), new Vector(Math.random() * worldWidth, Math.random() * worldHeight)))
// }

const sizeFactor = 5;
const svgPaths = document.getElementsByClassName('svgPath');

for (const svgPath of svgPaths) {
  const svgPathLength = Math.floor(svgPath.getTotalLength());
  const svgPathSteps = 200;
  let firstPos = null;
  let prevPos = null;
  for (let i = 0; i <= svgPathSteps; i++) {
    const pt = svgPath.getPointAtLength(i * svgPathLength / svgPathSteps);
    const vec = new Vector(pt.x * sizeFactor + worldWidth2, pt.y * sizeFactor + worldHeight2);
    if (prevPos != null) {
      walls.push(new Boundary(prevPos, vec));
    }
    prevPos = vec;
    if (i === 0)
      firstPos = vec;
  }
  if (firstPos != null) {
    walls.push(new Boundary(prevPos, firstPos));
  }
}

walls.push(new Boundary(new Vector(0, 0), new Vector(0, worldHeight)));
walls.push(new Boundary(new Vector(0, 0), new Vector(worldWidth, 0)));
walls.push(new Boundary(new Vector(worldWidth, 0), new Vector(worldWidth, worldHeight)));
walls.push(new Boundary(new Vector(0, worldHeight), new Vector(worldWidth, worldHeight)));

const particle = new Particle(new Vector(worldWidth2, worldHeight2));


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

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  particle.look(ctx, walls);


  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

window.addEventListener("mousemove", (evt) => {
  particle.update(evt.x, evt.y);
})
