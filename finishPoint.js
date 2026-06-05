import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const FINISH_DELAY = 10000;
const worldElem = document.querySelector("[data-world]");

let finishPointElem;
let elapsedTime;
let isPending;
let hasSpawned;
let hasReachedCenter;

export function setupFinishPoint() {
  elapsedTime = 0;
  isPending = false;
  hasSpawned = false;
  hasReachedCenter = false;
  finishPointElem?.remove();
  finishPointElem = null;
}

export function advanceFinishTimer(delta) {
  if (!isPending) {
    elapsedTime += delta;
    if (elapsedTime >= FINISH_DELAY) {
      isPending = true;
    }
  }
}

export function updateFinishPoint(delta, speedScale, hasCactiOnScreen) {

  if (isPending && !hasSpawned && !hasCactiOnScreen) {
    createFinishPoint();
    hasSpawned = true;
  }

  if (!finishPointElem) return;

  if (hasReachedCenter) return;

  incrementCustomProperty(
    finishPointElem,
    "--left",
    delta * speedScale * SPEED * -1,
  );

  if (getFinishPointCenterX() <= getWorldCenterX()) {
    hasReachedCenter = true;
  }
}

export function getFinishPointRect() {
  return finishPointElem?.getBoundingClientRect() ?? null;
}

export function getFinishPointLeft() {
  return finishPointElem ? getCustomProperty(finishPointElem, "--left") : null;
}

export function hasFinishPointReachedCenter() {
  return hasReachedCenter;
}

export function isFinishSequencePending() {
  return isPending;
}

export function getFinishTimerElapsed() {
  return elapsedTime;
}

export function removeFinishPoint() {
  finishPointElem?.remove();
  finishPointElem = null;
}

function createFinishPoint() {
  finishPointElem = document.createElement("img");
  finishPointElem.dataset.finishPoint = true;
  finishPointElem.src = "imgs/finish-point.png";
  finishPointElem.classList.add("finish-point");
  setCustomProperty(finishPointElem, "--left", 100);
  worldElem.append(finishPointElem);
}

function getFinishPointCenterX() {
  const rect = finishPointElem?.getBoundingClientRect();
  return rect ? rect.left + rect.width / 2 : Infinity;
}

function getWorldCenterX() {
  const rect = worldElem.getBoundingClientRect();
  return rect.left + rect.width / 2;
}
