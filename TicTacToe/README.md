Tic Tac Toe Game
Tic Tac Toe is a paper and pencil game for 2 players, X and O, who take turns marking the spaces in a 3×3 grid.
The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game.

Tools and technologies used
JetBrains WebStorm IDE (There is no any dependency on the IDE)
JavaScript(jQuery), HTML5, CSS3

Running and testing the game
1. Unzip the project archive
2. Launch the "index.html" file by just double clicking on it (or drag and drop it into the browser).
3. Human vs Machine(AI) is selected by default when the game is started. So you can play the game with AI just by clicking on the board.
4. Please press the Restart button after each time you decide to change any game selection e.g. Players or game difficulty level (easy, medium or hard).
5. Use the Undo button to roll back the players steps one by one during the game.
6. If you choose AI vs AI please wait couple of seconds while the game is started (press the Restart button after before).

Design / Functionality Limitations and TODO: list
1. If you decided to use the Undo button please note that only Human player is supported to use it for now.
TODO: Add Undo button for AI vs AI matches too

2. There was an additional feature mentioned in the requirement list: to have a Hint button. Human player could use it to get some hints how to play optimally during the game.
Unfortunately I couldn't finish that today. But I can complete it later if needed
TODO: Add a hint button for human player

3. In addition I was planning to have more modules in the project e.g. GameManager which would be responsible to hold the players interaction logic.
Or Global Event handler mechanism to make the application more event driven by allowing the modules communicate via event dispatching
rather than via dependency injections.

4. Currently Human vs Human selection is not working
TODO: Add a Human vs Human too

Possible bugs or behavioral issues:

1. It's possible that sometimes you see a little rendering issues when you restart the game while it is running.

Game Core logic description:

The game consists of 3 difficulty modes:

1. Easy - when AI (Artificial Intelligence) plays based on pure random position generations.
which approximately means that somebody plays this game with closed eyes :)

2. Medium - in this mode AI has 2 additional logic layer on top of the easy mode.
    1. Checks if there is any chance to pick any winning position in the board either by row/column/diagonal
    2. If not then checks if there is any potential opponent move which would complete any row/column/diagonal
    3. Otherwise runs the easy mode logic

3. Hard - Here you will meet an intelligent AI which potentially should play in maximum optimal way and you never should be able to beat him :)
   In this level there are 3 more smarter layers on top of the medium level.
    1. Checks if the center position is free. If so then it will occupy it
    2. If the center position is busy then it will check any free corner in the board
    3. In third step it will scan the board for any dangerous corner
    which is a potential chance to loose the game if it is not occupied in time.

TODO:I can provide another document describing the core logic algorithm for hard mode if needed.


Project / source code design structure

The project business logic consists of 6 main modules:
    1. main.js - the entry point of the application (also controls the players communication and game board event handling)
    2. Board.js - represents the game board model
    3. AI.js - represents the AI behaviour and core logic
    4. Human.js - holds the human player information
    5. BoardRenderer.js - has means to draw or update the board on UI
    6. GameSelector.js - responsible to handle and update the game selections like difficulty mode or players









