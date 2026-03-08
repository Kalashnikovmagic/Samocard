const container = document.getElementById("container");

let selectedPosition = null;
let controlImageElement = null;
let jumpDone = false;

let lastTapTime = 0;

// порядок картинок
const imagesList = [
  {src:"images/fake.jpg", type:"normal"},      // 0: первая фейковая
  {src:"images/control.jpg", type:"control"},  // 1: контрольная
  {src:"images/fake2.jpg", type:"normal"},     // 2: вторая фейковая
  {src:"images/fake3.jpg", type:"normal"},     // 3: третья фейковая
  {src:"images/pomelo1.jpg", type:"pomelo"},   // 4
  {src:"images/pomelo2.jpg", type:"pomelo"},   // 5
  {src:"images/pomelo3.jpg", type:"pomelo"},   // 6
  {src:"images/pomelo4.jpg", type:"pomelo"},   // 7
  {src:"images/pomelo5.jpg", type:"pomelo"},   // 8
  {src:"images/pomelo6.jpg", type:"pomelo"}    // 9
];

// рендер картинок
function renderImages(){
  container.innerHTML = "";

  imagesList.forEach((item)=>{
    const div = document.createElement("div");
    div.className = "image-card";

    const img = document.createElement("img");
    img.src = item.src;
    img.dataset.type = item.type;

    div.appendChild(img);

    if(item.type === "control"){
      controlImageElement = img;
      for(let i=0;i<6;i++){
        const cell = document.createElement("div");
        cell.className = `cell-overlay cell-${i}`;
        div.appendChild(cell);
      }
    }

    container.appendChild(div);
  });
}

renderImages();

// splash 2 секунды
setTimeout(()=>{
  document.getElementById("splash").style.display="none";
  container.style.display="block";
},2000);

// двойной тап — только запоминаем позицию и меняем контрольную картинку
container.addEventListener("click",(e)=>{
  const target = e.target;

  if(target.tagName !== "IMG") return;
  if(target.dataset.type !== "control") return;

  const now = Date.now();

  if(now - lastTapTime < 300){
    const rect = target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = x < rect.width/2 ? 0 : 1;
    const row = Math.floor(y / (rect.height/3));

    selectedPosition = row * 2 + col + 1;

    console.log("выбрано:", selectedPosition);

    if(controlImageElement){
      controlImageElement.src = "images/control2.jpg";
    }

    jumpDone = false;
  }

  lastTapTime = now;
});

// плавная функция скролла с ease-out
function smoothScrollTo(element, duration = 800) {
  const start = window.scrollY;
  const rect = element.getBoundingClientRect();
  const target = start + rect.top - (window.innerHeight - rect.height)/2;

  const distance = target - start;
  let startTime = null;

  function step(timestamp) {
    if(!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    window.scrollTo(0, start + distance * ease);

    if(progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// после первого скрола пользователя
window.addEventListener("touchend",()=>{
  if(selectedPosition === null) return;
  if(jumpDone) return;

  jumpDone = true;

  // смещение на 3 картинки перед pomelo (fake + control + fake2/fake3)
  const pomeloIndex = 3 + selectedPosition;
  const target = container.children[pomeloIndex];

  smoothScrollTo(target, 800);

  // блокируем дальнейший скролл после завершения анимации
  setTimeout(()=>{
    document.body.style.overflow = "hidden";
  }, 850);
});
