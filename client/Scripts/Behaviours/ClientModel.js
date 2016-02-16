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
  var self = this;
  this.spawner = this.spawnerNode.getScript('qc.engine.Spawner');
  this.model = new Model();

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

ClientModel.prototype.loadSnapshot = function(id, snapshot) {
  this.localId = id;
  this.model.deserialize(snapshot);
};

ClientModel.prototype.submitCommand = function(command) {
  this.pendingCommands.push(command);
};

ClientModel.prototype.flushCommands = function() {
  var oldCommands = this.pendingCommands;
  this.pendingCommands = [];
  return oldCommands;
};
