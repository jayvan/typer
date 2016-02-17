var Player = require(__base + 'shared/player');
var TypeTarget = require(__base + 'shared/typeTarget');
var Action = require(__base + 'shared/action');

var Model = function() {
  this.players = {};
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
    delete this.players[command.data.id];
  }

  // spawnEnemy {
  //   word : String (The word that must be typed to defeat it)
  //   duration: The number of ms that the target will live for
  //   playerId: Int (The player the enemy is assigned to)
  // }
  else if (command.type == "spawnEnemy") {
    var enemy = new TypeTarget(command.data);
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
  for (playerId in this.players) {
    var player = this.players[playerId];
    if (!player) {
      continue;
    }

    player.update(delta);
  }
};

Model.prototype.serialize = function() {
  return {
    tbd: 'fill me in'
  };
};

Model.prototype.deserialize = function(state) {

};

module.exports = Model;
