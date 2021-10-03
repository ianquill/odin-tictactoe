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

        checkForWin(board);
        
    }
    
    function checkForWin(board) {

        if (gameController.evaluateBoard(board) === 10) {
            displayController.displayModal("CPU Wins!");
        }
        else if (gameController.evaluateBoard(board) === -10) {
            displayController.displayModal("Player 1 Wins!");
        }
        else if (gameController.getTurnCounter() >= 8 && gameController.evaluateBoard(board) === 0) {
            displayController.displayModal("Tie Game!");
        }
    }

    function setBoard(x, y, value) {
        gameBoard.board[y][x] = value;
    }

    return { 
        createBoard, 
        checkCell, 
        board,
        setBoard
        };

})();

let displayController = (function() {

    const gameContainer = document.querySelector(".game-container");
    const modal = document.querySelector(".modal");
    const modalText = document.querySelector(".modalText");
    const modalOverlay = document.querySelector(".modalOverlay");
    const modalResetButton = document.querySelector(".modalButton");
    const currentPlayerText = document.querySelector(".current-player")

    modalResetButton.addEventListener('click', () => {
         gameController.resetGame();
        });


    function refreshBoard() {
        let _currentPlayer = '';
        if (gameController.getCurrentPlayer() === "player1") {
            _currentPlayer = "Player 1";
        } else if (gameController.getCurrentPlayer() === "player2") {
            _currentPlayer = "Player 2";
        }
        currentPlayerText.textContent = `${_currentPlayer}'s Turn`;

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

                    // fix this when you add choice between CPU and player vs. player
                    if (gameController.getCurrentPlayer() === "player1") {
                        gameController.clickCell(i, j);
                    }
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

    function displayModal(message) {
        modalText.textContent = message;
        modal.classList.remove("closed");
        modalOverlay.classList.remove("closed");
    }

    function clearModal() {
        modal.classList.add("closed");
        modalOverlay.classList.add("closed");
    }

    return {
        refreshBoard,
        displayModal,
        clearModal
    };

})();

const Player = (name) => {
    let wins = 0;
}

const player1 = Player("Ian");
const player2 = Player("Eleanor");

const gameController = (function() {

    let currentPlayer = "player1";    // eventually add a function that randomizes this starting value
    let turnCounter = 0;
    const turnTime = 500;             // time CPU waits before clicking on cell it has chosen

    function isOpenSpots(board) {
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (board[y][x] === "empty") {
                    return true;
                }
            }
        }
        return false;
    }

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

            makeBestMove(findBestMove(gameBoard.board));
            displayController.refreshBoard();

        } else if (currentPlayer === "player2") {
            currentPlayer = "player1";
        }
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function evaluateBoard(board) {

        // Evaluate Horizontally
        for (let row = 0; row < 3; row++)
        {
            if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                if (board[row][0] == "player2")
                    return +10;
                else if (board[row][0] == "player1")
                    return -10;
            }
        }    

        // Evaluate Vertically
        for (let col = 0; col < 3; col++) {
            if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                if (board[0][col] == "player2")
                    return +10;
                else if (board[0][col] == "player1")
                    return -10;
            }
        }

        // Evaluate Diagonally
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (board[0][0] == "player2")
                return +10;
            else if (board[0][0] == "player1")
                return -10;
        }

        // Evaluate Diagonally
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (board[0][2] == "player2")
                return +10;
            else if (board[0][2] == "player1")
                return -10;
        }

        return 0;

    }

    function minimax(board, depth, maximizingPlayer) {

        // check if game is over
        let _score = evaluateBoard(board);

        if (_score == 10)
            return _score;
        if (_score == -10)
            return _score;
        if (!isOpenSpots(board))
            return 0;
        
        if (maximizingPlayer) {
            let _maxEval = -1000;

            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    if (board[y][x] === "empty") {
                        gameBoard.setBoard(x, y, "player2");

                        let eval = minimax(gameBoard.board, depth+1, !maximizingPlayer);
                        gameBoard.setBoard(x, y, "empty");
                        
                        _maxEval = Math.max(_maxEval, eval);


                    }
                    
                }
                
            }
            return _maxEval-depth;
        } 
        else {
            let _maxEval = 1000; 

            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {

                    if (board[y][x] === "empty") {

                        gameBoard.setBoard(x, y, "player1");

                        let eval = minimax(gameBoard.board, depth + 1, !maximizingPlayer);
                        gameBoard.setBoard(x, y, "empty");

                        _maxEval = Math.min(_maxEval, eval);


                    }
                }
            }
            return _maxEval+depth;
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
        setTimeout(() => {
            clickCell(bestMove.row, bestMove.col)
        }, turnTime
            );
    }

    class Move {
        constructor() {
            let row,col;
        }
    }

    function resetGame() {
        turnCounter = 0;
        currentPlayer = "player1";
        gameBoard.createBoard(3, 3);
        displayController.clearModal();
        displayController.refreshBoard();
    }

    return {
        clickCell, 
        getCurrentPlayer, 
        switchPlayer, getTurnCounter, 
        addTurn, 
        evaluateBoard, 
        findBestMove, 
        makeBestMove,
        turnCounter,
        getTurnCounter,
        resetGame
    }

})();


gameBoard.createBoard(3, 3);

displayController.refreshBoard();