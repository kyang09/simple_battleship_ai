# Simple Pirate Defense

This project is a simple battleship-like game.
The pirate sets 5 locations for ships, and an AI will try to attack the ships.

## Getting Started

This project was developed through an online code pen called: codepen.io
This website does a lot of set up, so the three files in this repo are designed to be pasted into the codepen.
Here's the codepen I used to develop this simple app: [https://codepen.io/kyang09/pen/KGrYKR](https://codepen.io/kyang09/pen/KGrYKR)

## Instructions

1. Before starting, place all 5 pirate ships on the board. Each pirate ship cell will be marked as "P".
2. Once all 5 ships have been placed, press the "START" button. The AI will try to attack the pirate ships, marking cells with "AI".
3. Press the "Try Again" button to set all 5 pirate ships in another (or the same) formation.
4. Press "START" again.
5. Keep repeating steps 3 and 4 until you don't want to play anymore.
6. If you win or would like to reset the game and the AI, press the "RESET" button.

## Future Improvements

The AI system currently just looks at each row, randomly picks floor((# of board cells) / (# of pirate ships)) cells, and goes through a list of possible cells to try based on historical events.

There are many more ways to implement the AI better.
To improve the current AI system, the AI can cluster the searches closely using the historical findings as a "seed".
Human psychology can also be applied to the AI by using some common behaviors from human players.

## Built With

* ReactJS ([react.production.min.js](https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.production.min.js) and [react-dom.production.min.js](https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.production.min.js))
* Babel
* HTML
* CSS

## Versioning

v0.1.0

## Authors

* **Kevin Yang** - *Initial Work*