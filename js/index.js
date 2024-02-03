const GameBoard = (function () {
    const gameState = [];
    const validChoices = [];
    let winner;
    const createGameBoard = (size = 3) => {
        RenderOnScreen.createGameBoard(size);
        gameState.length = 0;
        validChoices.length = 0;
        winner = undefined;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                gameState.push(Cell());
                validChoices.push(i*size + j);
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
            validChoices.splice(validChoices.indexOf(i), 1);
            RenderOnScreen.updateGameState(i, cell);
            return true;
        }
        return false;   
    };
    const isGameOver = () => {
        const size = Math.sqrt(gameState.length);
        const rowCheck = checkRows(size);
        const colCheck = checkRows(size, flip = true);
        const diagCheck = checkDiagonals(size);
        const isDraw = checkIfDraw();
        return rowCheck || colCheck || diagCheck || isDraw;
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

    const checkIfDraw = () => {
        for (let state of gameState) {
            if (typeof state == 'undefined')
                return false;
            else if (typeof state.getValue() == 'undefined')
                return false; 
        }
        return true;
    }

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

    const getValidChoices = () => validChoices;

    return {createGameBoard, getGameState, updateGameState, showGameState, isGameOver, getWinner, getValidChoices};
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
    let name = playerName;
    const marker = playerMarker;
    const getMarker = () => marker;
    const getPlayer = () => name;
    const changePlayerName = (newName) => name = newName;
    const greetPlayer = () => console.log(`Hello ${name}`);    
    return {getMarker, getPlayer, changePlayerName, greetPlayer};
};

const Game = (function () {
    const startGame = () => {
        const size = 3;
        const dialogueBox = document.querySelector('dialog');
        GameBoard.createGameBoard(size);
        dialogueBox.close();
    }
    return {startGame};
})();

const RenderOnScreen = (function () {
    const canvas = document.getElementById("canvas");
    const canvasContainer = document.querySelector(".content");
    const userName = document.getElementById("userName");
    const user = Player("You the user", "X"), comp = Player("Computer", "O");
    const userCell = Cell(), compCell = Cell();
    userCell.assignOwner(user); 
    compCell.assignOwner(comp);
    userName.addEventListener("keydown", function(e) {
        user.changePlayerName(e.target.value + e.key);
        userCell.assignOwner(user);
    });
    const resetButton = document.querySelectorAll('.reset');
    for (let button of resetButton) {
        button.addEventListener("click", Game.startGame);
    };
    const createGameBoard = (size = 3) => {
        while (canvas.firstChild)
            canvas.removeChild(canvas.firstChild);
        let row, cell;
        for (let i = 0; i < size; i++) {
            row = document.createElement('div');
            row.id = "row" + i;
            row.classList.add("row");
            for (let j = 0; j < size; j++) {
                cell = document.createElement('button');
                cell.id = "cell" + parseInt(parseInt(i)*size + parseInt(j));
                cell.classList.add("cell"); 
                cell.textContent = "";
                cell.addEventListener("click", choiceTaken);
                row.appendChild(cell);
            }
            canvas.appendChild(row);
        }
    };
    function choiceTaken (event) {
        event.target.removeEventListener("click", choiceTaken);
        const location = parseInt(event.target.id.slice(4));
        if (event.isTrusted) {
            GameBoard.updateGameState(location, userCell);
            if (GameBoard.isGameOver()) {
                renderGameOver();
                return;
            }
            const compAvailableChoices = GameBoard.getValidChoices();
            const compChoice = compAvailableChoices[Math.floor(Math.random()*compAvailableChoices.length)];
            document.getElementById('cell' + compChoice).click();
        }
        else {
            GameBoard.updateGameState(location, compCell);   
            if (GameBoard.isGameOver()) 
                renderGameOver();
        }
    };
    const renderGameOver = () => {
        const dialogueBox = document.querySelector('dialog');
        const allCells = document.querySelectorAll('.cell');
        const declareResult = document.getElementById('result');
        dialogueBox.showModal();
        for (let i = 0; i < allCells.length; i++) 
            allCells[i].removeEventListener("click", choiceTaken);
        if (typeof GameBoard.getWinner() == 'undefined')
            declareResult.textContent = `Draw match`;
        else
            declareResult.textContent = `Winner winner tofu dinner : ${GameBoard.getWinner()} has won the game`;
    };

    const updateGameState = (i, cell) => {
        const element = document.getElementById("cell" + i);
        element.textContent = cell.getValue();
    };
    return {createGameBoard, updateGameState}
})();

Game.startGame();
