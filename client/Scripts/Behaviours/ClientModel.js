var ClientModel = qc.defineBehaviour('qc.engine.ClientModel', qc.Behaviour, function() {
  this.tick = 0;
  this.model = new Model();
  this.pendingCommands = [];
}, {
    // fields need to be serialized
});

ClientModel.prototype.awake = function() {
  var self = this;
  this.addListener(this.game.input.onKeyDown, function(keyCode) {
    self.submitCommand({
      type: 'keyDown',
      data: {
        key: String.fromCharCode(keyCode)
      }
    });
  });
};

ClientModel.prototype.runCommand = function(command) {
  this.model.runCommand(command);
};

ClientModel.prototype.logicUpdate = function(delta) {
  this.model.update(delta);
};

ClientModel.prototype.loadSnapshot = function(snapshot) {
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
