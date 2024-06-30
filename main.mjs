import {Vector} from "./vector.mjs";
import {Boundary} from "./boundary.mjs";
import {Particle} from "./particle.mjs";
import {lerpVec, rad2deg} from "./utils.mjs";
import {View} from "./view.mjs";

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

if (true) {
  walls.push(new Boundary(new Vector(0, 0), new Vector(0, worldHeight)));
  walls.push(new Boundary(new Vector(0, 0), new Vector(worldWidth, 0)));
  walls.push(new Boundary(new Vector(worldWidth, 0), new Vector(worldWidth, worldHeight)));
  walls.push(new Boundary(new Vector(0, worldHeight), new Vector(worldWidth, worldHeight)));
}

const svgLightPath = document.getElementById('lightPath');
const svgLightPathLength = Math.floor(svgLightPath.getTotalLength());
let svgLightPathPos = 0;

const particle = new Particle(new Vector(worldWidth2, worldHeight2));

let noMouseTimer = null;
let noMouseStep = 0;
let noMouseLastPos = null;
let noMouseTargetPos = null;
let noMouseAngleStep = 0;

const view = new View();

let rotateLeft = false;
let rotateRight = false;

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

  if (!noMouseTimer && noMouseStep === 0) {
    const pt = svgLightPath.getPointAtLength(svgLightPathPos * svgLightPathLength);
    const vec = new Vector(pt.x * sizeFactor + worldWidth2, pt.y * sizeFactor + worldHeight2);
    svgLightPathPos += 0.0002;
    if (svgLightPathPos >= 1)
      svgLightPathPos = 0;

    const ptLookAt = svgLightPath.getPointAtLength(((svgLightPathPos + 0.005) * svgLightPathLength) % svgLightPathLength);
    const vecLookAt = new Vector(ptLookAt.x * sizeFactor + worldWidth2, ptLookAt.y * sizeFactor + worldHeight2);

    particle.update(vec.x, vec.y);
    particle.lookAt(vecLookAt);

  } else if (!noMouseTimer && noMouseStep > 0) {
    let t = noMouseStep / 100;
    const moveToLightPathPos = lerpVec(noMouseTargetPos, noMouseLastPos, t);
    particle.update(moveToLightPathPos.x, moveToLightPathPos.y);
    particle.rotate(noMouseAngleStep)
    noMouseStep--;
  }

  ctx.strokeStyle = "white";
  particle.draw(ctx);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  const scene = particle.look(ctx, walls);

  view.draw(scene);

  if (rotateLeft) particle.rotate(-0.9);
  else if (rotateRight) particle.rotate(0.9);

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

window.addEventListener("mousemove", (evt) => {
  clearTimeout(noMouseTimer);
  noMouseTimer = setTimeout(() => {
    clearTimeout(noMouseTimer);
    noMouseTimer = null;
    noMouseLastPos = particle.pos.clone();
    noMouseStep = 100;

    // find nearest auto pas pos
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < 100; i++) {
      const pt = svgLightPath.getPointAtLength(i / 100 * svgLightPathLength);
      const vec = new Vector(pt.x * sizeFactor + worldWidth2, pt.y * sizeFactor + worldHeight2);
      const dist = vec.distance(noMouseLastPos);
      if (dist < minDist) {
        minDist = dist;
        noMouseTargetPos = vec;
        svgLightPathPos = i / 100;

        const ptLookAt = svgLightPath.getPointAtLength(((i / 100 + 0.005) * svgLightPathLength) % svgLightPathLength);
        const vecLookAt = new Vector(ptLookAt.x * sizeFactor + worldWidth2, ptLookAt.y * sizeFactor + worldHeight2);
        noMouseAngleStep = (rad2deg(vecLookAt.subVec(vec).toRadians()) - particle.angleDeg) / 100;
      }
    }
  }, 3000);
  particle.update(evt.x, evt.y);
});

window.addEventListener("wheel", event => {
  event.preventDefault();
  // console.log(event.deltaY);
  particle.updateFOV(Math.sign(event.deltaY));
}, {passive: false});

const keyDownCallbacks = {
  "ArrowLeft": () => {
    rotateLeft = true;
  },
  "ArrowRight": () => {
    rotateRight = true;
  },
  "ArrowUp": undefined,
  "ArrowDown": undefined,
};
const keyUpCallbacks = {
  "ArrowLeft": () => {
    rotateLeft = false;
  },
  "ArrowRight": () => {
    rotateRight = false;
  },
  "ArrowUp": undefined,
  "ArrowDown": undefined,
};

window.addEventListener("keydown", (event) => {
  const cb = keyDownCallbacks[event.key];
  if (cb)
    cb();
});
window.addEventListener("keyup", (event) => {
  const cb = keyUpCallbacks[event.key];
  if (cb)
    cb();
});

