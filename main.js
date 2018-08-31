//canvas config

var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d')

//testing
//ctx.fillRect(0,0,50,50)
//variables globales
var pipes = []
var interval;
var frames= 0;
var images = {
  bg:"https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/bg.png?raw=true",
  flappy: "https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/flappy.png?raw=true",
  pipe1: "https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_bottom.png?raw=true",
  pipe2: "https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_top.png?raw=true"
}

//clases
class Board{
  constructor(){
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.image = document.createElement('img')
    this.image.src = images.bg
    this.image.onload = () => {
      this.draw()
    }
    this.music = new Audio()
    this.music.src = "http://66.90.93.122/ost/donkey-kong-country/ydosdpsk/04%20-%20DK%20Island%20Swing.mp3"
  }
  draw(){
    this.x--
    if(this.x < -canvas.width ) this.x = 0
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height)
    
    ctx.fillText(frames,10,20)
    ctx.font = '30px arial'
  }
} //Clase Board

class Flappy{
  constructor(){
    this.x = 100
    this.y = 150
    this.width = 40
    this.height = 30
    this.image = new Image()
    this.image.src = images.flappy
    this.image.onload = () => {
      this.draw()
    }
    this.gravity = 3
    this.crash = new Audio()
    this.crash.src = "Drill_Gear.mp3"
  }
  draw(){
    if(this.y < canvas.height-40)this.y += this.gravity
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
  }
  crashWith(item){
    var carh = (this.x < item.x + item.width)&&
            (this.x + this.width > item.x)&&
            (this.y < item.y + item.height)&&
            (this.y+this.height >item.y);
    if(carh) this.crash.play()
    return carh
  }
} // Clase Flappy

class Pipe {
  constructor(y,height,pipeName="pipe2"){
    this.x = canvas.width - 50
    this.y = y ? y : 0
    this.width = 50
    this.height = height || 100
    this.image = new Image()
    this.image.src = images[pipeName]
    this.image.onload = ()=>{
      this.draw()
    }
  }
  draw(){
  this.x-=2
  ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
  }
}//Clase Pipe

//instancias
var board = new Board()
var flappy  = new Flappy()
 
//funciones principales
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width,canvas.height)
    board.draw()
    flappy.draw()
    generatePipes()
    drawPipes()
    checkCollitions()
}

function start(){  
  if(interval)return
  interval = setInterval(update, 1000/60)
  pipes=[]
  frames = 0

}

function gameOver(){
  clearInterval(interval)
  ctx.font="80px Avenir"
  ctx.fillText("Game Over",50,250)
  ctx.font="50px Avenir"
  ctx.fillText("Press esc to Start",70,300)
  interval = null
  board.music.pause()
}

//funciones auxiliares
function generatePipes(){
  if(frames % 150 ===0){
    //1.- generar el tubo
    var y = 0;
    var alto = Math.floor(Math.random()*400) + 20
    var topPipe = new Pipe(y,alto,"pipe2")
    //2.- establecerel espacio  donde pasa flappy
    var window =150 
    var alto2  = canvas.height -(window+alto)
    //3.- generar el tubo de abajo 
    var bottomPipe = new Pipe (canvas.height -alto2,alto2,"pipe1")
    //4 donde
    pipes.push(topPipe)
    pipes.push(bottomPipe)
  } // if
}

function drawPipes(){
  pipes.forEach(function(pipe){
    pipe.draw()
  })
}

function checkCollitions(){
  pipes.forEach(function(pipe){
    if(flappy.crashWith(pipe)){
      gameOver()
    }
  })
}

//los observadores
addEventListener('keydown',function(e){
  if(e.keyCode===32){
    if (flappy.y>50)flappy.y -=70
  }
})

addEventListener('keydown',function(e){
  if(e.keyCode===27){
  start()
  board.music.play()
  }
})

