
var ball ;

function placeball(row, column){
    
    ball.style.top =   `${row * 70   }px` ;    
    ball.style.left = `${column * 50 }px`;
}



function generateballs(player){

 ball = document.createElement("div");
ball.setAttribute("class",player);

const balls = document.querySelector(".balls");

balls.appendChild(ball);

ball.style.top =   "-70px" ;    
ball.style.left = "150px" ;



}

generateballs("player2");
placeball(2, 5);



console.log(ball);