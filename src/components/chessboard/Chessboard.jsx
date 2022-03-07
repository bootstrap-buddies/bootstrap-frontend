import * as React from 'react';
import Chessboard from 'chessboardjsx' ;
import * as Chess from 'chess.js';
import logInfo from '../../utils/logger.js'
import './Chessboard.css';

class ChessBoard extends React.Component {

  engineHistory = [];
  constructor (props) {
    super( props );
    this.state = {
      fen: "",
      history: [],
    }
  };

  sendMessage = (msg) => {
    const {websocket} = this.props // websocket instance passed as props to the child component.

    try {
        websocket.send(msg) //send data to the server
    } catch (error) {
        console.log(error) // catch error
    }
  }

  render() {
    const {websocket} = this.props
    if (websocket != null) {
      websocket.onmessage = evt => {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data)
        this.setState({dataFromServer: message})
        
        console.log(message)
        this.engineHistory.push(message.sourceSquare + message.targetSquare)
        this.game.move({ from: message.sourceSquare, to: message.targetSquare });
        this.setState({ fen: this.game.fen() });
    }
  }

    return(
      <div className='chessboard-container'>
        <Chessboard className='chessboard'
          position={this.state.fen}
          onDrop={this.onDrop}>
        </Chessboard>
    </div>
    )
  }

  componentDidMount() {
    this.game = new Chess();
    this.setState({
      fen: "start",
      history: []
    });
  }

  /**
   * Function callback that indicates a move is being requested by the user
   * @param {sourceSquare} String - Contains the start square of the move i.e. 'e2'
   * @param {targetSquare} String - Contains the end square of the move i.e. 'e4'
   * @returns void
   */
  onDrop = ({ sourceSquare, targetSquare }) => {
    logInfo('ChessBoard :: onDrop', {sourceSquare, targetSquare});
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare
    });

    // illegal move
    if (move === null) return;
    this.setState(({ history }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true })
    }));

    this.engineHistory.push(sourceSquare + targetSquare)
    let msg = JSON.stringify({
      sourceSquare: sourceSquare,
      targetSquare: targetSquare,
      history: this.engineHistory
    })

    this.sendMessage(msg)

    // By Default, let the oponent make a random move until we integrate with the engine
    // this.makeRandomMove();
  };

  /**
   * Function for making a random move on the board
   * @returns void
   */
  makeRandomMove = () => {
    logInfo('ChessBoard :: makeRandomMove');

    let possibleMoves = this.game.moves();
    if (this.checkIfGameOver()) {
      return;
    }

    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    this.game.move(possibleMoves[randomIndex]);
    this.setState({ fen: this.game.fen() });
  }

  /**
   * Function for checking if the game is over
   * @returns true if game is over, false if not over
   */
  checkIfGameOver = () => {
    let possibleMoves = this.game.moves();

    // exit if the game is over
    if (this.game.game_over() === true || this.game.in_draw() === true || possibleMoves.length === 0) {
      return true;
    }

    return false;
  }
}

export default ChessBoard;