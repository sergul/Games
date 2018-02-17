/**
 * Represents the Human's behaviour and data
 *
 * @param opponent {string} - represents the opponent's playing sign e.g. Human or another AI
 * @param mySign {string} - represents self playing sign e.g. O or X
 * @param signColor {Number} - the color of self sign
 * @constructor
 */
var Human = function (opponent, mySign, signColor) {
    var self = this;
    self.opponent = opponent;
    self.mySign = mySign;
    self.signColor = signColor;
    self.whoAmI = HUMAN;
    self.stepStack = [];

    /**
     * Updates the selected game mode value TODO: needs to be completed
     *
     * @param mode - Contains the selected game mode value
     */
    self.updateGameMode = function (mode) {
    }

    /**
     * Saves the taken move position in the steps stack
     *
     * @param position - contains the taken step position in the board
     */
    self.saveStep = function (position) {
        self.stepStack.push(position);
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
}