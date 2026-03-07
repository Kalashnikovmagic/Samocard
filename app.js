const grid = document.getElementById("grid")

let products=[]

for(let i=1;i<=80;i++){

products.push({
name:"Товар "+i,
price:(50+i)+" ₽",
img:"https://picsum.photos/200?random="+i
})

}

let secretIndex=null

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

secretIndex=i

console.log("Выбрана ячейка:",i)

}

})

})


let startY=0

window.addEventListener("touchstart",(e)=>{

startY=e.touches[0].clientY

})

window.addEventListener("touchend",(e)=>{

let endY=e.changedTouches[0].clientY

if(endY-startY>80){

if(secretIndex!==null){

products[secretIndex]={
name:"Помело",
price:"199 ₽",
img:"https://upload.wikimedia.org/wikipedia/commons/6/6c/Pomelo_fruit.jpg"
}

render()

}

}

})