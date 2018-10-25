function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        />
    );
  }
  render() {
    let grid1 = [];
    let g_key = 0;
    let key_count = 0;
    for (let i = 0; i < 10; i++) {
      let rows1 = [];
      for (let j = 0; j < 10; j++) {
        rows1.push(this.renderSquare(key_count))
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      winner: null
    };
  }

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

  handleStart() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    let rowDisplacement = 0;
    let choicesPerRow = Math.floor(100/this.state.aiAmmo);
    while (this.state.aiAmmo > 0) {
      for (let k = 0; k < this.state.probGuess.length; k++) {
        if (squares[this.state.probGuess[k]] == "AI") {
          this.state.probGrid[this.state.probGuess[k]] += -1;
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
          this.state.probGrid[randomSquareKey] += -1;
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
    }, () => {console.log(this.state.start)});
  }
  
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
          <button onClick={e => this.handleStart()}>START</button>
        </div>
        <div className="try-again">
          <button onClick={e => this.handleReplay()}>Try Again</button>
        </div>
        <div className="reset">
          <button onClick={e => this.handleReset()}>Reset</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));