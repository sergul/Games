//A reference to the game board cells
var fields = $("#board td.board-cell");
//Board matrix object
var boardMatrix;
//Board renderer object
var boardRenderer;
//Game selector object
var gameSelector;
var gameIsOver = false;
//Represents the player who's playing first
var playerOne;
//Represents the player who's playing second
var playerTwo;
//Boolean flags to indicate the opponents sequence based on the user selections
var isHumanFirstMachineSecond = true;
var isAIvsAI = false;
var isMachineFirstHumanSecond = true;
var isHumanvsHuman = false;

/**
 * The entry point of the game
 */
function start() {
    try
    {
        setEventListeners();
        initGameSelector();
        initBoard();
        setOpponents();
        initPlayers();
        initDefaults();
    } catch (ex) {
        console.log(ex.message);
    }
}

/**
 * Initializes the opponents playing sequence based on the user selections
 */
function setOpponents() {
    isAIvsAI = gameSelector.playerOneOption === MACHINE && gameSelector.playerTwoOption === MACHINE;
    isHumanFirstMachineSecond = gameSelector.playerOneOption === HUMAN && gameSelector.playerTwoOption === MACHINE;
    isMachineFirstHumanSecond = gameSelector.playerOneOption === MACHINE && gameSelector.playerTwoOption === HUMAN;
    isHumanvsHuman = gameSelector.playerOneOption === HUMAN && gameSelector.playerTwoOption === HUMAN;
}

/**
 * Sets the game event listeners
 */
function setEventListeners() {
    if (!isAIvsAI) {
        setBoardEventListeners();
    }
    $('#restartGame').bind(LEFT_CLICK_BOARD_EVENT, onGameRestartButtonClick);
    $('#undo').bind(LEFT_CLICK_UNDO_EVENT, onUndoButtonClick);
}

/**
 * Instantiates the game selector object
 */
function initGameSelector() {
    gameSelector = new GameModeSelector();
    gameSelector.init();
}

/**
 * Sets board event listeners
 */
function setBoardEventListeners() {
    fields.each(function (index, item) {
        item.addEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick, false);
    });
}

/**
 * Removes board event listeners
 */
function removeBoardEventListeners() {
    fields.each(function (index, item) {
        item.removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
    });
}

/**
 * Event handler on game restart button left click
 */
function onGameRestartButtonClick() {
    restartGame();
    updateSelectedGameMode();
    gameIsOver = isAIvsAI;
    //Starts AI vs AI game
    if (isAIvsAI) {
        setTimeout(function () {
            gameIsOver = false;
            playAIvsAI();
        }, DELAY * 8);
        //Starts Machine vs Human game
    } else if (isMachineFirstHumanSecond) {
        setTimeout(function () {
            gameIsOver = false;
            var moveIndex = playerOne.move();
            play(moveIndex, playerOne, 0);
            fields[moveIndex].removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
        }, DELAY * 8);
    }
}

/**
 * restarts the game default modules and vars
 */
function restartGame() {
    setOpponents();
    if (!isAIvsAI) {
        setBoardEventListeners();
        gameIsOver = false;
    }
    initDefaults();
    initBoard();
    initPlayers();
}

/**
 * Resets defaults
 */
function initDefaults() {
    updateSelectedGameMode();
    boardRenderer.setClickability('');
}

/**
 * Instantiates the game board matrix and renderer
 */
function initBoard() {
    boardMatrix = new Board();
    boardMatrix.createMatrix(fields);
    boardRenderer = new BoardRenderer(fields);
    boardRenderer.cleanBoard();
}

/**
 * Initializes the players either Human or AI as a first or second player
 */
function initPlayers() {
    if (gameSelector.playerOneOption === HUMAN) {
        playerOne = new Human(X, O, O_PLAYER_COLOR);
    } else {
        playerOne = new AI(boardMatrix, X, O, O_PLAYER_COLOR);
        playerOne.selectedGameMode = gameSelector.selectedGameMode;
        if (playerOne.selectedGameMode === HARD) {
            playerOne.goEasyFirstStep = true;
        }
    }
    if (gameSelector.playerTwoOption === MACHINE) {
        playerTwo = new AI(boardMatrix, playerOne.mySign, X, X_PLAYER_COLOR);
        playerTwo.selectedGameMode = gameSelector.selectedGameMode;
    } else {
        playerTwo = new Human(playerOne.mySign, X, X_PLAYER_COLOR);
    }
}

/**
 * Event handler function on board left click
 *
 * @param event {Event}
 */
function onBoardFieldClick(event) {
    var targetId = event.target.id;
    try {
        if (isHumanFirstMachineSecond) {
            playHumanFirstMachineSecond(targetId);
        } else if (isMachineFirstHumanSecond) {
            playMachineFirstHumanSecond(targetId);
        }
    } catch (ex) {
        console.log(ex.message);
    }
}

/**'
 * Process one cycle/iteration for Human (starts first) vs AI (starts second) play
 *
 * @param moveIndex {Number} - the humans move position index in the board
 */
function playHumanFirstMachineSecond(moveIndex) {
    try{
        //Human starts here
        play(moveIndex, playerOne);
        boardRenderer.setClickability(NONE);
        event.target.removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
        //If the game is not over the player two continues the game
        if (!gameIsOver) {
            var playerTwoMoveIndex = 0;
            if (playerTwo instanceof AI) {
                playerTwoMoveIndex = playerTwo.move();
            }
            play(playerTwoMoveIndex, playerTwo, DELAY);
            //Saves the players steps into the stack to use for Undo operation
            playerOne.saveStep(moveIndex);
            playerTwo.saveStep(playerTwoMoveIndex);
            //Removes the already occupied board field event listener
            fields[playerTwoMoveIndex].removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
        } else {
            boardRenderer.setClickability('');
        }
    } catch (ex) {
        console.log(ex.message);
    }
}

/**'
 * Process one cycle/iteration for AI (starts first) vs Human (starts second) play
 *
 * @param moveIndex {Number} - the humans move position index in the board
 */
function playMachineFirstHumanSecond(moveIndex) {
    try {
        play(moveIndex, playerTwo);
        boardRenderer.setClickability('none');
        event.target.removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
        if (!gameIsOver) {
            var playerOneMoveIndex = 0;
            if (playerOne instanceof AI) {
                playerOneMoveIndex = playerOne.move();
            }
            play(playerOneMoveIndex, playerOne, DELAY);
            playerOne.saveStep(moveIndex);
            playerTwo.saveStep(playerOneMoveIndex);
            fields[playerOneMoveIndex].removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
        } else {
            boardRenderer.setClickability('');
        }
    } catch (ex) {
        console.log(ex.message);
    }
}

/**
 * Process recursion calls for AI_1 (starts first) vs AI_2 (starts second) play
 */
function playAIvsAI() {
    try {
        if (!gameIsOver) {
            console.log(gameIsOver);
            var moveIndex = playerOne.move();
            play(moveIndex, playerOne, DELAY);
            boardRenderer.setClickability('none');
            fields[moveIndex].removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
            //A time out function to process the next AI move
            setTimeout(function () {
                if (!gameIsOver) {
                    if (playerTwo instanceof AI) {
                        moveIndex = playerTwo.move();
                        play(moveIndex, playerTwo, DELAY * 2);
                        fields[moveIndex].removeEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick);
                        setTimeout(function () {
                            // Starts the next iteration if the game is not yet over
                            playAIvsAI();
                        }, DELAY * 6);
                    }
                } else {
                    boardRenderer.setClickability('');
                }
            }, DELAY * 6);
        }
    } catch (ex) {
        console.log(ex.message);
    }
}

/**
 *
 * @param fieldId {Number} - target field/cell index in the board
 * @param player {Human/AI} - the player who is playing at this moment
 * @param delay {Number} - delay in milliseconds to simulate the other player action
 * @returns {boolean} - processes one iteration of a players move and returns whether the game is over or not
 */
function play(fieldId, player, delay) {
    delay = !delay ? 0 : delay;
    boardMatrix.setMove(fieldId, player.mySign);
    boardRenderer.showPlayerMove(fields[fieldId], player.mySign, delay);
    boardRenderer.setPlayerColor(fields[fieldId], player.signColor);
    var isThereWin = boardMatrix.checkWinner(player.mySign);
    if (isThereWin) {
        finishGame(isThereWin, player);
        return gameIsOver = true;
    }
    if (boardMatrix.isFullyOccupied()) {
        setDraw();
        return gameIsOver = true;
    }
}

/**
 * Event handler on Undo button left click
 */
function onUndoButtonClick() {
    if (!isAIvsAI && playerOne.getLastStep() > -1 && playerTwo.getLastStep() > -1) {
        boardMatrix.resetSteps(playerOne.getLastStep(), playerTwo.getLastStep());
        boardRenderer.resetFields(playerOne.getLastStep(), playerTwo.getLastStep());
        fields[playerOne.getLastStep()].addEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick, false);
        fields[playerTwo.getLastStep()].addEventListener(LEFT_CLICK_BOARD_EVENT, onBoardFieldClick, false);
        playerOne.undo();
        playerTwo.undo();
    }
}

/**
 * Finishes the game by showing the winner related
 * information on the board e.g. winning row, encouraging message
 *
 * @param indexList
 * @param player
 */
function finishGame(indexList, player) {
    var winColor = player.mySign === O ? O_WIN_COLOR : X_WIN_COLOR;
    boardRenderer.showWinner(indexList, winColor);

    if (player instanceof Human) {
        boardRenderer.showResultMessage(HUMAN_WON);
    } else {
        boardRenderer.showResultMessage(HUMAN_LOST);
    }
    removeBoardEventListeners();
}

/**
 * Used to show the draw message above the board
 */
function setDraw() {
    removeBoardEventListeners();
    boardRenderer.showResultMessage(DRAW_MESSAGE);
}

/**
 * Updates the game mode selections
 */
function updateSelectedGameMode() {
    playerOne.updateGameMode(gameSelector.selectedGameMode);
    playerTwo.updateGameMode(gameSelector.selectedGameMode);
}

//Calls the main function of the app
start();