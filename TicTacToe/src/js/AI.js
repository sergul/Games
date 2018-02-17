/**
 * Represents the AI (Artificial Intelligence) core logic / behaviour and data
 *
 * @param boardMatrix {Board} - a dependency injection of the game board data module
 * @param opponentSign {string} - represents the opponent's playing sign e.g. Human or another AI
 * @param mySign {string} - represents self playing sign e.g. O or X
 * @param signColor {Number} - the color of self sign
 * @constructor
 */

var AI = function (boardMatrix, opponentSign, mySign, signColor) {
    // points to the self object reference
    var self = this;

    self.boardMatrix = boardMatrix;

    self.numMoves = 0;

    self.opponent = opponentSign;

    self.mySign = mySign;

    self.signColor = signColor;

    self.whoAmI = MACHINE;

    self.stepStack = [];

    self.goEasyFirstStep = false;

    /**
     * Gets an arbitrary move index for the easy game mode
     *
     * @returns {Number} - returns board field index
     */
    self.getEasyMove = function () {
        var unvisitedList = self.boardMatrix.getUnvisitedFields();
        var index = unvisitedList.getRandomElement().index;
        return index;
    }

    /**
     * Gets a board field index for the medium game mode.
     * This method has 2 additional logic layers on top of the easy mode.
     * 1. Checks if there is chance to get any winning position which would complete any row/column/diagonal
     * 2. Checks if there is any losing position which would complete any row/column/diagonal by the next move
     *
     * @returns {Number} - returns board field index
     */
    self.getMediumMove = function () {
        // Returns the winning move index
        var winningMove = self.getWinningMove();
        if (winningMove > -1) {
            return winningMove;
        }
        // Returns the self defense move index
        var selfDefenseMove = self.getSelfDefenseMove();
        if (selfDefenseMove > -1) {
            console.log(selfDefenseMove);
            return selfDefenseMove;
        }
        //Uses the easy mode
        return self.getEasyMove();

    }

    /**
     * Gets a board field index for the hard game mode.
     * This method has 3 additional logic layers on top of the medium mode.
     * 1. Checks and returns the center position if it is free. (center will block 4 directions)
     * (first layer has a sub logic to use the easy mode (random approach) in case the AI starts first)
     * 2. Checks and returns any unvisited corner position in the board in case the center position is already used.
     * 3. And finally scans the board to find the potential dangerous corner based on the opponent's move
     *
     * @returns {Number} - returns board field index
     */
    self.getHardMove = function () {
        // 1. Returns the center position if free
        self.numMoves ++;
        if (self.boardMatrix.isCenterFieldFree()) {
            if (self.goEasyFirstStep) {
                self.goEasyFirstStep = false;
                return self.getEasyMove();
            }
            return self.boardMatrix.getCenterFieldIndex();
        }
        // 2. Returns any free corner position
        if (self.isFirstMove()) {
            var anyCornerPosition = self.boardMatrix.getAnyUnvisitedCornerPosition();
            if (anyCornerPosition > -1) {
                return anyCornerPosition;
            }
        }
        // returns the "dangerous corner" index (see above for more details)
        if (self.numMoves === 2) {
            var dangerousCorner = self.getDangerousCorner();
            if (dangerousCorner > -1) {
                return dangerousCorner;
            }
        }
        //Uses the medium mode logic
        return self.getMediumMove();
    }

    /**
     * Calls the corresponding method for the active game mode
     *
     * @returns {Number} - returns the best move based on the selected game mode
     */
    self.move = function() {
        switch (self.selectedGameMode) {
            case EASY:
                return self.getEasyMove();
            case MEDIUM:
                return self.getMediumMove();
            case HARD:
                return self.getHardMove();
            default:
                console.log('self.move: Selected mode is undefined');
        }
    }

    /**
     * Gets the last winning move which would complete any row/column/diagonal
     *
     * @returns {Number} - Returns a board field index or -1 if no value
     */
    self.getWinningMove = function () {
        var nextMoveToWinGameRow = self.boardMatrix.getNextMoveToCompleteAnyRow(self.mySign);
        var nextMoveToWinGameColumn = self.boardMatrix.getNextMoveToCompleteAnyColumn(self.mySign);
        var nextMoveToWinGameDiagonal = self.boardMatrix.getNextMoveToCompleteAnyDiagonal(self.mySign);
        if (nextMoveToWinGameRow > -1) {
            return nextMoveToWinGameRow;
        } else if (nextMoveToWinGameColumn > -1) {
            return nextMoveToWinGameColumn;
        } else if (nextMoveToWinGameDiagonal > -1) {
            return nextMoveToWinGameDiagonal;
        }
        return -1;
    }

    /**
     * Gets the best move to block any row/column/diagonal to avoid a loss
     *
     * @returns {Number} - Returns a board field index or -1 if no value
     */
    self.getSelfDefenseMove = function () {
        var nextMoveBeforeLoseRow = self.boardMatrix.getNextMoveToCompleteAnyRow(self.opponent);
        if (nextMoveBeforeLoseRow < 0) {
            var nextMoveBeforeLoseColumn = self.boardMatrix.getNextMoveToCompleteAnyColumn(self.opponent);
            if (nextMoveBeforeLoseColumn < 0) {
                var nextMoveBeforeLoseDiagonal = self.boardMatrix.getNextMoveToCompleteAnyDiagonal(self.opponent);
                if (nextMoveBeforeLoseDiagonal < 0) {
                    return -1;
                }
                return nextMoveBeforeLoseDiagonal;
            }
            return nextMoveBeforeLoseColumn;
        }
        return nextMoveBeforeLoseRow;
    }

    /**
     * Gets the dangerous corner based on the opponents move
     *
     * @returns {Number} - Returns a board field index or -1 if no value
     */
    self.getDangerousCorner = function () {
        var unvisitedCorners = self.boardMatrix.getAllNonVisitedCorners();
        var position = null;
        for (var i = 0; i < unvisitedCorners.length; ++i) {
            position = self.boardMatrix.getFieldPositionByIndex(unvisitedCorners[i]);
            if (self.boardMatrix.hasAnyOfInRow(position.row, self.opponent) &&
                self.boardMatrix.hasAnyOfInColumn(position.column, self.opponent)) {
                return unvisitedCorners[i];
            }
        }
        return -1;
    }

    /**
     * Undoes / Removes the last element from the steps stack
     */
    self.undo = function () {
        if (self.stepStack.length > 0) {
            self.stepStack.pop();
        }
    }

    /**
     * Gets the last step position from the steps stack
     *
     * @returns {Number} - Returns the step index in the board
     */
    self.getLastStep = function () {
        if (self.stepStack.length > 0) {
            return self.stepStack[self.stepStack.length - 1];
        }
        return -1;
    }

    /**
     * Updates the selected game mode value
     *
     * @param mode - Contains the selected game mode value
     */
    self.updateGameMode = function (mode) {
        self.selectedGameMode = mode;
    }

    /**
     * Checks if the playing step is first or not
     *
     * @returns {boolean}
     */
    self.isFirstMove = function () {
        return self.numMoves === 1;
    }

    /**
     * Sets the opponents playing sign
     *
     * @param who - Contains the opponent's play sign
     */
    self.setOpponent = function (who) {
        self.opponent = who;
    }

    /**
     * Saves the taken move position in the steps stack
     *
     * @param position - contains the taken step position in the board
     */
    self.saveStep = function (position) {
        self.stepStack.push(position);
    }
}