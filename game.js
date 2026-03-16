const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

/* physics */

let gravity = 0.6;
let flapStrength = -9;
let velocity = 0;

let birdY = 250;
let birdFrame = 0;

let pipes = [];
let frame = 0;

let score = 0;
let highScore = localStorage.getItem("flappyHigh") || 0;

let scoreScale = 1;

let gameOver = false;

let bgX = 0;

/* images */

const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

/* UI */

const restartBtn = document.getElementById("restartBtn");
const gameOverBox = document.getElementById("gameOverBox");

const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsBox = document.getElementById("instructionsBox");

instructionsBtn.onclick = (e)=>{
e.stopPropagation();
instructionsBox.style.display="block";
};

document.body.onclick=()=>{
instructionsBox.style.display="none";
};

/* controls */

document.addEventListener("keydown",e=>{

if(e.code==="Space"){
e.preventDefault();
flap();
}

if(e.code==="KeyR"){
restartGame();
}

});

canvas.addEventListener("touchstart",flap);
canvas.addEventListener("mousedown",flap);

function flap(){

if(gameOver) return;

velocity = flapStrength;

}

/* restart */

restartBtn.onclick=restartGame;

function restartGame(){

pipes=[];
birdY=250;
velocity=0;

score=0;
frame=0;

gameOver=false;

gameOverBox.style.display="none";

}

/* pipe generation */

function createPipe(){

let gap = 170;

/* one opening only */

let topHeight = Math.random()*220 + 80;

pipes.push({
x:canvas.width,
top:topHeight,
bottom:topHeight+gap,
passed:false
});

}

/* update */

function update(){

if(gameOver) return;

velocity += gravity;
birdY += velocity;

frame++;

/* bird animation */

birdFrame++;
if(birdFrame>20) birdFrame=0;

if(frame%100===0){
createPipe();
}

/* background scroll */

bgX-=1;
if(bgX<=-canvas.width) bgX=0;

for(let pipe of pipes){

pipe.x-=2;

/* scoring */

if(!pipe.passed && pipe.x<80){

score++;
pipe.passed=true;

scoreScale=1.5;

if(score>highScore){

highScore=score;
localStorage.setItem("flappyHigh",highScore);

}

}

/* collision */

let birdLeft=90;
let birdRight=110;
let birdTop=birdY+5;
let birdBottom=birdY+35;

let pipeLeft=pipe.x;
let pipeRight=pipe.x+60;

if(birdRight>pipeLeft && birdLeft<pipeRight){

if(birdTop<pipe.top || birdBottom>pipe.bottom){
endGame();
}

}

}

/* ground */

if(birdY<0 || birdY+40>canvas.height){
endGame();
}

/* score animation */

scoreScale += (1-scoreScale)*0.1;

}

function endGame(){

gameOver=true;
gameOverBox.style.display="block";

}

/* draw */

function draw(){

ctx.drawImage(bgImg,bgX,0,canvas.width,canvas.height);
ctx.drawImage(bgImg,bgX+canvas.width,0,canvas.width,canvas.height);

/* animated bird wings */

let wingOffset = Math.sin(birdFrame*0.3)*4;

ctx.drawImage(birdImg,80,birdY+wingOffset,40,40);

/* pipes */

for(let pipe of pipes){

ctx.drawImage(pipeImg,pipe.x,0,60,pipe.top);

let bottomHeight=canvas.height-pipe.bottom;

ctx.drawImage(pipeImg,pipe.x,pipe.bottom,60,bottomHeight);

}

/* score */

ctx.fillStyle="white";
ctx.font=`${30*scoreScale}px Arial`;
ctx.fillText(score,20,40);

/* high score */

ctx.font="18px Arial";
ctx.fillText("High: "+highScore,20,70);

}

/* loop */

function loop(){

update();
draw();
requestAnimationFrame(loop);

}

loop();
