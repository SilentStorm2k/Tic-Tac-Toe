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
        if (gameState[i].getValue() == undefined && i < gameState.length)
            gameState.splice(i, 1, cell);
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
        let allSameInMainDiag = true, allSameInAntiDiag = true;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (row == col && allSameInMainDiag) {
                    allSameInMainDiag = mainDiag == gameState[row*size + col].getValue() ? true : false;
                }
                if (row+col+1 == size && allSameInAntiDiag) {
                    allSameInAntiDiag = antiDiag == gameState[row*size + col].getValue() ? true : false;
                }
            }
        }
        if (allSameInMainDiag)
            winner = player1;
        if (allSameInAntiDiag)
            winner = player2;
        return allSameInMainDiag || allSameInAntiDiag;
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

function Game () {
    const size = GameBoard.getValue().length;
    const getUserInput = prompt("Enter which square", 0);
    const startGame = () => {
        GameBoard.createGameBoard();

    }

}

const p1 = Player("shivs", "x");
const p2 = Player("Comp", 'O');
// p1.greetPlayer();
// console.log(p1.getMarker());

const c1 = Cell();
c1.assignOwner(p1);
console.log(c1.getValue());

const c2 = Cell();
c2.assignOwner(p2);


GameBoard.createGameBoard();
console.log(GameBoard.getGameState());

GameBoard.updateGameState(0, c1);
GameBoard.updateGameState(1, c2);
GameBoard.updateGameState(2, c1);
GameBoard.updateGameState(3, c1);
GameBoard.updateGameState(4, c1);
GameBoard.updateGameState(5, c2);
GameBoard.updateGameState(6, c2);
GameBoard.updateGameState(7, c2);
GameBoard.updateGameState(8, c1);
console.log(GameBoard.getGameState());
GameBoard.showGameState();
console.log(GameBoard.isGameOver());
console.log("winner = ", GameBoard.getWinner())
