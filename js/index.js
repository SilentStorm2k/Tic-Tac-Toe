const GameBoard = (function () {
    const gameState = [];
    const createGameBoard = (size = 3) => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                gameState.push(Cell(i, j));
            }
        }
    }
    const getGameState = () => gameState;
    return {createGameBoard, getGameState};
})();

const Cell = (function (i, j) {
    const row = i;
    const col = j;
    const player = undefined;

    const getValue = () => {
        if (player)
            return player.marker;
        return null;
    };
    const assignValue = (p) => {
        player = p;
    };

    return {getValue, assignValue};
})();

const Player = (function (name = "Computer", marker) {
    const name = name;
    const marker = marker;
    const greetPlayer = () => console.log(`Hello ${this.name}`);    
    return {name, marker, greetPlayer};
})();
