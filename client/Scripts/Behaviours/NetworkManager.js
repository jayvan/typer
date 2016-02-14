var NetworkManager = qc.defineBehaviour('qc.engine.NetworkManager', qc.Behaviour, function() {
  this.websocketHost = 'ws://localhost:8080';
  this.websocketProtocol = 'echo-protocol';
  this.spawner = null;
  this.connection = null;
}, {
  websocketHost: qc.Serializer.STRING,
  websocketProtocol: qc.Serializer.STRING,
  spawner: qc.Serializer.NODE
});

NetworkManager.prototype.awake = function() {
  this.connection = new WebSocket(this.websocketHost, this.websocketProtocol);
  console.log(this.websocket);
  this.connection.onmessage = function(json) {
    var command = JSON.parse(json);
    console.log(command);
  };
};

