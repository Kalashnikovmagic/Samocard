const grid = document.getElementById("grid")

let selectedScreenPosition=null
let pomeloIndex=null

// список продуктов
const productNames=[
"Молоко","Яйца","Хлеб","Бананы","Яблоки","Апельсины",
"Огурцы","Помидоры","Сыр","Колбаса","Йогурт","Творог",
"Сметана","Масло","Макароны","Рис","Курица","Говядина",
"Лосось","Креветки","Картофель","Лук","Морковь","Перец",
"Брокколи","Капуста","Грибы","Чеснок","Лимон","Авокадо",
"Киви","Манго","Ананас","Арбуз","Дыня","Салат","Багет",
"Круассан","Печенье","Шоколад","Мороженое","Чипсы",
"Кола","Сок апельсиновый","Минеральная вода"
]

let products=[]

for(let i=0;i<400;i++){

let name=productNames[i%productNames.length]

products.push({
name:name,
price:(80+Math.floor(Math.random()*200))+" ₽",
img:"https://source.unsplash.com/300x300/?"+encodeURIComponent(name)+",food,isolated,white"
})

}

function render(){

grid.innerHTML=""

products.forEach((p,i)=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`

<div class="productImage">
<img src="${p.img}">
</div>

<div class="priceButton">
${p.price}
</div>

`

grid.appendChild(card)

})

}

render()

// splash
setTimeout(()=>{
document.getElementById("splash").style.display="none"
},2000)



// выбор позиции на экране
grid.addEventListener("click",(e)=>{

const cards=document.querySelectorAll(".card")

cards.forEach((card,i)=>{

const r=card.getBoundingClientRect()

if(
e.clientX>r.left &&
e.clientX<r.right &&
e.clientY>r.top &&
e.clientY<r.bottom
){

selectedScreenPosition=i%6

}

})

})



let startY=0
let scrolling=false

window.addEventListener("touchstart",(e)=>{
startY=e.touches[0].clientY
})

window.addEventListener("touchend",(e)=>{

let endY=e.changedTouches[0].clientY

// свайп вверх
if(startY-endY>40){

startScroll()

}

})



function startScroll(){

if(scrolling) return

scrolling=true

const card=document.querySelector(".card")
const cardHeight=card.offsetHeight+14

const rowsToScroll=25
const scrollDistance=cardHeight*rowsToScroll

const start=window.scrollY
const duration=900

let startTime=null

function animate(time){

if(!startTime) startTime=time

let progress=(time-startTime)/duration

if(progress>1) progress=1

let ease=1-Math.pow(1-progress,3)

window.scrollTo(0,start+scrollDistance*ease)

placePomeloDuringScroll()

if(progress<1){

requestAnimationFrame(animate)

}else{

snapToRow()

scrolling=false

}

}

requestAnimationFrame(animate)

}



function snapToRow(){

const card=document.querySelector(".card")
const cardHeight=card.offsetHeight+14

const row=Math.round(window.scrollY/cardHeight)

window.scrollTo({
top:row*cardHeight,
behavior:"smooth"
})

}



function placePomeloDuringScroll(){

if(selectedScreenPosition===null) return

const card=document.querySelector(".card")
const cardHeight=card.offsetHeight+14

const firstRow=Math.floor(window.scrollY/cardHeight)

const targetIndex=firstRow*2+selectedScreenPosition

if(pomeloIndex===targetIndex) return

if(pomeloIndex!==null){

let name=productNames[pomeloIndex%productNames.length]

products[pomeloIndex]={
name:name,
price:(80+Math.floor(Math.random()*200))+" ₽",
img:"https://source.unsplash.com/300x300/?"+encodeURIComponent(name)+",food,isolated,white"
}

}

products[targetIndex]={

name:"Помело",
price:"199 ₽",
img:"https://upload.wikimedia.org/wikipedia/commons/6/6c/Pomelo_fruit.jpg"

}

pomeloIndex=targetIndex

render()

}
