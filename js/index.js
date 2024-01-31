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

