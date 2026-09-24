const container = document.getElementById("container");

let selectedPosition = null;
let controlImageElement = null;
let jumpDone = false;
let lastTapTime = 0;

const imagesList = [
  { src: "images/fake.jpg", type: "normal" },
  { src: "images/control.jpg", type: "control" },
  { src: "images/fake2.jpg", type: "normal" },
  { src: "images/fake3.jpg", type: "normal" },
  { src: "images/pomelo1.jpg", type: "pomelo" },
  { src: "images/pomelo2.jpg", type: "pomelo" },
  { src: "images/pomelo3.jpg", type: "pomelo" },
  { src: "images/pomelo4.jpg", type: "pomelo" },
  { src: "images/pomelo5.jpg", type: "pomelo" },
  { src: "images/pomelo6.jpg", type: "pomelo" }
];

function renderImages() {
  container.innerHTML = "";

  imagesList.forEach(item => {
    const div = document.createElement("div");
    div.className = "image-card";

    const img = document.createElement("img");
    img.src = item.src;
    img.dataset.type = item.type;
    img.loading = "eager";
    img.decoding = "async";

    div.appendChild(img);

    if (item.type === "control") {
      controlImageElement = img;
    }

    container.appendChild(div);
  });
}

renderImages();

setTimeout(() => {
  document.getElementById("splash").style.display = "none";
  container.style.display = "block";
}, 2000);

function getSelectedPosition(target, clientX, clientY) {
  const rect = target.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const col = x < rect.width / 2 ? 0 : 1;
  const row = Math.floor(y / (rect.height / 3));

  return row * 2 + col + 1;
}

function startControlledJump(element, duration = 800) {
  /*
   * Important for iOS:
   * Do NOT call window.scrollTo(), scrollIntoView(), or scrollTop here.
   *
   * Recent WebKit versions deliberately allow native momentum to continue
   * while JavaScript changes the scroll position. That means a JS scroll
   * animation can finish and then iOS can keep moving the page.
   *
   * Instead we freeze the document at its current position and animate the
   * visual content with transform(). The native iOS scroller is therefore
   * completely removed from the animation.
   */

  const startScrollY = window.scrollY;
  const rect = element.getBoundingClientRect();

  const desiredOffset =
    rect.top - (window.innerHeight - rect.height) / 2;

  const distance = desiredOffset;

  // Freeze the actual page at exactly its current visual position.
  document.documentElement.style.overflow = "hidden";

  document.body.style.position = "fixed";
  document.body.style.top = `-${startScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";

  // From now on, ONLY the container moves.
  container.style.willChange = "transform";

  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = distance * ease;

    container.style.transform =
      `translate3d(0, ${-current}px, 0)`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      container.style.transform =
        `translate3d(0, ${-distance}px, 0)`;
      container.style.willChange = "auto";
    }
  }

  requestAnimationFrame(step);
}

container.addEventListener("touchend", event => {
  if (jumpDone) return;

  const target = event.target;

  if (target.tagName !== "IMG" || target.dataset.type !== "control") return;

  const now = Date.now();

  if (now - lastTapTime >= 300) {
    lastTapTime = now;
    return;
  }

  // This is the second tap.
  // Prevent iOS from treating this touch as a native scroll gesture.
  event.preventDefault();

  const touch = event.changedTouches[0];

  selectedPosition = getSelectedPosition(
    target,
    touch.clientX,
    touch.clientY
  );

  if (controlImageElement) {
    controlImageElement.src = "images/control2.jpg";
  }

  jumpDone = true;

  const pomeloIndex = 3 + selectedPosition;
  const pomelo = container.children[pomeloIndex];

  if (!pomelo) return;

  startControlledJump(pomelo, 800);

  lastTapTime = 0;
}, { passive: false });

// Регистрация Service Worker для полноценной офлайн-работы.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}
