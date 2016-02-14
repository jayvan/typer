#!/usr/bin/env node
var fs = require('fs');
var WebSocketServer = require('websocket').server;
var http = require('http');
var connections = [];

var words = fs.readFileSync('words', 'utf8').split('\n');
words.pop();

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
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
    connections.push(connection);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
      connections.splice(connections.indexOf(connection), 1);
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function blastOut(message) {
  var json = JSON.stringify(message);

  connections.forEach(function(connection) {
    console.log("Sending payload to", connection.remoteAddress);
    connection.sendUTF(json);
  });
}

setInterval(function() {
  var word = words[Math.floor(Math.random() * words.length)];
  blastOut({
    action: 'spawn',
    data: {
      word: word
    }
  });
}, 2500);
