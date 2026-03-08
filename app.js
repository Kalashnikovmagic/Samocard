const grid = document.getElementById("grid")

let products=[]

// создаём много товаров
for(let i=1;i<=400;i++){

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

console.log("позиция экрана:",selectedScreenPosition)

}

})

})




// фиксированный скролл

let isScrolling=false

function scrollStep(){

if(isScrolling) return

const card=document.querySelector(".card")

const cardHeight=card.offsetHeight+10

const scrollAmount=cardHeight*3

isScrolling=true

window.scrollBy({
top:scrollAmount,
behavior:"smooth"
})

setTimeout(()=>{

isScrolling=false
placePomelo()

},400)

}



// свайп
let startY=0

window.addEventListener("touchstart",(e)=>{
startY=e.touches[0].clientY
})

window.addEventListener("touchend",(e)=>{

let endY=e.changedTouches[0].clientY

if(endY-startY>50){

scrollStep()

}

})




// появление помело

function placePomelo(){

if(selectedScreenPosition===null) return

const card=document.querySelector(".card")

const cardHeight=card.offsetHeight+10

const firstVisibleRow=Math.floor(window.scrollY/cardHeight)

const targetIndex=firstVisibleRow*2+selectedScreenPosition

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
