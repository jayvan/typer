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
  this.enemyReassigned = new Action();

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

Model.prototype.commandValid = function(command) {
  try {
    if (command.type == 'playerJoined') {
      return command.origin == 'server' &&
             this.players[command.data.id] === undefined;
    } else if (command.type == 'playerLeft') {
      return command.origin == 'server' &&
             this.players[command.data.id] !== undefined;
    } else if (command.type == 'keyTyped') {
      return command.origin === command.data.playerId;
    } else if (command.type == 'spawnEnemy') {
      return command.origin == 'server' &&
             this.players[command.data.playerId] &&
             command.data.duration > 0 &&
             command.data.word.length > 0;
    } else {
      console.log("command type", command.type, "not recognized");
    }
  } catch (e) {
    console.log("Command", command, "failed validation:", e);
  }

  return false;
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
    var playerTargets = this.players[command.data.id].enemies;
    this.players[command.data.id] = null;
    delete this.players[command.data.id];
    this.distributeTargets(playerTargets);
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

Model.prototype.distributeTargets = function(targets) {
  remainingPlayers = Object.keys(this.players);
  if (remainingPlayers.length === 0) {
    return;
  }

  var i = 0;
  for (var id in targets) {
    var target = targets[id];
    var playerId = remainingPlayers[i];
    target.reset();
    target.playerId = remainingPlayers[i];
    this.enemyReassigned.trigger(target);
    this.players[playerId].addEnemy(target);
    i = (i + 1) % remainingPlayers.length;
  }
};

module.exports = Model;
