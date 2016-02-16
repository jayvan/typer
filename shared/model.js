var Player = require(__base + 'shared/player');
var TypeTarget = require(__base + 'shared/typeTarget');
var Action = require(__base + 'shared/action');

var Model = function() {
  this.players = {};
  this.enemies = [];
  this.enemySpawned = new Action();
};

Model.prototype.runCommand = function(command) {
  console.log("Running command", command);
  // playerJoined {
  //   id: Int (The id assigned to the player)
  // }
  if (command.type == "playerJoined") {
    var player = new Player(command.data.id);
    this.players[player.id] = player;
  }

  // playerLeft {
  //   id: Int (The id of the leaving player)
  // }
  else if (command.type == "playerLeft") {
    this.players[command.data.id] = null;
  }

  // spawnEnemy {
  //   word : String (The word that must be typed to defeat it)
  //   playerId: Int (The player the enemy is assigned to)
  // }
  else if (command.type == "spawnEnemy") {
    var enemy = new TypeTarget(command.data.word, command.data.playerId);
    this.enemies.push(enemy);
    this.players[command.data.playerId].addEnemy(enemy);
    this.enemySpawned.trigger(enemy);
  }

  // spawnEnemy {
  //   key : String (The key that was typed)
  //   playerId: Int (The player that typed a key)
  // }
  else if (command.type == "keyTyped") {
    this.players[command.data.playerId].keyTyped(command.data.key);
  }
};

Model.prototype.update = function(delta) {

};

Model.prototype.serialize = function() {
  return {
    tbd: 'fill me in'
  };
};

Model.prototype.deserialize = function(state) {

};

module.exports = Model;
