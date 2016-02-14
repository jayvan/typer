var fs = require('fs');
var WebSocketServer = require('websocket').server;
var http = require('http');

var currentId = 0;
var spawnId = 0;
var players = [];

var Player = function(connection) {
  this.id = currentId++;
  this.connection = connection;
}

Player.prototype.notify = function(message) {
  if (typeof(message) !== "string") {
    this.connection.sendUTF(JSON.stringify(message));
  } else {
    this.connection.sendUTF(message);
  }
};

// Load dictionary
var words = fs.readFileSync('words', 'utf8').split('\n');
words.pop();

// Need an HTTP server for websocket upgrade, but don't want to serve HTTP content
var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    var newPlayer = new Player(connection);

    players.forEach(function(player) {
      player.notify({
        action: 'newPlayer',
        data: {
          id: newPlayer.id,
          local: false
        }
      });

      newPlayer.notify({
        action: 'newPlayer',
        data: {
          id: player.id,
          local: false
        }
      });
    });

    newPlayer.notify({
      action: 'newPlayer',
      data: {
        id: newPlayer.id,
        local: true
      }
      });

    players.push(newPlayer);

    connection.on('close', function(reasonCode, description) {
      players.splice(players.indexOf(newPlayer), 1);
    });
});

function notifyAll(message) {
  players.forEach(function(player) {
    player.notify(message);
  });
}

setInterval(function() {
  if (players.length == 0) {
    return;
  }

  spawnId = (spawnId + 1) % players.length;

  var word = words[Math.floor(Math.random() * words.length)];
  notifyAll({
    action: 'spawn',
    data: {
      word: word,
      playerId: spawnId
    }
  });
}, 2000);
