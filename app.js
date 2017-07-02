import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
//CSS 
import './app.css'

const PLAYERS = [
  {
    name: "Alan",
    score: 255,
    id: 1
  },
  {
    name: "Henry",
    score: 32,
    id: 2
  },
  {
    name: "Titi",
    score: 45,
    id: 3
  }
]

let nextId = 4;

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {running: false, elapsedTime:0, previousTime:0},
    this.onStart = this.onStart.bind(this),
    this.onStop = this.onStop.bind(this),
    this.onReset = this.onReset.bind(this),
    this.onTick = this.onTick.bind(this),
    this.componentDidMount = this.componentDidMount.bind(this)
    
  }

  componentDidMount() {
    this.interval = setInterval(this.onTick, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onTick() {
    if(this.state.running){
      const now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
      })
    }
  }

  onStart() {
    this.setState(
      {running: true,
       previousTime: Date.now(),
      }
    );
  }
  onStop() {
    this.setState({running: false});
  }

  onReset() {
    this.setState({
      elapsedTime:0,
      previousTime:Date.now(),
    })
  }


  render() {
    let seconds = Math.floor(this.state.elapsedTime / 1000);
    return(
      <div className = "stopwatch">
        <h2> StopWatch</h2>
        <div className = "stopwatch-time"> {seconds} </div>
          { this.state.running ? 
            <button onClick={this.onStop}> Stop </button>
            :
            <button onClick={this.onStart}> Start </button>
          }
          <button onClick = {this.onReset}> Reset </button>
      </div>
      )
  }
}

class AddPlayerForm extends React.Component {
  constructor(props) {
    super(props),
    this.state = {name: ""},
    this.onNameChange = this.onNameChange.bind(this),
    this.onSubmit = this.onSubmit.bind(this)
  }

  onNameChange(e){
    this.setState({name: e.target.value})
  }

  onSubmit(e) {
    e.preventDefault(),
    this.props.onAdd(this.state.name),
    this.setState({name:""})
  }

  render() {
    return (
      <div className="add-player-form">
        <form onSubmit= {this.onSubmit} >
          <input type="text" value={this.state.name} onChange = {this.onNameChange}/>
          <input type="submit" value="Add Player"/>
        </form>

      </div>
    )
  }
}
AddPlayerForm.propTypes = {
  onAdd: PropTypes.func
}

function Stats(props){
  const totalPlayers = props.players.length;
  const totalPoints = props.players.reduce(function(total, player){
    return(
        total += player.score
      )
  }, 0)

  return(
    <table className="stats">
      <tbody>
        <tr>
          <td> Players: </td>
          <td> {totalPlayers}</td>
        </tr>
        <tr>
          <td> Total Points: </td>
          <td> {totalPoints} </td>
        </tr>
      </tbody>
    </table>
    )
}
Stats.propTypes = {
  players: PropTypes.array.isRequired
}


function Header(props) {

  return(
    <div className = "header">
      <Stats players={props.players}/>
      <h1> {props.title} </h1>
      <Stopwatch />
    </div>
    )
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired
};

function Counter(props) {
  return (
    <div className= "counter" >
      <button className= "counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
      <div className= "counter-score"> {props.initialScore} </div>
      <button className= "counter-action increment" onClick={function() {props.onChange(1);}} > + </button>
    </div>
  )
}
Counter.propTypes = {
  score: PropTypes.number,
  onChange: PropTypes.func

}


// class Counter extends React.Component {
//   static get propTypes() {
//      return {
//        initialScore: PropTypes.number.isRequired,
//      }
//   };

//   constructor(props) {
//     super(props),
//     this.state = {score: this.props.initialScore},
//     this.incrementScore = this.incrementScore.bind(this),
//     this.decrementScore = this.decrementScore.bind(this)
//   }

//   incrementScore() {
//     this.setState( {score: (this.state.score + 1) })
//   }

//   decrementScore() {
//     this.setState( {score: (this.state.score -1) })
//   }

//   render() {
    
//     )  
//   }
// }



function Player(props) {
  return(
    <div className = "player">
      <div className= "player-name">
        <a className="remove-player" onClick={props.onRemove}> X </a>
        {props.name}
      </div>
      <div className = "player-score">
        <Counter initialScore={props.score} onChange = {props.onScoreChange} />
      </div>
    </div>
  )
}
Player.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func,
  onRemove: PropTypes.func
}


class Application extends React.Component{
  
  constructor(props) {
    super(props),
    this.state = {players: this.props.initialPlayers},
    this.onPlayerAdd = this.onPlayerAdd.bind(this),
    this.onRemovePlayer = this.onRemovePlayer.bind(this)
    }

  // static defaultProps() {
  //   return {
  //     title: "Scoreboard"
  //   }
  // }

  onScoreChange(index, delta) {
    console.log('onScoreChange', index, delta)
    this.state.players[index].score += delta 
    this.setState(this.state)
  }

  onPlayerAdd(name){
    console.log("Player added:", name),
    this.state.players.push({
      name: name,
      score: 0, 
      id: nextId
    })
    this.setState(this.state)
    nextId+=1;
  }

  onRemovePlayer(index){
    this.state.players.splice(index,1),
    this.setState(this.state)

  }

  render() {
    return(
    <div className = "scoreboard">
      <Header title ={this.props.title} players = {this.state.players} />
      <div className = "players">
        {this.state.players.map(function(player, index) {
            return ( 
              <Player 
                onScoreChange = {function (delta) {this.onScoreChange(index,delta)}.bind(this)}
                onRemove = {function() {this.onRemovePlayer(index)}.bind(this)}
                name = {player.name} 
                score = {player.score} 
                key = {player.id}/>
            )
        }.bind(this))}
        <AddPlayerForm onAdd = {this.onPlayerAdd}/>

      </div>
    </div>
    )
  }
}
Application.propTypes = {
  title: PropTypes.string, 
  initialPlayers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired
  }))
};
Application.defaultProps = {title: "Scoreboard"}



ReactDOM.render(<Application initialPlayers = {PLAYERS}/>, document.getElementById('container'));


