const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//------------------------------------------------------------------------//
//objects properties 
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score:0
}
const computer = {
    x: canvas.width-10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score:0
}
const ball ={
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "red"
}

//-------------------------------------------------------------------------//
//functions to draw
function drawrect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}
//drawrect(0,0,canvas.width,canvas.height,"black");
function drawcircle(x,y,r,color){
    context.fillStyle = color;
    context.beginPath(); 
    context.arc(x,y,r,0,2*Math.PI,false);
    context.closePath();
    context.fill();
}
//drawcircle(100,100,50,"red");
function drawtext(text,x,y,color){
    context.fillStyle = color;
    context.font = "40px arial";
    context.fillText(text,x,y);
}
//drawtext("Yadhu",200,150,"white");

//=----------------------------------------------------------------------------//


//game logic realted functions and core functions //

function render(){
    //clear the canvas
    drawrect(0,0,canvas.width,canvas.height,"black");
    //no net needed
    //score board
    drawtext(user.score,canvas.width/4, canvas.height/5, "white");
    drawtext(computer.score,3*canvas.width/4, canvas.height/5, "white");
    //padle for both player
    drawrect(user.x, user.y, user.width, user.height, user.color);
    drawrect(computer.x, computer.y, computer.width, computer.height, computer.color);

    //draw ball
    drawcircle(ball.x, ball.y, ball.radius, ball.color);
}
//paddle movements 
canvas.addEventListener("mousemove",mousepaddle);
function mousepaddle(event){
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height/2;
}


//collision functons 
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x +b.radius;

    p.top = p.y;
    p.bottom = p.y+p.height;
    p.left = p.x;
    p.right = p.x+p.width;

    return b.right > p.left && b.bottom > p.top && b.left<p.right && b.top<p.bottom;
}

//resetball
function resetball(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = - ball.velocityX;
}

//update funciton for the game:
function update(){
    ball.x +=ball.velocityX;
    ball.y +=ball.velocityY;

    //computer contrl
    let computerlevel = 0.1;
    computer.y = computer.y + (ball.y - (computer.y + computer.height/2)) * computerlevel;

    if (ball.y+ball.radius > canvas.height || ball.y-ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : computer;
    if( collision(ball, player)){
        // always predictcvaleball.velocityX = -ball.velocityX;
        let collidepoint = ball.y - (player.y + player.height/2);
        collidepoint = collidepoint / (player.height/2);
        let direction = (ball.x < canvas.width/2) ? 1:-1;
        let angle = collidepoint * Math.PI/4;

        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = direction * ball.speed * Math.sin(angle);

        ball.speed += 0.2;
    }
    //sores
    //computer score 
    if(ball.x-ball.radius < 0){
        computer.score +=1;
        resetball();
    }
    else if( ball.x+ball.radius >canvas.width){
        user.score +=1;
        resetball();
    }
}


//game function for initaliseing
function game(){
    update();
    render();
}

const framepersecond = 50;
setInterval(game, 1000/framepersecond);