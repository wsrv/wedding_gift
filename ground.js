import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const MOBILE_BREAKPOINT = 700;
const MOBILE_SCROLL_MULTIPLIER = 1.5;
const groundElems = document.querySelectorAll("[data-ground]");

export function setupGround() {
  setCustomProperty(groundElems[0], "--left", 0);
  setCustomProperty(groundElems[1], "--left", 300);
}

export function updateGround(delta, speedScale) {
  groundElems.forEach((ground) => {
    incrementCustomProperty(
      ground,
      "--left",
      delta * speedScale * SPEED * getScrollMultiplier() * -1,
    );

    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}

function getScrollMultiplier() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_SCROLL_MULTIPLIER : 1;
}
