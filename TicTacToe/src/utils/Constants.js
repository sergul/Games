//Commons
const EMPTY = '';
const NONE = 'none';

//Modes
const EASY = 'easy';
const MEDIUM = 'medium';
const HARD = 'hard';

//Results
const DRAW = 'draw';

//Event Names
const LEFT_CLICK_BOARD_EVENT = 'click';
const LEFT_CLICK_UNDO_EVENT = 'click';
const LEFT_CLICK_MODE_RADIO_EVENT = 'click';
const GAME_MODE_IS_CHANGED = 'gameModeIsChanged';
const PLAYER_SELECTION_CHANGED = 'playerSelectionChanged';

//Players
const HUMAN = 'human';
const MACHINE = 'machine';

const O = 'O';
const X = 'X';

//Time Durations
const DELAY = 300;

//Sizes
const BOARD_SIZE = 3;
const NUM_BOARD_ELEMENTS = BOARD_SIZE * BOARD_SIZE;

//Colors
const BOARD_DEFAULT_COLOR = '#1A4558';
const O_WIN_COLOR = '#5A8B28';
const X_WIN_COLOR = '#8b211f';
const O_PLAYER_COLOR = '#f7ffc3';
const X_PLAYER_COLOR = '#000000';

//Game messages
const DRAW_MESSAGE = 'This match game is draw';
const HUMAN_WON = 'Congrats ! you won :) yahooooo';
const HUMAN_LOST = "Don't worry and keep on playing :)";