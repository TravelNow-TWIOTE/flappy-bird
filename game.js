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

const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

document.addEventListener("keydown", function(e){
if(e.code === "Space"){
velocity = -8;
}
});

function createPipe(){

let gap = 160;
let topHeight = Math.random()*250 + 50;

pipes.push({
x: canvas.width,
top: topHeight,
bottom: canvas.height - topHeight - gap,
passed:false
});

}

function update(){

if(gameOver) return;

velocity += gravity;
birdY += velocity;

frame++;

if(frame % 100 === 0){
createPipe();
}

for(let i=0;i<pipes.length;i++){

let pipe = pipes[i];
pipe.x -= 2;

if(!pipe.passed && pipe.x < 80){
score++;
pipe.passed = true;
}

if(
80 < pipe.x + 60 &&
80 + 40 > pipe.x
){

if(
birdY < pipe.top ||
birdY + 40 > canvas.height - pipe.bottom
){
gameOver = true;
}

}

}

if(birdY < 0 || birdY + 40 > canvas.height){
gameOver = true;
}

}

function draw(){

ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);

ctx.drawImage(birdImg,80,birdY,40,40);

for(let i=0;i<pipes.length;i++){

let pipe = pipes[i];

ctx.drawImage(pipeImg,pipe.x,0,60,pipe.top);

ctx.save();
ctx.scale(1,-1);
ctx.drawImage(pipeImg,pipe.x,-canvas.height + pipe.bottom,60,pipe.bottom);
ctx.restore();

}

ctx.fillStyle="black";
ctx.font="30px Arial";
ctx.fillText(score,20,40);

if(gameOver){
ctx.fillStyle="red";
ctx.font="40px Arial";
ctx.fillText("Game Over",110,300);
}

}

function loop(){

update();
draw();
requestAnimationFrame(loop);

}

loop();
