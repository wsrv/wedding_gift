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
const DINO_STATIONARY_SRC = new URL("./imgs/dino-stationary.png", import.meta.url)
  .href;
const DINO_RUN_SRCS = [
  new URL("./imgs/dino-run-0.png", import.meta.url).href,
  new URL("./imgs/dino-run-1.png", import.meta.url).href,
];
const DINO_JUMP_SRC = new URL("./imgs/dino-jump.png", import.meta.url).href;
const DINO_LOSE_SRC = new URL("./imgs/dino-lose.png", import.meta.url).href;
const DINO_FINISH_SRC = new URL("./imgs/finish.png", import.meta.url).href;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
let isFinishingRun;

preloadDinoSprites();

export function setupDino() {
  isJumping = false;
  isFinishingRun = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  dinoElem.src = DINO_STATIONARY_SRC;
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
  dinoElem.src = DINO_LOSE_SRC;
}

export function setDinoFinish() {
  dinoElem.classList.remove("dino-start");
  dinoElem.classList.add("dino-finish");
  dinoElem.src = DINO_FINISH_SRC;
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
  currentFrameTime = 0;
  dinoElem.classList.remove("dino-start");
  dinoElem.classList.remove("dino-finish");
  dinoElem.src = DINO_JUMP_SRC;
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.classList.remove("dino-start");
    dinoElem.classList.remove("dino-finish");
    dinoElem.src = DINO_JUMP_SRC;
    return;
  }

  dinoElem.classList.remove("dino-start");
  dinoElem.classList.remove("dino-finish");
  if (dinoElem.src !== DINO_RUN_SRCS[dinoFrame]) {
    dinoElem.src = DINO_RUN_SRCS[dinoFrame];
  }
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = DINO_RUN_SRCS[dinoFrame];
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
    dinoFrame = 0;
    currentFrameTime = 0;
    dinoElem.src = DINO_RUN_SRCS[dinoFrame];
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

function preloadDinoSprites() {
  [
    DINO_STATIONARY_SRC,
    DINO_JUMP_SRC,
    DINO_LOSE_SRC,
    DINO_FINISH_SRC,
    ...DINO_RUN_SRCS,
  ].forEach((src) => {
    const image = new Image();
    image.src = src;
  });
}
