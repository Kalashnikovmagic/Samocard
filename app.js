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

function lockScrollAtCurrentPosition() {
  const scrollY = window.scrollY;

  // iOS can keep compositor momentum alive even after overflow:hidden.
  // Fixing the body removes the page from the native scrolling layer.
  document.documentElement.style.overflow = "hidden";

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";

  return scrollY;
}

function smoothScrollTo(element, duration = 800) {
  // Calculate everything while the document is still normally scrollable.
  const start = window.scrollY;
  const rect = element.getBoundingClientRect();
  const target = start + rect.top - (window.innerHeight - rect.height) / 2;
  const distance = target - start;

  // From this point the iOS native scroller is no longer responsible
  // for the movement. We animate the fixed body's top position instead.
  lockScrollAtCurrentPosition();

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = start + distance * ease;

    document.body.style.top = `-${current}px`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      document.body.style.top = `-${target}px`;
    }
  }

  requestAnimationFrame(step);
}

// Handle the double tap directly on touchend.
// This is important on iOS: the old click -> window.touchend chain
// allowed the native scroll momentum to continue after our animation.
container.addEventListener("touchend", event => {
  if (jumpDone) return;

  const target = event.target;

  if (target.tagName !== "IMG" || target.dataset.type !== "control") return;

  const now = Date.now();

  if (now - lastTapTime >= 300) {
    lastTapTime = now;
    return;
  }

  // This is the second tap. Stop the native touch scrolling for this
  // gesture before starting our own controlled movement.
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

  smoothScrollTo(pomelo, 800);

  lastTapTime = 0;
}, { passive: false });

// Регистрация Service Worker для полноценной офлайн-работы.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}
