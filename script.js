let board;
let boardWidth=360;
let boardHeight=640;


let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
//let birdImg;
let birdImgs=[];
let birdImgIndex=0;
let lastTime = 0;
let bird={
    x:birdX,
    y:birdY,
    width:birdWidth,
    height:birdHeight
}


let pipeArray=[];
let pipesWidth=64;
let pipesHeight=512;
let pipesX=boardWidth;
let pipesY=0;

let topPipeImg;
let bottomPipeImg;


let velocityX=-2;
let velocityY=0;
let jumpStrength=-5.7;
let gravity=0.32;



let gameOver=false;
let score=0;

let wingSound=new Audio("sounds/sfx_wing.wav");
let hitSound=new Audio("sounds/sfx_hit.wav");
let bgmsound=new Audio("sounds/bgm_mario.mp3");
let scoreSound=new Audio("sounds/sfx_point.wav"); 
let die=new Audio("sounds/sfx_die.wav");
bgmsound.loop=true;

window.onload=function(){
    bgmsound.play();
board=document.getElementById("board");
board.height=boardHeight;
board.width=boardWidth;
context=board.getContext("2d");// used for dam drawing in the dam board

//context.fillStyle="green";
//context.fillRect(bird.x,bird.y,bird.width,bird.height);



    // birdImg=new Image();
    // birdImg.src="images/flappybird.png";
    // birdImg.onload=function(){
    // context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);


    for(let i=0; i<4;i++){
        let birdImg=new Image();
        birdImg.src=`images/flappybird${i}.png`;
        birdImgs.push(birdImg);
    }



topPipeImg=new Image();
topPipeImg.src="images/toppipe.png";
bottomPipeImg=new Image();
bottomPipeImg.src="images/bottompipe.png";

requestAnimationFrame(update);
this.setInterval(placePipes,1500);
setInterval(animateBird,100);


document.addEventListener("keydown",moveBird);
//document.addEventListener("mousedown",moveBird);
document.addEventListener("touchstart",moveBird,{ passive: false });
}
function update(time){ 
    requestAnimationFrame(update)
        if(!lastTime){
            lastTime=time;
        }
        let delta = (time - lastTime) / 16.67; 
    lastTime = time;
    
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    context.drawImage(birdImgs[birdImgIndex],bird.x,bird.y,bird.width,bird.height);

  

velocityY+=gravity*delta;
//bird.y = bird.y + velocityY;


bird.y = Math.max(bird.y + velocityY * delta, 0);

if(bird.y>board.height){
    gameOver=true;
    die.play();
}
for (let i=0;i<pipeArray.length;i++){
    let pipe=pipeArray[i];
    pipe.x+=velocityX;
    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
    
    if(!pipe.passed && bird.x>pipe.x+pipe.width){
        score+=0.5;
        scoreSound.play();
        pipe.passed=true;
    }
    
    if(checkCollision(bird,pipe)){
    gameOver=true;
    bgmsound.pause();
    hitSound.play(); 
}
}


while(pipeArray.length>0 && pipeArray[0].x<0-pipesWidth){
    pipeArray.shift();
}
context.fillStyle="white";
context.font="45px sans-serif";
context.fillText(score,5,45);

if(gameOver){
    bgmsound.pause();
    bgmsound.currentTime=0;
    context.fillText("GAME OVER",50,90);
}

}
function placePipes(){
if(gameOver){
    return;
}

let randomPipeY=pipesY-pipesHeight/4-Math.random()*(pipesHeight/2);
let openingSpace=board.height/4+20;



let topPipes={
img:topPipeImg,
x:pipesX,
y:randomPipeY,
width:pipesWidth,
height:pipesHeight,
passed:false
}


pipeArray.push(topPipes);


let bottomPipes={
    img:bottomPipeImg,
    x:pipesX,
    y:randomPipeY+pipesHeight+openingSpace,
    width:pipesWidth,
    height:pipesHeight,
    passed:false
}
pipeArray.push(bottomPipes);

}

function moveBird(e){
    if(e.type=="touchstart"){
        e.preventDefault();
    }
if(e.code=="Space"|| e.type === "touchstart"){
wingSound.play();
velocityY=jumpStrength;
bgmsound.play();



if(gameOver){
    bird.y=birdY;
    pipeArray=[];
    score=0;
    gameOver=false;
}


}
}

function checkCollision(a,b){

 return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}

function animateBird(){

    birdImgIndex++;
    birdImgIndex%=birdImgs.length;


}





