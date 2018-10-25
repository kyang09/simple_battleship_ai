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
        <div className="board-label">Pirate Board</div>
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
      pirateShipCount: 5,
      aiAmmo: 30,
      stepNumber: 0,
      pirateIsNext: true,
      start : false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (this.state.start == false && this.state.pirateShipCount > 0) {
      squares[i] = "P";
      this.state.pirateShipCount--;
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
    
    this.state.start = true;
    let probGuess = [];
    let rowDisplacement = 0;
    let choicesPerRow = Math.floor(this.state.aiAmmo);
    while (this.state.aiAmmo > 0) {
      for (let i = 0; i < choicesPerRow; i++) {
        let randomSquareKey = (Math.floor(Math.random() * 9) + 0) + rowDisplacement;
        if (squares[randomSquareKey] == "P") {
          squares[randomSquareKey] = "AI";
          this.state.probGrid[randomSquareKey] += 1;
          this.state.pirateShipCount++; // counting back up to original ship count.
        }
        else {
          squares[randomSquareKey] = "AI";
          this.state.probGrid[randomSquareKey] += -1;
        }
        this.state.aiAmmo--;
      }
      rowDisplacement += 10;
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
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
      this.state.start = false;
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
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  // Check if all pieces from
  return null;
}