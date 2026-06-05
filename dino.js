import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const MOBILE_JUMP_SPEED = 0.255;
const GRAVITY = 0.0015;
const MOBILE_GRAVITY = 0.001;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;
const DINO_START_LEFT = 1;
const MOBILE_DINO_START_LEFT = 3;
const FINISH_RUN_SPEED = 0.03;
const MOBILE_FINISH_RUN_SPEED = 0.08;
const MOBILE_BREAKPOINT = 700;

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
  setCustomProperty(dinoElem, "--left", getDinoStartLeft());
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

  yVelocity = getJumpSpeed();
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

  yVelocity -= getGravity() * delta;
}

function handleFinishRun(delta) {
  if (!isFinishingRun) return;

  incrementCustomProperty(dinoElem, "--left", delta * getFinishRunSpeed());
}

function getJumpSpeed() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_JUMP_SPEED : JUMP_SPEED;
}

function getGravity() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_GRAVITY : GRAVITY;
}

function getFinishRunSpeed() {
  return window.innerWidth <= MOBILE_BREAKPOINT
    ? MOBILE_FINISH_RUN_SPEED
    : FINISH_RUN_SPEED;
}

function getDinoStartLeft() {
  return window.innerWidth <= MOBILE_BREAKPOINT
    ? MOBILE_DINO_START_LEFT
    : DINO_START_LEFT;
}
