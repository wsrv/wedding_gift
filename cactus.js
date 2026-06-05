import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const MOBILE_BREAKPOINT = 700;
const MOBILE_SCROLL_MULTIPLIER = 1.5;
const CACTUS_INTERVAL_MIN = 700;
const CACTUS_INTERVAL_MAX = 2100;
const MOBILE_INTERVAL_MULTIPLIER = 1.35;
const HEART_CHANCE = 0.35;
const MIN_HEART_SPAWNS = 3;
const HEART_RESCUE_START = 5000;
const worldElem = document.querySelector("[data-world]");

let nextCactusTime;
let heartSpawnCount;
let spawnCount;
export function setupCactus() {
  nextCactusTime = getSpawnIntervalMin();
  heartSpawnCount = 0;
  spawnCount = 0;
  document.querySelectorAll("[data-cactus], [data-heart]").forEach((elem) => {
    elem.remove();
  });
}

export function updateCactus(
  delta,
  speedScale,
  pauseSpawning = false,
  finishTimerElapsed = 0,
) {
  document.querySelectorAll("[data-cactus], [data-heart]").forEach((elem) => {
    incrementCustomProperty(
      elem,
      "--left",
      delta * speedScale * SPEED * getScrollMultiplier() * -1,
    );
    if (getCustomProperty(elem, "--left") <= -100) {
      elem.remove();
    }
  });

  if (nextCactusTime <= 0) {
    if (pauseSpawning) return;
    createSpawn(finishTimerElapsed);
    nextCactusTime =
      randomNumberBetween(getSpawnIntervalMin(), getSpawnIntervalMax()) /
      speedScale;
  }
  nextCactusTime -= delta;
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    const rect = cactus.getBoundingClientRect();
    const hitboxWidth = 2;
    const hitboxHeight = rect.height * 0.3;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return {
      left: centerX - hitboxWidth / 2,
      right: centerX + hitboxWidth / 2,
      top: centerY - hitboxHeight / 2,
      bottom: centerY + hitboxHeight / 2,
    };
  });
}

export function getHeartRects() {
  return [...document.querySelectorAll("[data-heart]")].map((heart) =>
    heart.getBoundingClientRect(),
  );
}

export function collectHearts(dinoRect) {
  let collectedCount = 0;

  document.querySelectorAll("[data-heart]").forEach((heart) => {
    const heartRect = heart.getBoundingClientRect();
    if (!isCollision(heartRect, dinoRect)) return;

    heart.remove();
    collectedCount += 1;
  });

  return collectedCount;
}

export function clearHearts() {
  document.querySelectorAll("[data-heart]").forEach((heart) => {
    heart.remove();
  });
}

function createSpawn(finishTimerElapsed) {
  spawnCount += 1;

  if (spawnCount === 1) {
    createCactus();
    return;
  }

  if (shouldSpawnHeart(finishTimerElapsed)) {
    heartSpawnCount += 1;
    createHeart();
    return;
  }

  createCactus();
}

function shouldSpawnHeart(finishTimerElapsed) {
  if (heartSpawnCount >= MIN_HEART_SPAWNS) {
    return Math.random() < HEART_CHANCE;
  }

  if (finishTimerElapsed >= HEART_RESCUE_START) {
    return true;
  }

  return Math.random() < HEART_CHANCE;
}

function createCactus() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = "imgs/cactus.png";
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  worldElem.append(cactus);
}

function createHeart() {
  const heart = document.createElement("img");
  heart.dataset.heart = true;
  heart.src = "imgs/heart.png";
  heart.classList.add("heart");
  setCustomProperty(heart, "--left", 100);
  worldElem.append(heart);
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getScrollMultiplier() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_SCROLL_MULTIPLIER : 1;
}

function getSpawnIntervalMin() {
  return Math.round(
    CACTUS_INTERVAL_MIN *
      (window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_INTERVAL_MULTIPLIER : 1),
  );
}

function getSpawnIntervalMax() {
  return Math.round(
    CACTUS_INTERVAL_MAX *
      (window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_INTERVAL_MULTIPLIER : 1),
  );
}
