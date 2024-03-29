import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onSquareClick}
    >
      {props.squareValue}
    </button>
  )
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square squareValue={this.props.squares[i]}
        onSquareClick={() => this.props.onSquareClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: [null, null, null,
          null, null, null,
          null, null, null],
        lastClickBox: 0
      },
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleSquareClick(i) {
    const history = this.state.history.slice(0,
      this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const tempSquares = current.squares.slice();
    if (calculateWinner(tempSquares) || tempSquares[i]) {
      return;
    }
    tempSquares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: tempSquares,
        lastClickBox: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 === 0)
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const canPlay = current.squares.includes(null)

    const grid = {
      0: 'A1',
      1: 'B1',
      2: 'C1',
      3: 'A2',
      4: 'B2',
      5: 'C2',
      6: 'A3',
      7: 'B3',
      8: 'C3'
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      let text = ''

      if (move > 0) {
        text = grid[step.lastClickBox]
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {text}
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else if (!canPlay) {
      status = 'Draw';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onSquareClick={(i) => this.handleSquareClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}