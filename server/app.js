global.__base = __dirname + '/';

var WordBank = require(__base + 'wordbank');
var Server = require(__base + 'server');
var Model = require(__base + 'shared/model');

var TICKS_PER_SECOND = 60;

var tick = 0;
var commands = [];
var gameModel = new Model();
var lastUpdate = Date.now();
var nextPlayerId = 0;
var nextEnemyId = 0;
var ids = [];
var connections = [];
var lastConnection = null;

setInterval(function() {
  var now = Date.now();
  var delta = now - lastUpdate;
  lastUpdate = now;
  tick++;

  // 1. Process all commands
  commands.forEach(function(command) {
    gameModel.runCommand(command);
  });

  // 2. Update game objects
  gameModel.update(delta);

  // 3. Send commands to all clients
  Server.notifyAll({
    tick: tick,
    delta: delta,
    commands: commands
  });

  commands = [];

  if (ids.length > 0 && Math.random() > 0.99) {
    var owner = ids[Math.floor(Math.random() * ids.length)];
    commands.push({
      type: 'spawnEnemy',
      data: {
        id: nextEnemyId++,
        playerId: owner,
        duration: 7000 + Math.random() * 3000,
        word: WordBank.getWord()
      }
    });
  }
}, 1000 / TICKS_PER_SECOND);

Server.on('receive', function(connection, data) {
  console.log('RECEIVED:', data);
  commands.push.apply(commands, data);
});

Server.on('disconnect', function(connection) {
  var index = connections.indexOf(connection);

  commands.push({
    type: 'playerLeft',
    data: {
      id: ids[index]
    }
  });

  ids.splice(index, 1);
  connections.splice(index, 1);
});

Server.on('connect', function(connection, syncFunction) {
  var id = nextPlayerId++;
  ids.push(id);
  connections.push(connection);
  console.log("New connection", connection.remoteAddress);
  console.log(ids);
  console.log(connections);

  commands.push({
    type: 'playerJoined',
    data: {
      id: id
    }
  });
  syncFunction({
    tick: tick,
    snapshot: true,
    id: id,
    state: gameModel.serialize()
  });
});
