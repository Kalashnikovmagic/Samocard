const container = document.getElementById("container");
let selectedPosition = null; // выбранная позиция на контрольной картинке (1-6)
let triggered = false; // флаг, чтобы прокрутка срабатывала только один раз

// список картинок: фейковая, контрольная, 6 картинок с помело
const imagesList = [
  {src:"images/fake.jpg", type:"normal"},
  {src:"images/control.jpg", type:"control"},
  {src:"images/pomelo1.jpg", type:"pomelo"},
  {src:"images/pomelo2.jpg", type:"pomelo"},
  {src:"images/pomelo3.jpg", type:"pomelo"},
  {src:"images/pomelo4.jpg", type:"pomelo"},
  {src:"images/pomelo5.jpg", type:"pomelo"},
  {src:"images/pomelo6.jpg", type:"pomelo"}
];

// рендер списка картинок
function renderImages() {
  container.innerHTML = "";
  imagesList.forEach((item, index)=>{
    const div = document.createElement("div");
    div.className = "image-card";
    const img = document.createElement("img");
    img.src = item.src;
    img.dataset.type = item.type;
    img.dataset.index = index;
    div.appendChild(img);

    // если контрольная картинка — добавляем ячейки
    if(item.type === "control"){
      for(let i=0;i<6;i++){
        const cell = document.createElement("div");
        cell.className = `cell-overlay cell-${i}`;
        div.appendChild(cell);
      }
    }

    container.appendChild(div);
  });
}

// splash 2 секунды, потом показываем контейнер
setTimeout(()=>{
  document.getElementById("splash").style.display = "none";
  container.style.display = "block";
},2000);

renderImages();

// двойной тап на контрольной картинке — только запоминаем позицию
let lastTapTime = 0;

container.addEventListener("click", (e)=>{
  const target = e.target;
  if(target.tagName !== "IMG") return;
  if(target.dataset.type !== "control") return;

  const currentTime = new Date().getTime();
  if(currentTime - lastTapTime < 300){ // двойной тап
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const blockWidth = rect.width / 2;
    const blockHeight = rect.height / 3;

    const col = x < blockWidth ? 0 : 1;
    const row = Math.floor(y / blockHeight);
    selectedPosition = row * 2 + col + 1; // 1-6
    console.log("Выбрана позиция:", selectedPosition);
    triggered = false; // сбрасываем флаг, чтобы скролл сработал при следующем движении
  }
  lastTapTime = currentTime;
});

// слушаем событие scroll, чтобы отследить движение пользователя
let isUserScrolling = false;

window.addEventListener('scroll', ()=>{
  if(selectedPosition !== null && !triggered){
    triggered = true; // чтобы прокрутка сработала один раз
    const pomeloIndex = 1 + selectedPosition; // контрольная=1, +1..6
    const targetDiv = container.children[pomeloIndex];
    targetDiv.scrollIntoView({behavior:"smooth"});
  }
});
