const GameBoard = (function () {
    const gameState = [];
    let winner;
    const createGameBoard = (size = 3) => {
        gameState.length = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                gameState.push(Cell());
            }
        }
    }
    const getGameState = () => gameState;

    // Update state when value of ith cell DNE
    const updateGameState = (i, cell) => {
        if (typeof gameState[i] == 'undefined' || typeof cell == 'undefined' || typeof i != 'number')
            return false;
        if (typeof gameState[i].getValue() == 'undefined' && i < gameState.length) {
            gameState.splice(i, 1, cell);
            return true;
        }
        return false;   
    };
    const isGameOver = () => {
        const size = Math.sqrt(gameState.length);
        const rowCheck = checkRows(size);
        const colCheck = checkRows(size, flip = true);
        const diagCheck = checkDiagonals(size);
        return rowCheck || colCheck || diagCheck;
    }

    const getWinner = () => winner;

    const checkRows = (size, flip = false) => {
        let r, c, curElement, count = 0, allSameInRow = false;
        for (let row = 0; row < size; row++) {
            count = 0;
            for (let col = 0; col < size; col++) {
                r = flip ? col : row;
                c = flip ? row : col;
                if (typeof gameState[r*size + c].getValue() == 'undefined')
                    continue;
                if (col == 0) 
                    curElement = gameState[r*size + c].getValue();
                if (curElement == gameState[r*size + c].getValue())
                    count++;
                if (count == size) {
                    allSameInRow = true;
                    winner = gameState[r*size + c].getOwner();
                }
            }
        }
        return allSameInRow;
    };

    const checkDiagonals = (size) => {
        const mainDiag = gameState[0].getValue(), antiDiag = gameState[size-1].getValue();
        const player1 = gameState[0].getOwner(), player2 = gameState[size-1].getOwner();
        let countInMainDiag = 0, countInAntiDiag = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (row == col) {
                    countInMainDiag = mainDiag == gameState[row*size + col].getValue() ? countInMainDiag + 1 : 0;
                }
                if (row+col+1 == size) {
                    countInAntiDiag = antiDiag == gameState[row*size + col].getValue() ? countInAntiDiag + 1 : 0;
                }
            }
        }
        countInMainDiag = typeof mainDiag == 'undefined' ? 0 : countInMainDiag;
        countInAntiDiag = typeof antiDiag == 'undefined' ? 0 : countInAntiDiag;
        if (countInMainDiag == size)
            winner = player1;
        if (countInAntiDiag == size)
            winner = player2;
        return countInMainDiag == size || countInAntiDiag == size;
    };

    const showGameState = () => {
        const size = Math.sqrt(gameState.length);
        let j = 0;
        let row;
        let output = '';
        let finalOutput = '';
        for (let i = 0; i < size; i++) {
            output = '';
            row = gameState.slice(j, j+size);
            for (let element of row) 
                output += element.getValue() + " | ";
            finalOutput += output + '\n';
            j += size;
        }
        console.log(finalOutput);
    }
    return {createGameBoard, getGameState, updateGameState, showGameState, isGameOver, getWinner};
})();

function Cell () {
    let owner, value;
    const getValue = () => value;
    const assignOwner = (player) => {
        owner = player.getPlayer();
        value = player.getMarker();
    }
    const getOwner = () => owner;
    return {getValue, assignOwner, getOwner};
};

function Player (playerName, playerMarker) {
    const name = playerName;
    const marker = playerMarker;
    const getMarker = () => marker;
    const getPlayer = () => name;
    const greetPlayer = () => console.log(`Hello ${name}`);    
    return {getMarker, getPlayer, greetPlayer};
};

const Game = (function () {
    const startGame = () => {
        GameBoard.createGameBoard();
        const size = Math.sqrt(GameBoard.getGameState().length);
        const player = Player(prompt("Enter your name: ", "John Doe"), "X");
        const computer = Player("comp", "O");
        const userCell = Cell(), compCell = Cell();
        const validChoices = [];
        for (let i = 0; i < GameBoard.getGameState().length; i++) 
            validChoices.push(i);
        let cellLocation = 0, row = 0; col = 0;
        userCell.assignOwner(player);
        compCell.assignOwner(computer);
        GameBoard.showGameState();
        while (!GameBoard.isGameOver()) {
            row = prompt("Enter row", 0);
            col = prompt("Enter col", 0);
            cellLocation = parseInt(row)*size + parseInt(col);
            while (!GameBoard.updateGameState(cellLocation, userCell)) {
                row = prompt("Prev invalid, Enter row", 0);
                col = prompt("Prev invalid, Enter col", 0);
                cellLocation = parseInt(row)*size + parseInt(col);
            }
            validChoices.splice(validChoices.indexOf(cellLocation), 1);
            console.log("USer choide = ", cellLocation);
            cellLocation = Math.floor(Math.random()*validChoices.length);
            GameBoard.updateGameState(validChoices[cellLocation], compCell);
            console.log("Comp choide = ", validChoices[cellLocation]);
            validChoices.splice(cellLocation, 1);
            GameBoard.showGameState();
        }
        console.log(`Winner winner tofu dinner : ${GameBoard.getWinner()} has won the game`)
    }
    return {startGame};
})();

const RenderOnScreen = (function () {
    const createBoard = (size = 3) => {
        const canvas = document.getElementById("canvas");
        let row, cell;
        for (let i = 0; i < size; i++) {
            row = document.createElement('div');
            row.id = "row" + i;
            row.classList.add("row");
            for (let j = 0; j < size; j++) {
                cell = document.createElement('div');
                cell.id = "cell" + parseInt(parseInt(i)*size + parseInt(j));
                cell.classList.add("cell"); 
                cell.textContent = "dummy";
                row.appendChild(cell);
            }
            canvas.appendChild(row);
        }
    };
    return {createBoard}
})();

// Game.startGame();
RenderOnScreen.createBoard();

// const p1 = Player("shivs", "x");
// const p2 = Player("Comp", 'O');
// // p1.greetPlayer();
// // console.log(p1.getMarker());

// const c1 = Cell();
// c1.assignOwner(p1);
// console.log(c1.getValue());

// const c2 = Cell();
// c2.assignOwner(p2);


// GameBoard.createGameBoard();
// // console.log(GameBoard.getGameState());

// GameBoard.updateGameState(0, c1);
// GameBoard.updateGameState(1, c2);
// GameBoard.updateGameState(2, c1);
// GameBoard.updateGameState(3, c1);
// GameBoard.updateGameState(4, c1);
// GameBoard.updateGameState(5, c2);
// GameBoard.updateGameState(6, c2);
// GameBoard.updateGameState(7, c2);
// console.log(GameBoard.updateGameState(8, c1));
// console.log(GameBoard.updateGameState(8, c2));
// // console.log(GameBoard.getGameState());
// GameBoard.showGameState();
// console.log(GameBoard.isGameOver());
// console.log("winner = ", GameBoard.getWinner())
