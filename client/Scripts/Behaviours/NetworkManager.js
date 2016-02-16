var NetworkManager = qc.defineBehaviour('qc.engine.NetworkManager', qc.Behaviour, function() {
  this.websocketHost = 'ws://localhost:8080';
  this.websocketProtocol = 'echo-protocol';
  this.modelNode = null;
  this.model = null;
  this.connection = null;
}, {
  websocketHost: qc.Serializer.STRING,
  websocketProtocol: qc.Serializer.STRING,
  modelNode: qc.Serializer.NODE
});

NetworkManager.prototype.awake = function() {
  var self = this;
  this.model = this.modelNode.getScript("qc.engine.ClientModel")
  this.connection = new WebSocket(this.websocketHost, this.websocketProtocol);

  this.connection.onmessage = function(message) {
    var message = JSON.parse(message.data);

    if (message.snapshot) {
      self.model.loadSnapshot(message.id, message.state);
    } else {
      var commands = self.model.flushCommands();

      if (commands.length > 0) {
        self.connection.send(JSON.stringify(commands));
      }

      message.commands.forEach(function(command) {
        self.model.runCommand(command);
      });

      self.model.logicUpdate(message.delta);
    }
  };
};
