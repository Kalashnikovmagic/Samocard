const grid = document.getElementById("grid")

let selectedScreenPosition=null
let pomeloIndex=null

// список продуктов с относительными путями к твоим фото
const productsData=[
{name:"Молоко", img:"images/products/milk.jpg"},
{name:"Яйца", img:"images/products/eggs.jpg"},
{name:"Хлеб", img:"images/products/bread.jpg"},
{name:"Бананы", img:"images/products/banana.jpg"},
{name:"Яблоки", img:"images/products/apple.jpg"},
{name:"Сыр", img:"images/products/cheese.jpg"},
{name:"Йогурт", img:"images/products/yogurt.jpg"},
{name:"Шоколад", img:"images/products/chocolate.jpg"},
{name:"Печенье", img:"images/products/cookies.jpg"}
]

let products=[]
for(let i=0;i<400;i++){
  let item = productsData[i % productsData.length]
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
      <div class="productName">${p.name}</div>
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

// выбор позиции на экране
grid.addEventListener("click",(e)=>{
  const cards=document.querySelectorAll(".card")
  cards.forEach((card,i)=>{
    const r=card.getBoundingClientRect()
    if(e.clientX>r.left && e.clientX<r.right && e.clientY>r.top && e.clientY<r.bottom){
      selectedScreenPosition = i % 6
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
  window.scrollTo({top:row*cardHeight, behavior:"smooth"})
}

function placePomeloDuringScroll(){
  if(selectedScreenPosition===null) return
  const card=document.querySelector(".card")
  const cardHeight=card.offsetHeight+6
  const firstRow=Math.floor(window.scrollY/cardHeight)
  const targetIndex=firstRow*2 + selectedScreenPosition
  if(pomeloIndex===targetIndex) return
  products[targetIndex]={
    name:"Помело",
    price:"199 ₽",
    img:"images/pomelo.jpg"
  }
  pomeloIndex=targetIndex
  render()
}
