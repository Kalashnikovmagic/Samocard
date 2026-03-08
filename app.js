const container = document.getElementById("container");

let selectedPosition = null;
let triggered = false;
let controlImageElement = null;

// порядок картинок
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

// создаём список картинок
function renderImages() {

  container.innerHTML = "";

  imagesList.forEach((item,index)=>{

    const div = document.createElement("div");
    div.className = "image-card";

    const img = document.createElement("img");
    img.src = item.src;
    img.dataset.type = item.type;
    img.dataset.index = index;

    div.appendChild(img);

    // запоминаем контрольную картинку
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

// splash 2 секунды
setTimeout(()=>{
  document.getElementById("splash").style.display = "none";
  container.style.display = "block";
},2000);

renderImages();

let lastTapTime = 0;

// двойной тап
container.addEventListener("click",(e)=>{

  const target = e.target;

  if(target.tagName !== "IMG") return;
  if(target.dataset.type !== "control") return;

  const currentTime = new Date().getTime();

  if(currentTime - lastTapTime < 300){

    const rect = target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const blockWidth = rect.width / 2;
    const blockHeight = rect.height / 3;

    const col = x < blockWidth ? 0 : 1;
    const row = Math.floor(y / blockHeight);

    selectedPosition = row * 2 + col + 1;

    console.log("Выбрана позиция:", selectedPosition);

    triggered = false;

    // меняем картинку control -> control2
    if(controlImageElement){
      controlImageElement.src = "images/control2.jpg";
    }

  }

  lastTapTime = currentTime;

});

// отслеживаем первый скролл
window.addEventListener("scroll",()=>{

  if(selectedPosition !== null && !triggered){

    triggered = true;

    const pomeloIndex = 1 + selectedPosition;

    const targetDiv = container.children[pomeloIndex];

    targetDiv.scrollIntoView({
      behavior:"smooth"
    });

  }

});
