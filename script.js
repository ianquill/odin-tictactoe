let gameBoard = (function() {
    'use strict'
    // create board
    const board = [];
    
    function createBoard (width, height) {

        for (let i = 0; i < width; i++) {
            board[i] = [];
        }

        let h = 0;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                board[i][j] = h++;
                
            }
            
        }

        return board;

    }

    // clear board 
    return { createBoard, board };

})();

let displayController = (function() {
    const gameContainer = document.querySelector(".game-container");

    function displayBoard() {

        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add("cell");
                gameContainer.appendChild(cell);
                
            }

        }
        
    }

    return {displayBoard};

})();

let gameController = (function() {

})();

let Player = (name) => {

}

console.log(gameBoard.createBoard(3, 3));
console.log("hello");

displayController.displayBoard();