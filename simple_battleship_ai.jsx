/**
 * Returns a board cell represented as a clickable button.
 */
function Cell(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * Class representing the Board for the game.
 */
class Board extends React.Component {
  renderCell(i) {
    return (
      <Cell
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        />
    );
  }
  
  render() {
    let grid1 = []; // Init the grid presenting the board.
    let g_key = 0; // Unique key for React efficiency on mutating DOM tree.
    let key_count = 0; // Cell numbering.
    
    // Init the board.
    for (let i = 0; i < 10; i++) {
      let rows1 = [];
      for (let j = 0; j < 10; j++) {
        rows1.push(this.renderCell(key_count))
        key_count++;
      }
      grid1.push(
        <div className="board-row" key={g_key}>
          {rows1}
        </div>
      );
      g_key++;
    }
    return (
      <div>
        <div className="board-label">Please place all 5 pirate ships!</div>
        <div>{grid1}</div>
      </div>
    );
  }
}

/**
 * Class representing the state of the Game and logic for rules.
 */
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [ // Keeps track of current state of the board.
        {
          squares: Array(100).fill(null)
        }
      ],
      probGrid: [ // Keeps track of weights of each cell being picked.
        {
          probSquares: Array(100).fill(0)
        }
      ],
      probGuess: [], // Keeps track of guesses to try.
      pirateShipCount: 5, // Number of pirate ships allowed.
      aiAmmo: 30, // Ammo capacity of AI system/
      stepNumber: 0, // Step history count for keeping track of current state of history.
      pirateIsNext: true, // Boolean of whether the pirate moves next.
      start: false, // Keeps track of the whether AI should start playing.
      winner: null // Keeps track of who won the current game.
    };
  }

  /**
   * Handles clicks of Cells in the Board.
   */
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.start == false && this.state.pirateShipCount > 0) {
      if (squares[i] != "P") {
        squares[i] = "P";
        this.state.pirateShipCount--;
      }
    }
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      pirateIsNext: !this.state.pirateIsNext
    });
  }

  /*
   * Handles the START button.
   * Allows the AI to start playing the game.
   */
  handleStart() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    let rowDisplacement = 0;
    let choicesPerRow = Math.floor(100/this.state.aiAmmo);
    while (this.state.aiAmmo > 0) {
      for (let k = 0; k < this.state.probGuess.length; k++) {
        if (squares[this.state.probGuess[k]] == "AI") {
          this.state.probGrid[this.state.probGuess[k]] += -2;
          if (this.state.probGrid[this.state.probGuess[k]] >= 0) {
            this.state.probGrid.splice(this.state.probGuess[k], 1);
          }
          continue;
        }
        if (squares[this.state.probGuess[k]] == "P") {
          squares[this.state.probGuess[k]] = "AI";
          if (this.state.probGrid[this.state.probGuess[k]] < Number.MAX_SAFE_INTEGER) {
            this.state.probGrid[this.state.probGuess[k]] += 1;
          }
          this.state.probGuess.push(this.state.probGuess[k]);
          this.state.pirateShipCount++; // counting back up to original ship count.
          this.state.aiAmmo--;
        }
      }
      let i = 0;
      while (i < choicesPerRow && this.state.aiAmmo > 0) {
        let randomSquareKey = (Math.floor(Math.random() * 10) + 0) + rowDisplacement;
        if (squares[randomSquareKey] == "AI") {
          this.state.probGrid[randomSquareKey] += -2;
          continue;
        }
        if (squares[randomSquareKey] == "P") {
          squares[randomSquareKey] = "AI";
          if (this.state.probGrid[randomSquareKey] < Number.MAX_SAFE_INTEGER) {
            this.state.probGrid[randomSquareKey] += 1;
          }
          this.state.probGuess.push(randomSquareKey);
          this.state.pirateShipCount++; // counting back up to original ship count.
        }
        else {
          squares[randomSquareKey] = "AI";
          this.state.probGrid[randomSquareKey] += -1;
        }
        this.state.aiAmmo--;
        i++;
      }
      rowDisplacement += 10;
    }
    
    if (this.state.pirateShipCount == 5) {
      this.state.winner = "AI";
    }
    else {
      this.state.winner = "Pirate";
    }
    
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      pirateIsNext: !this.state.pirateIsNext,
      start: true
    });
  }
  
  /**
   * Handles the Try Again button.
   * Starts a new round while keeping the state of the board/game.
   */
  handleReplay() {
    this.setState({
      history: [
        {
          squares: Array(100).fill(null)
        }
      ],
      probGrid: [
        {
          probSquares: Array(100).fill(0)
        }
      ],
      pirateShipCount: 5,
      aiAmmo: 30,
      stepNumber: 0,
      pirateIsNext: true,
      start: false,
      win: false
    });
  }
  
  /**
   * Handles the RESET button.
   * Resets the board and game.
   */
  handleReset() {
    this.setState({
      history: [
        {
          squares: Array(100).fill(null)
        }
      ],
      probGrid: [
        {
          probSquares: Array(100).fill(0)
        }
      ],
      probGuess: [],
      pirateShipCount: 5,
      aiAmmo: 30,
      stepNumber: 0,
      pirateIsNext: true,
      start: false,
      win: false
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.state.winner;

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } 
    else if(this.state.start == false) {
      status = "Pirate, place your 5 pieces and START GAME?";
    }
    else {
      status = "Next player: " + (this.state.pirateIsNext ? "Pirate" : "AI");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
        <div className="start">
          <button id="start-button" onClick={e => this.handleStart()}>START</button>
        </div>
        <div className="try-again">
          <button id="replay-button" onClick={e => this.handleReplay()}>Try Again</button>
        </div>
        <div className="reset">
          <button id="reset-button" onClick={e => this.handleReset()}>RESET</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));