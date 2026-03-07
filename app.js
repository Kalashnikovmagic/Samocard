const grid = document.getElementById("grid")

let products=[]

// создаём список товаров
for(let i=1;i<=300;i++){
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


// выбор позиции НА ЭКРАНЕ
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

selectedScreenPosition = i % 6

console.log("Выбрана позиция экрана:",selectedScreenPosition)

}

})

})


// отслеживаем скролл
let scrollTimer=null

window.addEventListener("scroll",()=>{

clearTimeout(scrollTimer)

scrollTimer=setTimeout(()=>{

placePomelo()

},150)

})



function placePomelo(){

if(selectedScreenPosition===null) return

const card=document.querySelector(".card")

const cardHeight = card.offsetHeight + 10

const scrollY = window.scrollY

const firstVisibleRow = Math.floor(scrollY / cardHeight)

const targetIndex = firstVisibleRow*2 + selectedScreenPosition


// убрать старое помело
if(pomeloIndex!==null){

products[pomeloIndex]={
name:"Товар "+pomeloIndex,
price:(50+pomeloIndex)+" ₽",
img:"https://picsum.photos/200?random="+pomeloIndex
}

}


// поставить новое
products[targetIndex]={
name:"Помело",
price:"199 ₽",
img:"https://upload.wikimedia.org/wikipedia/commons/6/6c/Pomelo_fruit.jpg"
}

pomeloIndex=targetIndex

render()

}