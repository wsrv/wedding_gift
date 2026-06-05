import { updateGround, setupGround } from "./ground.js";
import {
  updateDino,
  setupDino,
  getDinoRect,
  setDinoLose,
  setDinoFinish,
  startDinoFinishRun,
  requestJump,
  stopDino,
} from "./dino.js";
import {
  updateCactus,
  setupCactus,
  getCactusRects,
  getHeartRects,
  collectHearts,
  clearHearts,
} from "./cactus.js";
import {
  advanceFinishTimer,
  getFinishTimerElapsed,
  updateFinishPoint,
  setupFinishPoint,
  getFinishPointRect,
  hasFinishPointReachedCenter,
  isFinishSequencePending,
  removeFinishPoint,
} from "./finishPoint.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const startScreenElem = document.querySelector("[data-start-screen]");
const loseScreenElem = document.querySelector("[data-lose-screen]");
const finishScreenElem = document.querySelector("[data-finish-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handlePrimaryInput);
document.addEventListener("pointerdown", handlePrimaryInput, { passive: false });
loseScreenElem.addEventListener("click", handleStart);
finishScreenElem.addEventListener("click", handleStart);

let lastTime;
let speedScale;
let gameState = "idle";
let isGameFinished;
let hasStartedFinishRun;
let isGroundStopped;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, isGroundStopped ? 0 : speedScale);
  updateDino(delta, speedScale);
  advanceFinishTimer(delta);
  updateCactus(
    delta,
    speedScale,
    isFinishSequencePending(),
    getFinishTimerElapsed(),
  );
  collectHearts(getDinoRect());
  if (isFinishSequencePending()) clearHearts();
  updateFinishPoint(
    delta,
    speedScale,
    getCactusRects().length > 0 || getHeartRects().length > 0,
  );
  updateFinishSequence();
  updateSpeedScale(delta);
  if (checkFinish()) return handleFinish();
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function handlePrimaryInput(event) {
  if (event.type === "keydown" && event.repeat) return;
  if (event.type === "pointerdown") event.preventDefault();

  if (gameState === "idle") {
    handleStart();
    return;
  }

  if (gameState === "running") {
    requestJump();
  }
}

function checkFinish() {
  const dinoRect = getDinoRect();
  const finishPointRect = getFinishPointRect();
  if (!finishPointRect) return false;

  return isCollision(finishPointRect, dinoRect);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  gameState = "running";
  isGameFinished = false;
  hasStartedFinishRun = false;
  isGroundStopped = false;
  loseScreenElem.classList.add("hide");
  finishScreenElem.classList.add("hide");
  setupGround();
  setupDino();
  setupCactus();
  setupFinishPoint();
  startScreenElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleLose() {
  gameState = "lost";
  stopDino();
  setDinoLose();
  loseScreenElem.classList.remove("hide");
}

function handleFinish() {
  if (isGameFinished) return;

  isGameFinished = true;
  gameState = "finished";
  stopDino();
  removeFinishPoint();
  setDinoFinish();
  finishScreenElem.classList.remove("hide");
}

function updateFinishSequence() {
  if (hasStartedFinishRun) return;
  if (!hasFinishPointReachedCenter()) return;

  hasStartedFinishRun = true;
  isGroundStopped = true;
  startDinoFinishRun();
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
