document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".journey-timeline");
  const items = Array.from(document.querySelectorAll(".journey-item"));
  const arrow = document.querySelector(".journey-arrow");

  if (!timeline || items.length === 0 || !arrow) return;

  let current = 0;
  let timer;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function getDotPosition(item) {
    const dot = item.querySelector(".journey-dot");

    if (!dot) {
      return { left: 0, top: 0 };
    }

    const timelineRect = timeline.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();

    return {
      left: dotRect.left - timelineRect.left + dotRect.width / 2,
      top: dotRect.top - timelineRect.top + dotRect.height / 2
    };
  }

  function activate(index, moveArrow = true) {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });

    const position = getDotPosition(items[index]);

    if (!moveArrow || reducedMotion) {
      arrow.style.transition = "none";
      arrow.style.left = `${position.left}px`;
      arrow.style.top = `${position.top}px`;
      arrow.style.opacity = "1";

      requestAnimationFrame(() => {
        arrow.style.transition = "";
      });

      return;
    }

    arrow.style.opacity = "1";
    arrow.style.left = `${position.left}px`;
    arrow.style.top = `${position.top}px`;
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(nextStep, 3000);
  }

  function nextStep() {
    const next = (current + 1) % items.length;

    if (next === 0) {
      arrow.style.opacity = "0";

      setTimeout(() => {
        current = 0;
        activate(current, false);
        scheduleNext();
      }, 500);

      return;
    }

    current = next;
    activate(current, true);
    scheduleNext();
  }

  activate(0, false);
  scheduleNext();

  window.addEventListener("resize", () => {
    activate(current, false);
  });
});