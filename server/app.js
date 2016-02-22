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

  var validCommands = [];

  // 1. Process all commands
  commands.forEach(function(command) {
    if (gameModel.commandValid(command)) {
      gameModel.runCommand(command);
      validCommands.push(command);
    } else {
      console.log("Invalid command:", command);
    }
  });

  // 2. Update game objects
  gameModel.update(delta);

  // 3. Send commands to all clients
  Server.notifyAll({
    tick: tick,
    delta: delta,
    commands: validCommands
  });

  commands = [];

  if (ids.length > 0 && Math.random() > 0.99) {
    var owner = ids[Math.floor(Math.random() * ids.length)];
    commands.push({
      origin: 'server',
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
  var id = ids[connections.indexOf(connection)];
  data.forEach(function(command) {
    command.origin = id;
  });
  console.log('RECEIVED:', data);
  commands.push.apply(commands, data);
});

Server.on('disconnect', function(connection) {
  var index = connections.indexOf(connection);

  commands.push({
    origin: 'server',
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

  commands.push({
    origin: 'server',
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
