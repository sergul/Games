// A reference to the game mode selectors
let radioButtons = $("#gameModeListWrapper span.radio-thick");
// A reference to the game mode selectors container
let radioButtonContainers = $("#gameModeListWrapper label.container");
// A reference to the game mode selectors labels
let radioLabels = $("#gameModeListWrapper span.radio-label");

//A reference to the player one dropdown select
let playerOneSelect = $('#player1')[0];
//A reference to the player two dropdown select
let playerTwoSelect = $('#player2')[0];

/**
 * Represents and handles the game selections e.g. game modes or players
 *
 * @constructor
 */
var GameModeSelector = function () {
    const self = this;

    self.selectedGameMode = EASY;

    self.playerOneOption = HUMAN;
    self.playerTwoOption = MACHINE;

    self.previousSelection = EASY;

    /**
     * Initializes the default selections or event listeners on selectors
     */
    self.init = function () {
        self.setDefaultSelectedMode();
        self.setEventListeners();
    }

    /**
     * Sets event listeners on game mode selector radio buttons
     */
    self.setEventListeners = function () {
        radioButtonContainers.each(function (index, item) {
            item.addEventListener(LEFT_CLICK_MODE_RADIO_EVENT, self.onModeRadioLeftClick, false);
        });

        playerOneSelect.onchange = self.onPlayerOneSelection;
        playerTwoSelect.onchange = self.onPlayerTwoSelection;

    }

    /**
     * Event handler function on any game mode selector radio button click
     *
     * @param event {Event} - Dispatches and event object on any game mode selection change
     */
    self.onModeRadioLeftClick = function(event) {
        var index = 0;
        // Handles the game mode selection change in case
        // the left click was on the selector list container (var radioButtonContainers)
        if (event.target.className === 'container') {
            index = Array.from(event.target.parentNode.children).indexOf(event.target);
            self.selectedGameMode = radioLabels[index].innerHTML.toLowerCase();
            // Handles the game mode selection change in case
            // the left click was on the radio selector tick/icon
        } else if (event.target.className === 'radio-thick') {
            radioButtons.each(function (index, item) {
                if (item === event.target) {
                    self.selectedGameMode = radioLabels[index].innerHTML.toLowerCase();
                }
            });
            // Handles the game mode selection change in case
            // the left click was on the radio selector label
        } else if (event.target.className === 'radio-label') {
            var label = event.target.innerHTML.toLowerCase();
            if (label !== EMPTY) {
                self.selectedGameMode = label;
            }
        }

        //Checks if there is any redundant call to avoid dispatch the event twice
        if (self.selectedGameMode !== self.previousSelection) {
            var event = new Event(GAME_MODE_IS_CHANGED);
            dispatchEvent(event);
            console.log(self.selectedGameMode);
        }

        //Remembers the previous selection for the above condition
        self.previousSelection = self.selectedGameMode;
    }

    /**
     * Event handler function on the player one dropdown change
     */
    self.onPlayerOneSelection = function () {
        var event = new Event(PLAYER_SELECTION_CHANGED);
        self.playerOneOption = playerOneSelect.value;
        dispatchEvent(event);

        console.log(self.playerOneOption);
    }

    /**
     * Event handler function on the player two dropdown change
     */
    self.onPlayerTwoSelection = function () {
        var event = new Event(PLAYER_SELECTION_CHANGED);
        self.playerTwoOption = playerTwoSelect.value;
        dispatchEvent(event);
        console.log(self.playerTwoOption);
    }

    /**
     * Sets the default selected game mode to easy
     */
    self.setDefaultSelectedMode = function() {
        for (var i = 0; i < radioButtons.length; ++i) {
            if (radioButtons[i].checked) {
                self.selectedGameMode = radioLabels[i].innerHTML;
            }
        }
    }
}


