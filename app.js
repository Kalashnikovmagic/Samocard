const grid = document.getElementById("grid")

let products=[]

// создаём много товаров
for(let i=1;i<=200;i++){

products.push({
name:"Товар "+i,
price:(50+i)+" ₽",
img:"https://picsum.photos/200?random="+i
})

}

let selectedScreenPosition=null
let pomeloIndex=null

function render(){

grid.innerHTML=""

products.forEach((p,i)=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="${p.img}">
<div class="title">${p.name}</div>
<div class="price">${p.price}</div>
`

grid.appendChild(card)

})

}

render()

// splash экран
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

selectedScreenPosition=i % 6

console.log("Выбрана позиция экрана:",selectedScreenPosition)

}

})

})



// свайп
let startY=0

window.addEventListener("touchstart",(e)=>{

startY=e.touches[0].clientY

})



window.addEventListener("touchend",(e)=>{

let endY=e.changedTouches[0].clientY

if(endY-startY>80){

setTimeout(placePomelo,200)

}

})



function placePomelo(){

if(selectedScreenPosition===null) return

const card=document.querySelector(".card")

const cardHeight=card.offsetHeight+10

const scrollY=window.scrollY

const firstVisibleRow=Math.floor(scrollY/cardHeight)

const targetIndex=firstVisibleRow*2+selectedScreenPosition

// если раньше уже было помело — вернуть товар
if(pomeloIndex!==null){

products[pomeloIndex]={
name:"Товар "+pomeloIndex,
price:(50+pomeloIndex)+" ₽",
img:"https://picsum.photos/200?random="+pomeloIndex
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