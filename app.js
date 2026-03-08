const grid = document.getElementById("grid")

let selectedScreenPosition=null
let pomeloIndex=null

const productsData=[
{name:"Молоко",img:"https://cdn-icons-png.flaticon.com/512/2674/2674486.png"},
{name:"Яйца",img:"https://cdn-icons-png.flaticon.com/512/837/837560.png"},
{name:"Хлеб",img:"https://cdn-icons-png.flaticon.com/512/3075/3075977.png"},
{name:"Бананы",img:"https://cdn-icons-png.flaticon.com/512/2909/2909760.png"},
{name:"Яблоки",img:"https://cdn-icons-png.flaticon.com/512/415/415733.png"},
{name:"Апельсины",img:"https://cdn-icons-png.flaticon.com/512/135/135620.png"},
{name:"Сыр",img:"https://cdn-icons-png.flaticon.com/512/685/685352.png"},
{name:"Йогурт",img:"https://cdn-icons-png.flaticon.com/512/3082/3082037.png"},
{name:"Шоколад",img:"https://cdn-icons-png.flaticon.com/512/1046/1046784.png"},
{name:"Печенье",img:"https://cdn-icons-png.flaticon.com/512/3081/3081986.png"},
{name:"Колбаса",img:"https://cdn-icons-png.flaticon.com/512/2718/2718224.png"},
{name:"Картофель",img:"https://cdn-icons-png.flaticon.com/512/2909/2909896.png"}
]

let products=[]

for(let i=0;i<400;i++){

let item=productsData[i%productsData.length]

products.push({
name:item.name,
price:(80+Math.floor(Math.random()*200))+" ₽",
img:item.img
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

<div class="productName">
${p.name}
</div>

<div class="priceButton">
<span>${p.price}</span>
<span class="plus">+</span>
</div>

`

grid.appendChild(card)

})

}

render()

setTimeout(()=>{
document.getElementById("splash").style.display="none"
},2000)



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

if(startY-endY>40){
startScroll()
}

})



function startScroll(){

if(scrolling) return

scrolling=true

const card=document.querySelector(".card")
const cardHeight=card.offsetHeight+6

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
const cardHeight=card.offsetHeight+6

const row=Math.round(window.scrollY/cardHeight)

window.scrollTo({
top:row*cardHeight,
behavior:"smooth"
})

}



function placePomeloDuringScroll(){

if(selectedScreenPosition===null) return

const card=document.querySelector(".card")
const cardHeight=card.offsetHeight+6

const firstRow=Math.floor(window.scrollY/cardHeight)

const targetIndex=firstRow*2+selectedScreenPosition

if(pomeloIndex===targetIndex) return

products[targetIndex]={
name:"Помело",
price:"199 ₽",
img:"https://upload.wikimedia.org/wikipedia/commons/6/6c/Pomelo_fruit.jpg"
}

pomeloIndex=targetIndex

render()

}
