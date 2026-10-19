/* AURA INTRO SEQUENCE
   Auto-plays once on page load.
   R or click = restart.
   F = browser fullscreen (where supported).
*/

const screen = document.getElementById("screen");
const brand = document.getElementById("brand");
const bootBlock = document.getElementById("bootBlock");
const loadingFill = document.getElementById("loadingFill");
const percent = document.getElementById("percent");
const detected = document.getElementById("detected");
const locked = document.getElementById("locked");
const objective = document.getElementById("objective");

let timers = [];
let percentRAF = null;

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function clearSequence() {
  timers.forEach(clearTimeout);
  timers = [];

  if (percentRAF) {
    cancelAnimationFrame(percentRAF);
    percentRAF = null;
  }
}

function animatePercent(duration) {
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    // slightly eased so the last 15% feels more deliberate
    const eased = 1 - Math.pow(1 - t, 2.15);
    const value = Math.min(100, Math.round(eased * 100));
    percent.textContent = String(value).padStart(3, "0") + "%";

    if (t < 1) {
      percentRAF = requestAnimationFrame(tick);
    } else {
      percent.textContent = "100%";
      percentRAF = null;
    }
  }

  percentRAF = requestAnimationFrame(tick);
}

function resetVisuals() {
  screen.classList.remove("results");
  brand.classList.remove("show");
  bootBlock.classList.remove("show");
  detected.classList.remove("show");
  locked.classList.remove("show");
  objective.classList.remove("show");

  loadingFill.style.transition = "none";
  loadingFill.style.width = "0%";
  percent.textContent = "000%";

  // force layout reset so transitions reliably replay
  void screen.offsetWidth;
}

function playSequence() {
  clearSequence();
  resetVisuals();

  later(() => brand.classList.add("show"), 250);
  later(() => bootBlock.classList.add("show"), 650);

  later(() => {
    loadingFill.style.transition = "width 2.0s cubic-bezier(.18,.68,.24,1)";
    loadingFill.style.width = "100%";
    animatePercent(2000);
  }, 950);

  later(() => {
    screen.classList.add("results");
  }, 3150);

  later(() => detected.classList.add("show"), 3470);
  later(() => locked.classList.add("show"), 4050);
  later(() => objective.classList.add("show"), 4680);

  // Final objective remains on screen. Stop the recording whenever you want.
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (e) {
    // Browser may block it; Fn+F11 is still available.
  }
}

window.addEventListener("load", playSequence);

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    playSequence();
  }

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleFullscreen();
  }
});

document.addEventListener("click", () => {
  playSequence();
});
