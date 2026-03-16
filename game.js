const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let gravity = 0.5;
let velocity = 0;
let birdY = 250;
let birdRotation = 0;

let pipes = [];
let frame = 0;
let score = 0;

let gameRunning = false;
let gameOver = false;

let bgX = 0;

const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

document.addEventListener("keydown", e=>{
if(e.code === "Space" && gameRunning){
velocity = -8;
}
});

document.getElementById("startBtn").onclick = startGame;
document.getElementById("restartBtn").onclick = restartGame;

const infoButton = document.getElementById("infoButton");
const instructions = document.getElementById("instructions");

infoButton.onclick = ()=>{
instructions.style.display =
instructions.style.display === "none" ? "block" : "none";
};

function startGame(){

document.getElementById("startScreen").style.display="none";
gameRunning = true;

}

function restartGame(){

pipes = [];
birdY = 250;
velocity = 0;
frame = 0;
score = 0;
gameOver = false;

document.getElementById("gameOverScreen").style.display="none";

gameRunning = true;

}

function createPipe(){

let gap = 170;
let topHeight = Math.random()*250 + 50;

pipes.push({
x: canvas.width,
top: topHeight,
bottom: canvas.height - topHeight - gap,
passed:false
});

}

function update(){

if(!gameRunning || gameOver) return;

velocity += gravity;
birdY += velocity;

birdRotation = velocity * 3;

frame++;

if(frame % 110 === 0){
createPipe();
}

bgX -= 1;

if(bgX <= -canvas.width){
bgX = 0;
}

pipes.forEach(pipe=>{

pipe.x -= 2;

if(!pipe.passed && pipe.x < 80){
score++;
pipe.passed = true;
}

let birdLeft = 80;
let birdRight = 120;
let birdTop = birdY;
let birdBottom = birdY + 40;

let pipeLeft = pipe.x;
let pipeRight = pipe.x + 60;

if(birdRight > pipeLeft && birdLeft < pipeRight){

if(birdTop < pipe.top || birdBottom > canvas.height - pipe.bottom){
triggerGameOver();
}

}

});

if(birdY < 0 || birdY + 40 > canvas.height){
triggerGameOver();
}

}

function triggerGameOver(){

gameOver = true;
gameRunning = false;

document.getElementById("gameOverScreen").style.display="block";

}

function draw(){

ctx.drawImage(bgImg,bgX,0,canvas.width,canvas.height);
ctx.drawImage(bgImg,bgX + canvas.width,0,canvas.width,canvas.height);

ctx.save();

ctx.translate(100,birdY+20);
ctx.rotate(birdRotation * Math.PI / 180);

ctx.drawImage(birdImg,-20,-20,40,40);

ctx.restore();

pipes.forEach(pipe=>{

ctx.drawImage(pipeImg,pipe.x,0,60,pipe.top);

ctx.save();
ctx.scale(1,-1);
ctx.drawImage(pipeImg,pipe.x,-canvas.height + pipe.bottom,60,pipe.bottom);
ctx.restore();

});

ctx.fillStyle="black";
ctx.font="30px Arial";
ctx.fillText(score,20,40);

}

function loop(){

update();
draw();
requestAnimationFrame(loop);

}

loop();
