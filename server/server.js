var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = [];


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

var handlers = {
  receive: null,
  connect: null
};

function on(type, handler) {
  handlers[type] = handler;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('main', request.origin);
    connections.push(connection);

    handlers.connect(function(syncMessage) {
      connection.sendUTF(JSON.stringify(syncMessage));
    });

    connection.on('message', function(data, flags) {
      if (data.type === 'utf8') {
        handlers.receive(JSON.parse(data.utf8Data));
      }
    });

    connection.on('close', function(reasonCode, description) {
      connections.splice(connections.indexOf(connection), 1);
    });
});

var notifyAll = function(message) {
  if (typeof(message) !== "string") {
    message = JSON.stringify(message);
  }

  connections.forEach(function(connection) {
    connection.sendUTF(message);
  });
};

module.exports = {
  notifyAll: notifyAll,
  on: on
}
