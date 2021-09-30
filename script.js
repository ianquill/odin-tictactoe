let gameBoard = (function() {
    'use strict'
    // create board
    const board = [];
    
    function createBoard (width, height) {

        for (let i = 0; i < width; i++) {
            board[i] = [];
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                board[i][j] = "empty";
            }
            
        }

        return board;

    }

    function checkCell (i, j) {
        // check cell position at board[i][j] if it has a value stored
        if (board[i][j] === "empty") {
            board[i][j] = gameController.getCurrentPlayer();
        } else {
            return;
        }

        checkForWin(i, j, gameController.getCurrentPlayer());
        
    }
    
    function checkForWin(yCord, xCord, player) {

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {

                if (board[y][x] === player) {
                    // console.log(`found ${player} at ${x}, ${y}`);
                    if (board[yCord][x+1] === player) {
                        // console.log("found horizontal pair");
                        if (board[yCord][x+2] === player) {
                            console.log("CONGRATS you've found a horizontal match 3");
                        } else break;
                    }
                    if (y < 2 && board[y+1][xCord] === player) {
                        // console.log("found vertical pair");
                        if (y < 1 && board[y+2][xCord] === player) {
                            console.log("CONGRATS you've found a vertical match 3");
                        } else break;
                    }
                    if (y < 2 && board[y+1][x+1] === player) {
                        if (y < 1 && board[y+2][x+2] === player) {
                            console.log("CONGRATS you've found a diagonal match3");
                        } else break;
                    }
                    if (y < 2 && board[y+1][x-1] === player) {
                        if (y < 1 && board[y+2][x-2] === player) {
                            console.log("CONGRATS 2you've found a diagonal match 3");
                        } else break;
                    }
                }
            }
            
        }
    }

    function checkDistance(cord1, cord2) {
        let distance = cord1 - cord2;
        if (distance < 0) {
            distance *= -1;
        } 
        return distance;
    }
    // clear board 
    return { createBoard, checkCell, board };

})();

let displayController = (function() {
    'use strict'

    const gameContainer = document.querySelector(".game-container");

    function refreshBoard() {

        clearBoard();
        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add("cell");
                
                if (gameBoard.board[i][j] === "player1") {
                    cell.textContent = "O";
                } else if (gameBoard.board[i][j] === "player2") {
                    cell.textContent = "X";
                }

                cell.addEventListener('click', () => {
                    gameController.clickCell(i, j);
                })

                gameContainer.appendChild(cell);
                
            }

        }
        
    }

    function clearBoard() {
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
    };

    return {refreshBoard};

})();

const Player = (name) => {

}

const player1 = Player("Ian");
const player2 = Player("Eleanor");

const gameController = (function() {
    'use strict'

    let currentPlayer = "player1";    // eventually add a function that randomizes this starting value

    function clickCell(i, j) {
        gameBoard.checkCell(i, j);
        displayController.refreshBoard();
        switchPlayer();
        // check gameBoard for the specific cell
            // displayController.updateBoard();
            // if legal, displayController is updated
            // and update gameController to check for win condition
    }
    
    function switchPlayer() {
        if (currentPlayer === "player1") {
            currentPlayer = "player2";
        } else if (currentPlayer === "player2") {
            currentPlayer = "player1";
        }
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    return {clickCell, getCurrentPlayer}

})();


console.log(gameBoard.createBoard(3, 3));

displayController.refreshBoard();