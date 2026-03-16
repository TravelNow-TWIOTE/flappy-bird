const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let gravity = 0.5;
let velocity = 0;
let birdY = 250;

let pipes = [];
let frame = 0;
let score = 0;

let gameOver = false;

let bgX = 0;

const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

const restartBtn = document.getElementById("restartBtn");
const gameOverBox = document.getElementById("gameOverBox");

const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsBox = document.getElementById("instructionsBox");

instructionsBtn.onclick = (e)=>{
e.stopPropagation();
instructionsBox.style.display = "block";
};

document.body.onclick = ()=>{
instructionsBox.style.display = "none";
};

document.addEventListener("keydown", e=>{

if(e.code === "Space"){
e.preventDefault();
flap();
}

if(e.code === "KeyR"){
restartGame();
}

});

canvas.addEventListener("touchstart", flap);
canvas.addEventListener("mousedown", flap);

function flap(){

if(gameOver) return;

velocity = -8;

}

restartBtn.onclick = restartGame;

function restartGame(){

pipes = [];
birdY = 250;
velocity = 0;
score = 0;
frame = 0;
gameOver = false;

gameOverBox.style.display = "none";

}

function createPipe(){

let gap = 180;
let topHeight = Math.random()*200 + 60;

pipes.push({
x: canvas.width,
top: topHeight,
bottom: topHeight + gap,
passed:false
});

}

function update(){

if(gameOver) return;

velocity += gravity;
birdY += velocity;

frame++;

if(frame % 110 === 0){
createPipe();
}

bgX -= 1;

if(bgX <= -canvas.width){
bgX = 0;
}

for(let pipe of pipes){

pipe.x -= 2;

if(!pipe.passed && pipe.x < 80){
score++;
pipe.passed = true;
}

let birdLeft = 85;
let birdRight = 115;
let birdTop = birdY + 5;
let birdBottom = birdY + 35;

let pipeLeft = pipe.x;
let pipeRight = pipe.x + 60;

if(birdRight > pipeLeft && birdLeft < pipeRight){

if(birdTop < pipe.top || birdBottom > pipe.bottom){
endGame();
}

}

}

if(birdY < 0 || birdY + 40 > canvas.height){
endGame();
}

}

function endGame(){

gameOver = true;
gameOverBox.style.display = "block";

}

function draw(){

ctx.drawImage(bgImg,bgX,0,canvas.width,canvas.height);
ctx.drawImage(bgImg,bgX + canvas.width,0,canvas.width,canvas.height);

ctx.save();

/* bird visibility boost */

ctx.shadowColor = "yellow";
ctx.shadowBlur = 10;

ctx.drawImage(birdImg,80,birdY,40,40);

ctx.restore();

for(let pipe of pipes){

ctx.drawImage(pipeImg,pipe.x,0,60,pipe.top);

let bottomHeight = canvas.height - pipe.bottom;

ctx.drawImage(pipeImg,pipe.x,pipe.bottom,60,bottomHeight);

}

ctx.fillStyle="white";
ctx.font="30px Arial";
ctx.fillText(score,20,40);

}

function loop(){

update();
draw();
requestAnimationFrame(loop);

}

loop();
