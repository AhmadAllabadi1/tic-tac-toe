const createPlayer = (name, marker,score) => {

    return {
     name,
     marker,
     score
    };

};


const gameBoard = (() => {

    const playerOne = createPlayer('Player 1' , 'X',0);
    const playerTwo = createPlayer('Player 2' , 'O',0 );
    
    currentPlayer = playerOne;
    
    gameOver = false

    gameDraw = false;

    winner = null;

    boardArray = ['','','','','','','','',''];

    winningCombinations = [[0,1,2],
                           [3,4,5],
                           [6,7,8],
                           [0,3,6],
                           [1,4,7],
                           [2,5,8],
                           [0,4,8],
                           [2,4,6]
    ];

    const generateBoard = () => {
        const gridContainer = document.getElementById("grid-container");
        for (let i = 0; i < 3; i++) {
            const row = document.createElement("div")
            row.classList.add("grid-row");
            for (let j = 0; j < 3; j++) {
              const gridItem = document.createElement('div');
              gridItem.classList.add('grid-item');
              if (i===0) {
                gridItem.style.borderTop = 'none'
              }

              if (j===0){
                gridItem.style.borderLeft = 'none';
              }

              if (j===2) {
                gridItem.style.borderRight = 'none';
              }

              if (i===2) {
                gridItem.style.borderBottom = 'none';
              }
              const boxNumber = i*3 + j + 1;
              gridItem.dataset.boxNumber = boxNumber;  
              row.appendChild(gridItem);
            };
            gridContainer.appendChild(row);
        };
    };



    const attachEventHandlers = () => {
        const boxes = document.querySelectorAll(".grid-item");
        boxes.forEach((box) => {
            box.addEventListener("click", handleClick);
            });
        }
    
        const handleClick = (event) => {
            handleBoxClick(event.target);
        }


    const detachEventHandlers = () => {
        const boxes = document.querySelectorAll(".grid-item");
        boxes.forEach((box) => {
            box.removeEventListener("click", handleClick);
            });
        }



    const handleBoxClick = (box) => {
        if (isValid(box.dataset.boxNumber-1)) {
        updateBoardArray(box.dataset.boxNumber); 
        updateBoard();
        switchPlayer();
        checkWinner();
        checkDraw();
        updatePlayerDisp();
        }
    }

    const updateBoardArray = (boxNum) => {
        boardArray[boxNum-1] = currentPlayer.marker
    }

    const switchPlayer = () => {
        if (currentPlayer===playerOne){
            currentPlayer=playerTwo
        }
        else{
            currentPlayer=playerOne;
        }
    }

    const updateBoard = () => {
        for (let i = 1; i < 10; i++ ) {
            const box = document.querySelector(`[data-box-number="${i}"]`);
            box.textContent = boardArray[i-1];
            /*if (boardArray[i-1]==='X') {
                box.style.color = '#4169E1'
            }
            else if (boardArray[i-1]==='O'){
                box.style.color = '#B22222'
            }*/
        };
    };


    const checkDraw = () => {
        if (!boardArray.includes('')) {
            gameDraw = true;
        }
    }


    const checkWinner = () => {
        markedXboxes = [];
        markedOboxes = [];
        for (let i = 0; i < 9; i++) {
            if (boardArray[i]==='X') {
                markedXboxes.push(i);
            }
            else if (boardArray[i]==='O') {
                markedOboxes.push(i);
            }
        }


        markedXboxes.sort((a, b) => a - b);
        for (let i = 0; i <= markedXboxes.length-3; i++) {
            let temp = markedXboxes.slice(i,i+3)
            winningCombinations.forEach((combo) => {
                if (combo.toString()===temp.toString()){
                    gameOver=true;
                    winner=playerOne;
                    showWinningCombo(temp[0]+1,temp[1]+1,temp[2]+1)
                }
            })
        }


        markedOboxes.sort((a, b) => a - b);
        for (let i = 0; i <= markedOboxes.length-3; i++) {
            let temp = markedOboxes.slice(i,i+3)
            winningCombinations.forEach((combo) => {
                if (combo.toString()===temp.toString()){
                    gameOver=true;
                    winner=playerTwo;
                    showWinningCombo(temp[0]+1,temp[1]+1,temp[2]+1)
                }
            })
        }

    };


    const isValid = (position) => {
        if (boardArray[position]!='') {
            return false;
        }

        else {return true};
    }

    const updatePlayerDisp = () => {
        const playerDisp = document.querySelector(".turn-disp");

        if (gameOver===true || gameDraw===true){
            gameDone();
        }
        else{
            if (currentPlayer===playerOne) {
                playerDisp.textContent = "Player One's turn"
            }

            else{
                playerDisp.textContent = "Player Two's turn"
            }
        }
    }

    const gameDone = () => {
        const playerDisp = document.querySelector(".turn-disp");
        detachEventHandlers();
        if (winner===playerOne) {
            playerDisp.textContent = "Player One Won!";
            playerOne.score+=1;
        }
        else if (gameDraw===true) {
            playerDisp.textContent = "It is a draw!"
        }
        else{
            playerDisp.textContent = "Player Two Won!";
            playerTwo.score+=1
        }
        const restartButton = document.getElementById("restart-btn");
        restartButton.classList.remove("hidden");
        updateScoreBoard();
    }
    

    const restartGame = () => {
        const restartBtn = document.getElementById("restart-btn");
        restartBtn.classList.add("hidden");
        const playerDisp = document.querySelector(".turn-disp");
        playerDisp.textContent = "Player One's turn";
        currentPlayer = playerOne;
    
        gameOver = false
        
        gameDraw = false
        winner = null;
    
        boardArray = ['','','','','','','','',''];

        updateBoard();
        undoWinningCombo();
        attachEventHandlers();
    };

    const updateScoreBoard = () => {
        const playerOneScore = document.getElementById("playerOne-score");
        const playerTwoScore = document.getElementById("playerTwo-score");

        playerOneScore.textContent = `Player One - ${playerOne.score}`;
        playerTwoScore.textContent = `Player Two - ${playerTwo.score}`;
   
    }

    const showWinningCombo = (x,y,z) => {
        const box1 = document.querySelector(`[data-box-number="${x}"]`)
        const box2 = document.querySelector(`[data-box-number="${y}"]`)
        const box3 = document.querySelector(`[data-box-number="${z}"]`)
        box1.style.color = '#FFA500'
        box2.style.color = '#FFA500'
        box3.style.color = '#FFA500'

    }


    const undoWinningCombo = () => {
        const boxes = document.querySelectorAll(".grid-item");
        boxes.forEach((box)=>{
            box.style.color = '#ce4d41';
        })
    }
    return {generateBoard, updateBoard,attachEventHandlers,checkWinner,restartGame};

})();




const gameFlow = (() => {
    const playerDisp = document.querySelector(".turn-disp");
    const playerOneScore = document.getElementById("playerOne-score");
    const playerTwoScore = document.getElementById("playerTwo-score");

    const playGame = () => {
        playerDisp.classList.remove("hidden");
        gameBoard.generateBoard();
        gameBoard.attachEventHandlers();
        playerOneScore.classList.remove("hidden");
        playerTwoScore.classList.remove("hidden");


    };

    return {playGame};
})();


const startButton = document.getElementById("strt-btn");
const playerDisp = document.querySelector(".turn-disp");
startButton.addEventListener("click", function () {
    startButton.classList.add("hidden");
    gameFlow.playGame();
})

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", function () {
    gameBoard.restartGame();
} )

