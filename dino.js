import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;
const DINO_START_LEFT = 1;
const FINISH_RUN_SPEED = 0.03;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
let isFinishingRun;
export function setupDino() {
  isJumping = false;
  isFinishingRun = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  dinoElem.src = "imgs/dino-stationary.png";
  dinoElem.classList.add("dino-start");
  dinoElem.classList.remove("dino-finish");
  setCustomProperty(dinoElem, "--left", DINO_START_LEFT);
  setCustomProperty(dinoElem, "--bottom", 0);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
  handleFinishRun(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png";
}

export function setDinoFinish() {
  dinoElem.classList.remove("dino-start");
  dinoElem.classList.add("dino-finish");
  dinoElem.src = "imgs/finish.png";
}

export function stopDino() {
  return;
}

export function startDinoFinishRun() {
  isFinishingRun = true;
}

export function requestJump() {
  if (isJumping || isFinishingRun) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.classList.remove("dino-start");
    dinoElem.classList.remove("dino-finish");
    dinoElem.src = "imgs/dino-jump.png";
    return;
  }

  dinoElem.classList.remove("dino-start");
  dinoElem.classList.remove("dino-finish");
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function handleFinishRun(delta) {
  if (!isFinishingRun) return;

  incrementCustomProperty(dinoElem, "--left", delta * FINISH_RUN_SPEED);
}
