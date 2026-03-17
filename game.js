const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

/* physics */
let gravity = 0.6;
let lift = -9;
let velocity = 0;
let birdY = 250;

/* game */
let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappyHigh") || 0;
let gameOver = false;

/* visuals */
let bgX = 0;
let frame = 0;
let wingTick = 0;
let scoreScale = 1;

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

document.body.onclick = ()=>{
instructionsBox.style.display="none";
};

/* controls */
document.addEventListener("keydown", e=>{

if(e.code === "Space"){
e.preventDefault();
flap();
}

if(e.code === "KeyR"){
restartGame();
}

});

canvas.addEventListener("mousedown", flap);
canvas.addEventListener("touchstart", flap);

function flap(){
if(gameOver) return;
velocity = lift;
}

/* restart */
restartBtn.onclick = restartGame;

function restartGame(){
pipes = [];
velocity = 0;
birdY = 250;
score = 0;
frame = 0;
gameOver = false;
gameOverBox.style.display = "none";
}

/* pipe creation */
function createPipe(){

let gap = 170;
let top = Math.random()*220 + 60;

pipes.push({
x: canvas.width,
top: top,
bottom: top + gap,
passed: false
});

}

/* update */
function update(){

if(gameOver) return;

velocity += gravity;
birdY += velocity;

frame++;
wingTick++;

/* spawn pipes */
if(frame % 100 === 0){
createPipe();
}

/* scroll background */
bgX -= 1;
if(bgX <= -canvas.width) bgX = 0;

for(let pipe of pipes){

pipe.x -= 2;

/* score */
if(!pipe.passed && pipe.x < 80){
pipe.passed = true;
score++;
scoreScale = 1.4;

if(score > highScore){
highScore = score;
localStorage.setItem("flappyHigh", highScore);
}
}

/* COLLISION (FIXED CLEAN BOX) */
let birdLeft = 85;
let birdRight = 115;
let birdTop = birdY + 5;
let birdBottom = birdY + 35;

let pipeLeft = pipe.x;
let pipeRight = pipe.x + 60;

if(birdRight > pipeLeft && birdLeft < pipeRight){

/* ONLY check when inside pipe width */
if(birdTop < pipe.top || birdBottom > pipe.bottom){
endGame();
}

}

}

/* ground */
if(birdY < 0 || birdY + 40 > canvas.height){
endGame();
}

/* score animation */
scoreScale += (1 - scoreScale)*0.15;

}

function endGame(){
gameOver = true;
gameOverBox.style.display = "block";
}

/* draw */
function draw(){

ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

/* bird animation */
let flapOffset = Math.sin(wingTick * 0.3) * 4;

/* 🔥 VISIBILITY FIX (GLOW BACK) */
ctx.save();
ctx.shadowColor = "yellow";
ctx.shadowBlur = 12;
ctx.drawImage(birdImg, 80, birdY + flapOffset, 40, 40);
ctx.restore();

/* pipes */
for(let pipe of pipes){

ctx.drawImage(pipeImg, pipe.x, 0, 60, pipe.top);

let bottomHeight = canvas.height - pipe.bottom;
ctx.drawImage(pipeImg, pipe.x, pipe.bottom, 60, bottomHeight);

}

/* score */
ctx.fillStyle = "white";
ctx.font = `${30 * scoreScale}px Arial`;
ctx.fillText(score, 20, 40);

/* high score */
ctx.font = "18px Arial";
ctx.fillText("High: " + highScore, 20, 70);

}

/* loop */
function loop(){
update();
draw();
requestAnimationFrame(loop);
}

loop();
