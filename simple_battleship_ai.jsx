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
    let grid2 = [];
    let g_key = 0;
    let key_count = 0;
    for (let i = 0; i < 10; i++) {
      let rows1 = [];
      let rows2 = [];
      for (let j = 0; j < 10; j++) {
        rows1.push(this.renderSquare(key_count))
        rows2.push(this.renderSquare(key_count))
        key_count++;
      }
      grid1.push(
        <div className="board-row" key={g_key}>
          {rows1}
        </div>
      );
      grid2.push(
        <div className="board-row" key={g_key + "two"}>
          {rows2}
        </div>
      );
      g_key++;
    }
    return (
      <div>
        <div className="board-label">Pirate Board</div>
        <div>{grid1}</div>
        <div className="board-label">AI Board</div>
        <div className="inline-blk">{grid2}</div>
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
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      pirateIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.pirateIsNext ? "P" : "AI";
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
    } else {
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
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  // Check if all pieces from
  return null;
}