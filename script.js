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
        const _currentPlayer = gameController.getCurrentPlayer();

        if (board[i][j] === "empty") {
            board[i][j] = _currentPlayer;
            gameController.switchPlayer();
            gameController.addTurn();
        } else {
            return;
        }

        checkForWin(_currentPlayer);
        
    }
    
    function checkForWin(player) {

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {

                if (board[y][x] === player) {
                    // console.log(`found ${player} at ${x}, ${y}`);
                    if (board[y][x+1] === player) {
                        // console.log("found horizontal pair");
                        if (board[y][x+2] === player) {
                            console.log(`CONGRATS ${player} found a horizontal match 3`);
                        } else break;
                    }
                    if (y < 2 && board[y+1][x] === player) {
                        // console.log("found vertical pair");
                        if (y < 1 && board[y+2][x] === player) {
                            console.log(`CONGRATS ${player} found a vertical match 3`);
                        } else break;
                    }
                    if (y < 2 && board[y+1][x+1] === player) {
                        if (y < 1 && board[y+2][x+2] === player) {
                            console.log(`CONGRATS ${player} found a diagonal match3`);
                        } else break;
                    }
                    if (y < 2 && board[y+1][x-1] === player) {
                        if (y < 1 && board[y+2][x-2] === player) {
                            console.log(`CONGRATS ${player} found a diagonal match 3`);
                        } else break;
                    }
                }
            }
            
        }

        if (gameController.getTurnCounter() >= 9) {
            console.log("TIE GAME")
        }
    }

    function getBoard() {
        return board;
    }

    function setBoard(x, y, value) {
        gameBoard.board[y][x] = value;
    }

    return { createBoard, checkCell, board, getBoard, setBoard };

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
    let turnCounter = 0;

    function addTurn() {
        turnCounter++;
    }

    function getTurnCounter() {
        return turnCounter;
    }

    function clickCell(i, j) {
        gameBoard.checkCell(i, j);
        displayController.refreshBoard();
    }
    
    function switchPlayer() {
        if (currentPlayer === "player1") {
            currentPlayer = "player2";

            makeBestMove(findBestMove(gameBoard.getBoard()));
            displayController.refreshBoard();

        } else if (currentPlayer === "player2") {
            currentPlayer = "player1";
        }
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function evaluateBoard(board) {
        for (let row = 0; row < 3; row++)
        {
            if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
                if (board[row][0] == "player2")
                    return +10;
                else if (board[row][0] == "player1")
                    return -10;
            }
        }    

        for (let col = 0; col < 3; col++) {
            if (board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
                if (board[0][col] == "player2")
                    return +10;
                else if (board[0][col] == "player1")
                    return -10;
            }
        }

        if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            if (board[0][0] == "player2")
                return +10;
            else if (board[0][0] == "player1")
                return -10;
        }

        if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            if (board[0][2] == "player2")
                return +10;
            else if (board[0][2] == "player1")
                return -10;
        }

        return 0;

    }

    function minimax(board, depth, maximizingPlayer) {
        // check if game is over
        let score = evaluateBoard(board);

        if (score === 10)
            return score;
        if (score === -10)
            return score;
        if (getTurnCounter() >= 9)
            return 0;
        
        if (maximizingPlayer) {
            let maxEval = -1000;

            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    if (board[y][x] === "empty") {
                        gameBoard.setBoard(x, y, "player2");

                        maxEval = Math.max(maxEval, minimax(board, depth + 1, !maximizingPlayer));

                        gameBoard.setBoard(x, y, "empty");

                    }
                    
                }
                
            }
            return maxEval-depth;
        }

        else {
            let maxEval = 1000; 

            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {

                    if (board[y][x] === "empty") {

                        gameBoard.setBoard(x, y, "player1");
                        // console.log(board);

                        maxEval = Math.min(maxEval, minimax(board, depth + 1, !maximizingPlayer));

                        gameBoard.setBoard(x, y, "empty");

                    }
                }
            }
            return maxEval+depth;
        }
    }

    function findBestMove(board) {

        let bestVal = -1000;
        let bestMove = new Move();
        bestMove.row = -1;
        bestMove.col = -1;

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                
                if (board[y][x] === "empty") {
                    gameBoard.setBoard(x, y, "player2");
                    
                    let moveVal = minimax(board, 0, false);
                    gameBoard.setBoard(x, y, "empty");

                    if (moveVal > bestVal) {
                        bestMove.row = y;
                        bestMove.col = x;
                        bestVal = moveVal;
                    }
                }
                
            }


        }
        return bestMove;
    }

    function makeBestMove(bestMove) {
        clickCell(bestMove.row, bestMove.col);
        console.log(`clicked on ${bestMove.col}, ${bestMove.row}`);
    }

    class Move {
        constructor() {
            let row,col;
        }
    }

    return {clickCell, getCurrentPlayer, switchPlayer, getTurnCounter, addTurn, evaluateBoard, findBestMove, makeBestMove}

})();


console.log(gameBoard.createBoard(3, 3));

displayController.refreshBoard();