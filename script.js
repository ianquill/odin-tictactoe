let gameBoard = (function() {
    'use strict'
    // create board

    function createBoard (width, height) {
        const board = new Array(width);
    
        for (let i = 0; i < board.length; i++) {
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
    return { createBoard };

})();

let displayController = (function() {

})();

let gameController = (function() {

})();

console.log(gameBoard.createBoard(3, 3));
console.log("hello");