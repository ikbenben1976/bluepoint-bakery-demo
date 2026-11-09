const GAP = 12;

let heights: { tall: number; short: number } | null = null;
let watching = false;
let scrollToken = 0;

function watchResize() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  window.addEventListener("resize", () => {
    heights = null;
  });
}

/** Tall and condensed sticky-bar heights. Transitions are paused so the
    measurement is the finished size, not a frame mid-animation. */
function stackHeights(): { tall: number; short: number } {
  watchResize();
  if (heights) return heights;
  const stack = document.querySelector(".sticky-stack");
  const header = document.querySelector(".site-header");
  if (!(stack instanceof HTMLElement) || !(header instanceof HTMLElement)) {
    return { tall: 115, short: 90 };
  }
  const nodes = [stack, stack.querySelector(".site-header-row"), stack.querySelector(".heritage-logo")].filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
  const previous = nodes.map((node) => node.style.transition);
  for (const node of nodes) node.style.transition = "none";
  const wasCondensed = header.classList.contains("is-condensed");
  header.classList.remove("is-condensed");
  const tall = stack.getBoundingClientRect().height;
  header.classList.add("is-condensed");
  const short = stack.getBoundingClientRect().height;
  header.classList.toggle("is-condensed", wasCondensed);
  nodes.forEach((node, index) => {
    node.style.transition = previous[index];
  });
  heights = { tall, short };
  return heights;
}

function willCondense(scrollY: number): boolean {
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  return scrollY > (narrow ? 80 : 40);
}

/** Pixels from the viewport top that must stay clear of the sticky bar. */
export function headerClearance(scrollY: number): number {
  const { tall, short } = stackHeights();
  return (willCondense(scrollY) ? short : tall) + GAP;
}

function scrollPaddingTop(): number {
  const value = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(value) ? value : 0;
}

export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
}

function pillTop(): number {
  const pill = document.querySelector("[data-testid='quick-actions']");
  if (!(pill instanceof HTMLElement)) return window.innerHeight;
  const box = pill.getBoundingClientRect();
  return box.height > 0 ? box.top : window.innerHeight;
}

/**
 * Place `visible` just under the sticky header.
 * When `anchor` is a hash target, its scroll-margin is updated so a later
 * native fragment scroll uses the same spot instead of stacking scroll-padding
 * on the stylesheet margin.
 */
export function scrollBelowHeader(visible: HTMLElement, behavior: ScrollBehavior, anchor: HTMLElement = visible) {
  const { tall } = stackHeights();
  const visibleDoc = visible.getBoundingClientRect().top + window.scrollY;
  const rough = Math.max(0, visibleDoc - (tall + GAP));
  const clearance = headerClearance(rough);
  const dest = Math.max(0, visibleDoc - clearance);
  const anchorDoc = anchor.getBoundingClientRect().top + window.scrollY;
  const anchorViewport = anchorDoc - dest;
  anchor.style.scrollMarginTop = `${Math.round(anchorViewport - scrollPaddingTop())}px`;
  anchor.style.scrollMarginBottom = "0px";
  const token = ++scrollToken;
  window.scrollTo({ top: dest, left: 0, behavior });
  if (behavior !== "smooth") return;
  window.setTimeout(() => {
    if (token !== scrollToken) return;
    const top = visible.getBoundingClientRect().top;
    const needed = headerClearance(window.scrollY);
    const hiddenByHeader = top < needed - 8;
    const hiddenByPill = visible.getBoundingClientRect().bottom > pillTop() - 4 && visible.offsetHeight < window.innerHeight * 0.7;
    if (!hiddenByHeader && !hiddenByPill) return;
    const nextDoc = visible.getBoundingClientRect().top + window.scrollY;
    const nextDest = Math.max(0, nextDoc - headerClearance(nextDoc));
    window.scrollTo({ top: nextDest, left: 0, behavior: "instant" });
  }, 450);
}
