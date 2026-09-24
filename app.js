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

container.addEventListener("click", event => {
  const target = event.target;

  if (target.tagName !== "IMG" || target.dataset.type !== "control") return;

  const now = Date.now();

  if (now - lastTapTime < 300) {
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = x < rect.width / 2 ? 0 : 1;
    const row = Math.floor(y / (rect.height / 3));

    selectedPosition = row * 2 + col + 1;

    if (controlImageElement) {
      controlImageElement.src = "images/control2.jpg";
    }

    jumpDone = false;
  }

  lastTapTime = now;
});

function smoothScrollTo(element, duration = 800) {
  const start = window.scrollY;
  const rect = element.getBoundingClientRect();
  const target = start + rect.top - (window.innerHeight - rect.height) / 2;
  const distance = target - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

window.addEventListener("touchend", () => {
  if (selectedPosition === null || jumpDone) return;

  jumpDone = true;

  const pomeloIndex = 3 + selectedPosition;
  const target = container.children[pomeloIndex];

  if (!target) return;

  smoothScrollTo(target, 800);

  setTimeout(() => {
    document.body.style.overflow = "hidden";
  }, 850);
});

// Регистрация Service Worker для полноценной офлайн-работы.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}