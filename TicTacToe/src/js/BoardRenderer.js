// A reference to the Winner/loser status label DOM element
var gameMessageLabel = document.getElementById('messageLabel');
// A reference to the game board container DOM element
var boardParent = document.getElementById('boardWrapper');

/**
 * Responsible for game board drawing and resetting
 *
 * @param fields {Array} - contains the game board table cells
 * @constructor
 */

var BoardRenderer = function (fields) {
    const self = this;
    self.fields = fields;
    self.showWinner = function (fieldList, color) {
        setTimeout(function () {
            for (var i = 0; i < fieldList.length; ++i) {
                self.fields[fieldList[i]].style.backgroundColor = color;
            }
        }, DELAY);

    }

    /**
     * Sets the field color on player's move
     *
     * @param field {HTML table td} - the field (board cell) player moved to
     * @param color {Number} - player's move sign color
     */
    self.setPlayerColor = function (field, color) {
        field.style.color = color;
    }

    /**
     * Shows the players move by setting the player's sign
     * @param field {HTML table td} - the field (board cell) player moved to
     * @param playerSign {string} - player's sign (symbol e.g. O or X)
     * @param delay {Number} - time delay in milliseconds
     */
    self.showPlayerMove = function (field, playerSign, delay) {
        setTimeout(function () {
            field.innerHTML = playerSign;
            if (delay > 0) {
                self.setClickability('');
            }
        }, delay);
    }

    /**
     * Enables / disables the game board clickablity
     *
     * @param flag {string} - possible values 'auto' or ''
     */
    self.setClickability = function (flag) {
        boardParent.style.pointerEvents = boardParent.style.pointerEvents = flag;
    }

    /**
     * Cleans up (resets) the game board content
     */
    self.cleanBoard = function () {
        fields.each(function (index, item) {
            item.id = index;
            item.innerHTML = '';
            self.fields[index].style.backgroundColor = BOARD_DEFAULT_COLOR;
        });
    }

    /**
     * Cleans up (resets) the specified positions in the board
     *
     * @param index1 {Number} - the first player's position index
     * @param index2 {Number} - the second player's position index
     */
    self.resetFields = function (index1, index2) {
        self.fields[index1].innerHTML = '';
        self.fields[index2].innerHTML = '';
        self.fields[index1].style.backgroundColor = BOARD_DEFAULT_COLOR;
        self.fields[index2].style.backgroundColor = BOARD_DEFAULT_COLOR;
    }

    /**
     * Shows the game result messages e.g. Winning, losing or draw
     *
     * @param message {string} - the message representing the game match result
     */
    self.showResultMessage = function (message) {
        gameMessageLabel.innerHTML = message;
    }
}