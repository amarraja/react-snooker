
var SnookerTable = function(){
  this.balls = [
    { colour: 'red', count: 12, points: 1 },
    { colour: 'yellow', count: 1, points: 2 },
    { colour: 'green', count: 1, points: 3 },
    { colour: 'brown', count: 1, points: 4 },
    { colour: 'blue', count: 1, points: 5 },
    { colour: 'pink', count: 1, points: 6 },
    { colour: 'black', count: 1, points: 7 }
  ];
  this.players = [
    { name: "Player 1", active: true, score: 0 },
    { name: "Player 2", active: false, score: 0 }
  ]
  this.activePlayer = 0;
}

SnookerTable.prototype.findBall = function(colour){
  //TODO: Make this nicer
  for (var i = this.balls.length - 1; i >= 0; i--) {
    var ball = this.balls[i];
    if (ball.colour == colour)
      return ball;
  };
}

SnookerTable.prototype.shouldDecrement = function(ball){
  if (!this.validPot(ball)){
    return false;
  }

  if (ball.colour === 'red'){
    return true;
  }

  var redsFinished = this.findBall('red').count == 0;
  return redsFinished;
}

SnookerTable.prototype.validPot = function(ball){
  return ball.count > 0;
}

SnookerTable.prototype.award = function(ball) {
  var player = this.players[this.activePlayer];
  player.score += ball.points;
};

SnookerTable.prototype.handlePot = function(b){
  var ball = this.findBall(b.colour);
  //TODO: Validate red/colour and fouls
  if (this.validPot(ball)){
    this.award(ball);
    if (this.shouldDecrement(ball)){
      //TODO: Should be in ball
      ball.count = ball.count - 1;
    }
  }
  
  return this;
}

SnookerTable.prototype.handleMiss = function(b){
  this.activePlayer = (this.activePlayer + 1) % this.players.length;
  for (var i = this.players.length - 1; i >= 0; i--) {
    this.players[i].active = this.activePlayer == i;
  };
  return this;
}

var Ball = React.createClass({displayName: "Ball",
  render: function(){
    var classString = 'ball ball-' + this.props.ball.colour;
    return (
      React.createElement("li", {onClick: this.props.onPot}, 
        React.createElement("div", {className: classString}, 
          React.createElement("div", {className: "count"}, "(", this.props.ball.count, ")")
        )
      )
    );
  }
});

var PlayersList = React.createClass({displayName: "PlayersList",

  playerClass: function(player, index){
    var className = "player";
    if (player.active){
      className += " active";
    }
    return className;
  },

  render: function(){
    var players = this.props.players;
    return (
      React.createElement("div", {className: "players"}, 
        React.createElement("span", {className: this.playerClass(this.props.players[0])}, 
          players[0].name
        ), 
        React.createElement("ul", {className: "scores"}, 
          React.createElement("li", null, players[0].score), 
          React.createElement("li", null, players[1].score)
        ), 
        React.createElement("span", {className: this.playerClass(this.props.players[1])}, 
          players[1].name
        )
      )
    );
  }
});

var Table = React.createClass({displayName: "Table",

  getInitialState: function(){
    return {table: new SnookerTable()};
  },

  handlePot: function(ball){
    var newTable = this.state.table.handlePot(ball);
    this.setState({ table: newTable });
  },

  handleMiss: function(){
    var newTable = this.state.table.handleMiss();
    this.setState({ table: newTable });
  },

  render: function(){

    var balls = this.state.table.balls.map(function(ball, i){
      return React.createElement(Ball, {ball: ball, onPot: this.handlePot.bind(this, ball), key: i})
    }, this);

    return (
      React.createElement("div", {className: "wrapper"}, 
        React.createElement(PlayersList, {players: this.state.table.players}), 
        React.createElement("ul", {className: "balls-list"}, 
        balls
        ), 
        React.createElement("button", {className: "miss", onClick: this.handleMiss}, "MISS")
      )
    );
  }
});

React.render(
  React.createElement(Table, null),
  document.getElementById("react-container")
);
