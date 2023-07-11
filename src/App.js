import React from 'react';
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.currentValue}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        currentValue={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-line">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-line">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-line">
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
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      playerX: true,
    };
  }

  isGameOver(squares) {
    return computeWinner(squares) || fullBoard(squares);
  }

  fazerJogadaIA() {
    const squares = this.state.squares.slice();
    if (this.isGameOver(squares)) {
      return;
    }

    const melhorJogada = minimax(squares, 'O');
    squares[melhorJogada] = 'O';

    this.setState({
      squares: squares,
      playerX: true,
    });
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (this.isGameOver(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.playerX ? 'X' : 'O';
    this.setState(
      {
        squares: squares,
        playerX: !this.state.playerX,
      },
      () => {
        if (!this.state.playerX && !this.isGameOver(squares)) {
          setTimeout(() => this.fazerJogadaIA(), 500);
        }
      }
    );
  }

  resetGame() {
    this.setState({
      squares: Array(9).fill(null),
      playerX: true,
    });
  }

  render() {
    const winner = computeWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (fullBoard(this.state.squares)) {
      status = 'It\'s a tie!';
    } else {
      status = 'Next player: ' + (this.state.playerX ? 'X' : 'O');
    }

    return (
      <div className="game">        
        <div className="board-game">
          <h1>Tic Tac Toe</h1>
          <Board
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.resetGame()}>Reset Game</button>
        </div>
      </div>
    );
  }
}

function computeWinner(squares) {
  const combinacoesVitoria = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < combinacoesVitoria.length; i++) {
    const [a, b, c] = combinacoesVitoria[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

function fullBoard(squares) {
  return squares.every((square) => square !== null);
}

function minimax(squares, player) {
  const vencedor = computeWinner(squares);
  if (vencedor) {
    return vencedor === 'O' ? 1 : -1;
  } else if (fullBoard(squares)) {
    return 0;
  }

  let melhorPontuacao = player === 'O' ? -Infinity : Infinity;
  let melhorJogada = null;

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const squaresCopia = squares.slice();
      squaresCopia[i] = player;

      const pontuacao = minimax(squaresCopia, player === 'O' ? 'X' : 'O');

      if (player === 'O') {
        if (pontuacao > melhorPontuacao) {
          melhorPontuacao = pontuacao;
          melhorJogada = i;
        }
      } else {
        if (pontuacao < melhorPontuacao) {
          melhorPontuacao = pontuacao;
          melhorJogada = i;
        }
      }
    }
  }

  return melhorJogada;
}


export default Game;
