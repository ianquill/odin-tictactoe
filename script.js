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
            console.log(gameController.getCurrentPlayer());
            board[i][j] = gameController.getCurrentPlayer();
            console.log("recorded " + gameController.getCurrentPlayer());
        } else {
            return;
        }
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
            console.log("changed to player2")
            console.log(currentPlayer);
        } else if (currentPlayer === "player2") {
            currentPlayer = "player1";
        }
        console.log("current player: ", gameController.currentPlayer);
        console.log("other current player: ", currentPlayer);
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    return {clickCell, getCurrentPlayer}

})();


console.log(gameBoard.createBoard(3, 3));

displayController.refreshBoard();