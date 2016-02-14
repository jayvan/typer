var NetworkManager = qc.defineBehaviour('qc.engine.NetworkManager', qc.Behaviour, function() {
  this.websocketHost = 'ws://localhost:8080';
  this.websocketProtocol = 'echo-protocol';
  this.spawnerNode = null;
  this.spawner = null;
  this.connection = null;
}, {
  websocketHost: qc.Serializer.STRING,
  websocketProtocol: qc.Serializer.STRING,
  spawnerNode: qc.Serializer.NODE
});

NetworkManager.prototype.awake = function() {
  var self = this;
  this.spawner = this.spawnerNode.getScript("qc.engine.TypeMaster")
  this.connection = new WebSocket(this.websocketHost, this.websocketProtocol);

  this.connection.onmessage = function(message) {
    var command = JSON.parse(message.data);
    if (command.action === "spawn") {
      self.spawner.spawnEnemy(command.data.word, command.data.playerId);
    } else if (command.action === "newPlayer") {
      self.spawner.spawnPlayer(command.data);
    }
  };
};

