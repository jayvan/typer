var ClientModel = qc.defineBehaviour('qc.engine.ClientModel', qc.Behaviour, function() {
  this.tick = 0;
  this.model = null;
  this.pendingCommands = [];
  this.spawnerNode = null;
  this.localId = -1;
}, {
  spawnerNode: qc.Serializer.NODE
});

ClientModel.prototype.awake = function() {
  this.spawner = this.spawnerNode.getScript('qc.engine.Spawner');
};

ClientModel.prototype.loadModel = function(playerId, state) {
  var self = this;
  this.localId = playerId;
  this.model = new Model(state);

  // Spawn game objects for existing enemies
  for (var playerId in this.model.players) {
    var player = this.model.players[playerId];
    for (var enemyId in player.enemies) {
      var enemy = player.enemies[enemyId];
      self.spawner.spawn(enemy, playerId == self.localId);
    }
  }

  this.addListener(this.game.input.onKeyDown, function(keyCode) {
    self.submitCommand({
      type: 'keyTyped',
      data: {
        key: String.fromCharCode(keyCode),
        playerId: self.localId
      }
    });
  });

  this.model.enemySpawned.subscribe(function(enemy) {
    self.spawner.spawn(enemy, enemy.playerId == self.localId);
  });
};

ClientModel.prototype.runCommand = function(command) {
  this.model.runCommand(command);
};

ClientModel.prototype.logicUpdate = function(delta) {
  this.model.update(delta);
};

ClientModel.prototype.submitCommand = function(command) {
  this.pendingCommands.push(command);
};

ClientModel.prototype.flushCommands = function() {
  var oldCommands = this.pendingCommands;
  this.pendingCommands = [];
  return oldCommands;
};
