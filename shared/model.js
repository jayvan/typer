var Player = require(__base + 'shared/player');
var TypeTarget = require(__base + 'shared/typeTarget');
var Action = require(__base + 'shared/action');

var Model = function(params) {
  var self = this;
  if (params === undefined) {
    params = {
      players: []
    };
  }

  this.enemySpawned = new Action();

  this.players = {};
  Object.keys(params.players).forEach(function(playerId) {
    var playerData = params.players[playerId];
    var player = new Player(playerData);
    self.players[playerData.id] = new Player(playerData);
  });
};

Model.prototype.serialize = function() {
  var serializedPlayers = {};
  for (var playerId in this.players) {
    serializedPlayers[playerId] = this.players[playerId].serialize();
  }

  return {
    players: serializedPlayers
  };
};

Model.prototype.runCommand = function(command) {
  console.log("Running command", command);
  // playerJoined {
  //   id: Int (The id assigned to the player)
  // }
  if (command.type == "playerJoined") {
    var player = new Player(command.data);
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
  for (var playerId in this.players) {
    var player = this.players[playerId];
    if (!player) {
      continue;
    }

    player.update(delta);
  }
};

module.exports = Model;
