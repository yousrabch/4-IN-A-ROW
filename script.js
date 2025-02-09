
const mahmoud = {
 
    ball : undefined,
    balls : document.querySelector(".balls"),
    columns : document.querySelectorAll(".colum"),
    line : document.querySelector(".line"),
    score : document.querySelector(".score"),
    reset : document.querySelector(".reset button"),
    playAgainBtn: document.querySelector(".play-again .button-85"),
    columnsdiv : document.querySelector(".colums")
};

const game = {

   player : "player2",
    board : [],
    dimension: { rows: 6, columns: 7 },
    ball : {
        position: { row: -1, column: 3 }, DEFAULT_POSITION: { row: -1, column: 3 } },

        isBallFalling: false,
        score : {player1 : 0, player2 : 0, key:"keyscore" },
        sounds: {
            collision: new Audio('./mp3/collision.mp3'),
            selectColumn: new Audio('./mp3/select-column.mp3'),
            scratch: new Audio('./mp3/scratch.mp3'),
          },
    }

    const savedScore = JSON.parse(localStorage.getItem(game.score.key));
    console.log(savedScore);
if (savedScore) {
  game.score.player1 = savedScore.player1;
  game.score.player2 = savedScore.player2;
}


    function resetBoard() {
        for (let r = 0; r < game.dimension.rows; r++) {
          game.board[r] = [];
          for (let c = 0; c < game.dimension.columns; c++) {
            game.board[r][c] = "";
          }
        }
      }

      mahmoud.playAgainBtn.addEventListener("click", startGame);
      mahmoud.columnsdiv.addEventListener("mouseleave", () =>{
                     game.ball.position.column = game.ball.DEFAULT_POSITION.column;             
      } )
      function startGame() {
        game.isBallFalling = false;
        mahmoud.balls.innerHTML = '';
        mahmoud.line.classList = ['line'];
        disableButtons(true);
        resetBoard();
        switchplayer();
        generateballs(game.player);
       
        addHoverEffectToColumns();
        updateScore();
      }
      startGame();

      function disableButtons(state) {
 
        mahmoud.playAgainBtn.disabled = state;
      }

    

    
    mahmoud.columns.forEach((columnEl) => {
        columnEl.addEventListener('click', changeColumn);
        columnEl.addEventListener('click', play);
      });

      mahmoud.reset.addEventListener('click', () => {
 
        game.score.player1 = 0;
        game.score.player2 = 0;
        updateScore();

      })
    
        
      console.log(game.board);








      function play(evt){

        if(game.isBallFalling) return;
        game.isBallFalling = true;
        
        const { column } = evt.target.dataset;

        let empty = 0;

        for(let r = 0; r< game.dimension.rows ; r++){
            if(!game.board[r][column]){empty++;}
        }

        if(!empty){
            game.isBallFalling = false
            return;}
       
        let row = empty -1;
        let position = 0,
            speed = 0;

        function shootlibre(){

             speed += 0.1;
             position += speed; 
            mahmoud.ball.style.top = `${ mahmoud.ball.offsetTop + position}px`;
           // console.log(mahmoud.ball.offsetTop);
           console.log(calculrow(5));
            if(mahmoud.ball.offsetTop <= calculrow(row)){
            requestAnimationFrame(shootlibre);
           } else
           {
             mahmoud.ball.style.top = `${calculrow(row)}px`;
             game.sounds.collision.play();
             game.board[row][column] = game.player;
             
            
             const state = checkForFourInARow(game.board);
             if (state) {
               const { row, column, direction } = state;
               drawLine(row, column, direction);
               
               
               game.score[game.player]++;
               updateScore();
               removeHoverEffectFromColumns();

               mahmoud.reset.disabled = false ;
               mahmoud.playAgainBtn.disabled = false;
                console.log("game over");
                
                return;}
             console.log(game.board);
             
             generateballs(switchplayer());
             game.isBallFalling = false;
           }

           


        }
       
        requestAnimationFrame(shootlibre);

      }

      function addHoverEffectToColumns() {
        mahmoud.columns.forEach((column) => {
          column.classList.add('column-hover');
        });
      }


      function removeHoverEffectFromColumns() {
        mahmoud.columns.forEach((column) => {
          column.classList.remove('column-hover');
        });
      }


      function updateScore() {
       mahmoud.score.innerHTML = `${game.score.player1} - ${game.score.player2}`;
        localStorage.setItem(game.score.key, JSON.stringify(game.score));
      }

 function drawLine(row, column, direction) {
        // Set line position and rotation
        const offset = {
            top: 30,
            left: 25,
          };
          if (direction === 90) {offset.left = column*1.5 + 30 ;
                                   offset.top = 35;
          }

          if(direction === 53){   
                                    offset.top = 30;
          }
        
        mahmoud.line.style.top = `${row * 70  + offset.top }px`;
        mahmoud.line.style.left = `${column * 50  + offset.left }px`;
        mahmoud.line.style.transform = `rotate(${direction}deg)`;
       
        // Add direction-specific class
        const className = direction === 0 ? 'horizontal' : direction === 90 ? 'vertical' : 'diagonal';
       mahmoud.line.classList.add(className);
       console.log(className);
        // Play sound
       game.sounds.scratch.play();
      }
      //drawLine(5, 2, -53);


      function checkForFourInARow(board) {
        const rows = board.length;
        const cols = board[0].length;
      
        // Helper function to check if four values are the same and not null
        const areSame = (a, b, c, d) => a && a === b && a === c && a === d;
      
        // Check all possible directions
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (c + 3 < cols && areSame(board[r][c], board[r][c+1], board[r][c+2], board[r][c+3])) {
              return { row: r, column: c, direction: 0 }; // Horizontal
            }
            if (r + 3 < rows && areSame(board[r][c], board[r+1][c], board[r+2][c], board[r+3][c])) {
              return { row: r, column: c, direction: 90 }; // Vertical
            }
            if (r + 3 < rows && c + 3 < cols && areSame(board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3])) {
              return { row: r, column: c, direction: 53 }; // Diagonal (top-left to bottom-right)
            }
            if (r - 3 >= 0 && c + 3 < cols && areSame(board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3])) {
              return { row: r, column: c, direction: -53 }; // Diagonal (bottom-left to top-right)
            }
          }
        }
      
        return false; // No four in a row found
      }

     
function placeball(row, column){
    
    mahmoud.ball.style.top =  `${row * 70  }px` ;    
    mahmoud.ball.style.left = `${column * 50 }px`;

}

function calculrow(row){
    let newrow =  row * 70 
    return newrow  ;
    console.log(newrow);
    
}


function changeColumn(evt) {
    const { column } = evt.target.dataset;
    console.log(evt.target.dataset);
    
    game.ball.position.column = column;
  
    if (!game.isBallFalling) {
      game.sounds.selectColumn.play();
      placeball(game.ball.position.row, game.ball.position.column);
    }
  }

  

function switchplayer()
{

    if (game.player == "player1"){
                game.player = "player2";
    }else{
        game.player = "player1";
    }
    return game.player;
}

function generateballs(player){
   

 mahmoud.ball = document.createElement("div");
mahmoud.ball.setAttribute("class",player);



mahmoud.balls.appendChild(mahmoud.ball);

mahmoud.ball.style.top =   "-70px" ;    
mahmoud.ball.style.left = "150px" ;



}






