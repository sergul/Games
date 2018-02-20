/**
 * Represents the game board by providing various means to access the board data
 *
 * @constructor
 */

function Board() {
    var self = this;

    //Contains the board data in matrix structure by rows and columns
    self.matrix = [];
    //List of the board fields data
    self.list = [];

    /**
     * Creates the board matrix model
     * @param fields {Array} - a reference to the game board cells
     */
    self.createMatrix = function (fields) {
        fields.each(function (index) {
            self.createMatrixElement(index);
        });
    }

    /**
     * Creates an object of BoardField for the matrix model
     *
     * @param index {Number} - board field index
     */
    self.createMatrixElement = function (index) {
        var pos = self.getFieldPositionByIndex(index);
        if (pos.column === 0) {
            self.matrix.push([]);
        }
        self.matrix[pos.row].push(new BoardField('', pos.row, pos.column, index));
    }

    /**
     * Checks if there is a winner or not
     *
     * @param who {string} - the player's sign e.g. O or X
     * @returns {string} - Returns the winner playing sign e.g. O or X
     */
    self.checkWinner = function (who) {
        var row = self.isAnyCompletedRow(who);

        var column = self.isAnyCompletedColumn(who);

        var diagonal = self.isAnyCompletedDiagonal(who);

        return row || column || diagonal;
    }

    /**
     * Sets the player's move
     *
     * @param index {Number} - move index
     * @param who {string} - the player's sign
     */
    self.setMove = function (index, who) {
        var pos = self.getFieldPositionByIndex(index);
        self.matrix[pos.row][pos.column].who = who;

    }

    /**
     * Checks if there is any completed row in the board or not
     *
     * @param who {string} - the player's sign
     * @returns {Number} - Returns the completed row cells/fields list
     */
    self.isAnyCompletedRow = function (who) {
        var rows = null;
        for (var row = 0; row < BOARD_SIZE; ++row) {
            rows = [];
            for (var column = 0; column < BOARD_SIZE; ++column) {
                if (self.matrix[row][column].who === who) {
                    rows.push(self.matrix[row][column].index);
                }
            }
            if (rows.length === BOARD_SIZE) {
                return rows;
            }
        }
        return null;
    }

    /**
     * Checks if there is any completed column in the board or not
     *
     * @param who {string} - the player's sign
     * @returns {Number} - Returns the completed column cells/fields list
     */
    self.isAnyCompletedColumn = function (who) {
        var columns;
        for (var row = 0; row < BOARD_SIZE; ++row) {
            columns = [];
            for (var column = 0; column < BOARD_SIZE; ++column) {
                if (self.matrix[column][row].who === who) {
                    columns.push(self.matrix[column][row].index);
                }
            }
            if (columns.length === BOARD_SIZE) {
                return columns;
            }
        }

        return null;
    }

    /**
     * Checks if there is any completed diagonal in the board or not
     *
     * @param who {string} - the player's sign
     * @returns {Number} - Returns the completed diagonal cells/fields list
     */
    self.isAnyCompletedDiagonal = function (who) {
        var diagonals = [];
        for (var row = 0; row < BOARD_SIZE; ++row) {
            if (self.matrix[row][row].who === who) {
                diagonals.push(self.matrix[row][row].index);
            }
        }
        if (diagonals.length === BOARD_SIZE) {
            return diagonals;
        }
        diagonals = [];
        for (var row = BOARD_SIZE - 1; row >= 0; --row) {
            if (self.matrix[(BOARD_SIZE - 1) - row][row].who === who) {
                diagonals.push(self.matrix[(BOARD_SIZE - 1) - row][row].index);
            }
        }
        if (diagonals.length === BOARD_SIZE) {
            return diagonals;
        }
        return null;
    }

    /**
     * Gets all the unvisited fields in the board
     *
     * @returns {Array} - returns the list of fields
     */
    self.getUnvisitedFields = function () {
        self.list = [];
        for (var row = 0; row < BOARD_SIZE; ++row) {
            for (var column = 0; column < BOARD_SIZE; ++column) {
                if (self.matrix[row][column].who === EMPTY) {
                    self.list.push(self.matrix[row][column]);
                }
            }
        }
        return self.list;
    }

    /**
     * Scans the board and gets the next potential move index to complete the row
     *
     * @param who {string} - the player's move sign
     * @returns {Number} - Returns the next potential move index
     */
    self.getNextMoveToCompleteAnyRow = function (who) {
        var numCompletedMoves = 0;
        var targetColumnIndex = -1;
        var indexList = [];
        for (var row = 0; row < BOARD_SIZE; ++row) {
            indexList = self.matrix[row].getValuesByPropName('who');
            numCompletedMoves = indexList.getNumberOfDuplicates(who);
            if (numCompletedMoves === BOARD_SIZE - 1) {
                targetColumnIndex = self.matrix[row].getFirstIndex('who', EMPTY);
                if (targetColumnIndex > -1) {
                    return self.matrix[row][targetColumnIndex].index;
                }
                return -1;
            }
        }
        return -1;
    }

    /**
     * Scans the board and gets the next potential move index to complete the column
     *
     * @param who {string} - the player's move sign
     * @returns {Number} - Returns the next potential move index
     */
    self.getNextMoveToCompleteAnyColumn = function (who) {
        var numCompletedMoves = 0;
        var targetEmptyRowIndex = -1;
        for (var row = 0; row < BOARD_SIZE; ++row) {
            numCompletedMoves = 0;
            targetEmptyRowIndex = -1;
            for (var column = 0; column < BOARD_SIZE; ++column) {
                if (self.matrix[column][row].who === who) {
                    numCompletedMoves ++;
                } else if (self.matrix[column][row].who === EMPTY) {
                    targetEmptyRowIndex = self.matrix[column][row].index;
                }
            }
            if (numCompletedMoves === BOARD_SIZE - 1 && targetEmptyRowIndex > -1) {
                return targetEmptyRowIndex;
            }

        }
        return -1;
    }

    /**
     * Scans the board and gets the next potential move index to complete the diagonal
     *
     * @param who {string} - the player's move sign
     * @returns {Number} - Returns the next potential move index
     */
    self.getNextMoveToCompleteAnyDiagonal = function (who) {
        var diagonals = [];
        var targetEmptyRowIndex = -1;
        //Scans the left-to-right diagonal
        for (var row = 0; row < BOARD_SIZE; ++row) {
            if (self.matrix[row][row].who === who) {
                diagonals.push(self.matrix[row][row].index);
            } else if (self.matrix[row][row].who === EMPTY) {
                targetEmptyRowIndex = self.matrix[row][row].index;
            }
        }
        if (diagonals.length === BOARD_SIZE - 1 && targetEmptyRowIndex > -1) {
            return targetEmptyRowIndex;
        }
        diagonals = [];
        targetEmptyRowIndex = -1;
        //Scans the right-to-left diagonal
        for (var row = BOARD_SIZE - 1; row >= 0; --row) {
            if (self.matrix[(BOARD_SIZE - 1) - row][row].who === who) {
                diagonals.push(self.matrix[(BOARD_SIZE - 1) - row][row].index);
            } else if (self.matrix[(BOARD_SIZE - 1) - row][row].who === EMPTY) {
                targetEmptyRowIndex = self.matrix[(BOARD_SIZE - 1) - row][row].index;
            }
        }
        if (diagonals.length === BOARD_SIZE - 1 && targetEmptyRowIndex > -1) {
            return targetEmptyRowIndex;
        }
        return -1;
    }

    /**
     * Scans and gets any unvisited corner position in the board if possible
     *
     * @returns {Number} - Returns an unvisited corner position
     */
    self.getAnyUnvisitedCornerPosition = function() {
        var corners = self.getAllNonVisitedCorners();
        if (corners.length > 0) {
            var randoCorner = corners.getRandomElement();
            return randoCorner;
        }
        return -1;
    }

    /**
     * Gets all the unvisited corners in the board
     *
     * @returns {Array} - Returns a fields list
     */
    self.getAllNonVisitedCorners = function () {
        var corners = [];
        if (self.matrix[0][0].who === EMPTY) {
            corners.push(self.matrix[0][0].index);
        }
        if (self.matrix[0][BOARD_SIZE - 1].who === EMPTY) {
            corners.push(self.matrix[0][BOARD_SIZE - 1].index);
        }
        if (self.matrix[BOARD_SIZE - 1][BOARD_SIZE - 1].who === EMPTY) {
            corners.push(self.matrix[BOARD_SIZE - 1][BOARD_SIZE - 1].index);
        }
        if (self.matrix[BOARD_SIZE - 1][0].who === EMPTY) {
            corners.push(self.matrix[BOARD_SIZE - 1][0].index);
        }
        return corners;
    }

    /**
     * Finds the target character in the specified row
     *
     * @param index {Number} - the row index in board matrix
     * @param who {string} - the player's move sign
     * @returns {boolean} - Returns the target char in the specified row
     */
    self.hasAnyOfInRow = function (index, who) {
        for (var column = 0; column < BOARD_SIZE; ++column) {
            if (self.matrix[index][column].who === who) {
                return true;
            }
        }
        return false;
    }

    /**
     * Finds the target character in the specified column
     *
     * @param index {Number} - the row index in board matrix
     * @param who {string} - the player's move sign
     * @returns {boolean} - Returns the target char in the specified column
     */
    self.hasAnyOfInColumn = function (index, who) {
        for (var row = 0; row < BOARD_SIZE; ++row) {
            if (self.matrix[row][index].who === who) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks whether all the positions in the board are busy or not
     *
     * @returns {boolean} - Returns true or false
     */
    self.isFullyOccupied = function () {
        for (var row = 0; row < BOARD_SIZE; ++row) {
            var index = self.matrix[row].getFirstIndex('who', EMPTY);
            if (index > -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether the board center is busy or not
     *
     * @returns {boolean} - Returns true or false
     */
    self.isCenterFieldFree = function () {
        var center = parseInt(BOARD_SIZE / 2);
        return self.matrix[center][center].who === EMPTY;
    }

    /**
     * Gets the board center field index
     * @returns {Number} - Returns the center index
     */
    self.getCenterFieldIndex = function () {
        var center = parseInt(BOARD_SIZE / 2);
        return self.matrix[center][center].index;
    }

    /**
     * Calculates the field position e.g. row/column number in matrix
     * by a one dimensional index e.g. e.g. 0, 2, 3...8
     *
     * @param index {Number} the field index in the board
     * @returns {{row: number, column: number}}
     */
    self.getFieldPositionByIndex = function(index) {
        var row = parseInt(index / BOARD_SIZE);
        var column = parseInt(index % BOARD_SIZE);

        return {row: row, column: column};
    }

    /**
     * Resets / Undoes the players steps from the board matrix
     *
     * @param player1Step {String} player1 move sign e.g. O or X
     * @param player2Step (String} player1 move sign e.g. O or X
     */
    self.resetSteps = function (player1Sign, player2Sign) {
        var position = self.getFieldPositionByIndex(player1Sign);
        self.matrix[position.row][position.column].who = EMPTY;
        position = self.getFieldPositionByIndex(player2Sign);
        self.matrix[position.row][position.column].who = EMPTY;
    }
}

/**
 *
 * @param who {string} - the player's move sign in the board
 * @param row {string} - fields row number
 * @param column {string} - fields column number
 * @param index {Number} - one dimensional field index e.g. 0, 2, 3...8
 * @constructor
 */
function BoardField(who, row, column, index) {
    this.who = who;
    this.position = {row: row, column: column};
    this.index = index;
}