const container = document.getElementById("container");

let selectedPosition = null;
let controlImageElement = null;
let jumpDone = false;

let lastTapTime = 0;

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


// splash
setTimeout(()=>{
  document.getElementById("splash").style.display="none";
  container.style.display="block";
},2000);



// двойной тап
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



// ждём завершение свайпа пользователя
window.addEventListener("touchend",()=>{

  if(selectedPosition === null) return;
  if(jumpDone) return;

  jumpDone = true;

  const pomeloIndex = 1 + selectedPosition;

  const target = container.children[pomeloIndex];

  target.scrollIntoView({
    behavior:"smooth",
    block:"center"
  });

});
