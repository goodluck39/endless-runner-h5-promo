const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {x:100,y:canvas.height-150,width:64,height:64,vy:0,jumping:false};
let gravity = 1;
let obstacles = [];
let coins = [];
let score = 0;
let gameOver = false;

let playerImg = new Image(); playerImg.src = "assets/player.png";
let obstacleImg = new Image(); obstacleImg.src = "assets/obstacle.png";
let coinImg = new Image(); coinImg.src = "assets/coin.png";

function spawnObstacle(){
  obstacles.push({x:canvas.width, y:canvas.height-100, width:48, height:48});
}
function spawnCoin(){
  coins.push({x:canvas.width, y:canvas.height-200, width:28, height:28});
}

function update(){
  if(gameOver) return;
  player.vy += gravity;
  player.y += player.vy;
  if(player.y > canvas.height-150){
    player.y = canvas.height-150;
    player.jumping = false;
  }
  obstacles.forEach(o => o.x -= 6);
  coins.forEach(c => c.x -= 6);
  if(Math.random()<0.02) spawnObstacle();
  if(Math.random()<0.01) spawnCoin();
  obstacles = obstacles.filter(o => o.x + o.width > 0);
  coins = coins.filter(c => c.x + c.width > 0);
  obstacles.forEach(o => {
    if(player.x < o.x+o.width && player.x+player.width > o.x && player.y < o.y+o.height && player.y+player.height > o.y){
      gameOver = true;
      document.getElementById("restartBtn").style.display="block";
    }
  });
  coins.forEach((c,i)=>{
    if(player.x < c.x+c.width && player.x+player.width > c.x && player.y < c.y+c.height && player.y+player.height > c.y){
      score += 10;
      coins.splice(i,1);
      document.getElementById("score").innerText = "Score: " + score;
    }
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  obstacles.forEach(o => ctx.drawImage(obstacleImg,o.x,o.y,o.width,o.height));
  coins.forEach(c => ctx.drawImage(coinImg,c.x,c.y,c.width,c.height));
  if(gameOver){
    ctx.fillStyle="white";
    ctx.font="40px Arial";
    ctx.fillText("Game Over", canvas.width/2-100, canvas.height/2);
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

window.addEventListener("keydown", e => {
  if(e.code==="Space" && !player.jumping){
    player.vy = -20;
    player.jumping = true;
  }
});

function restartGame(){
  obstacles = [];
  coins = [];
  score = 0;
  player.y = canvas.height-150;
  player.vy = 0;
  gameOver = false;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("restartBtn").style.display="none";
}
