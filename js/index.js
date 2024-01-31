const GameBoard = (function () {
    const gameState = [];
    const createGameBoard = (size = 3) => {
        gameState.length = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                gameState.push(Cell());
            }
        }
    }
    const getGameState = () => gameState;
    const updateGameState = (i, cell) => {
        gameState.splice(i, 1, cell);
    };
    return {createGameBoard, getGameState, updateGameState};
})();

function Cell () {
    let value = "";
    const getValue = () => value;
    const assignValue = (val) => value = val;
    return {getValue, assignValue};
};

function Player (playerName, playerMarker) {
    const name = playerName;
    const marker = playerMarker;
    const getMarker = () => marker;
    const greetPlayer = () => console.log(`Hello ${name}`);    
    return {getMarker, greetPlayer};
};

const p1 = Player("shivs", "x");
// p1.greetPlayer();
// console.log(p1.getMarker());

const c1 = Cell();
c1.assignValue(p1.getMarker());
console.log(c1.getValue());


GameBoard.createGameBoard();
console.log(GameBoard.getGameState());
GameBoard.updateGameState(0, c1);
console.log(GameBoard.getGameState());
GameBoard.createGameBoard(2);
console.log(GameBoard.getGameState());