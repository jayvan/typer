global.__base = __dirname + '/';

var WordBank = require(__base + 'wordbank');
var Server = require(__base + 'server');
var Model = require(__base + 'shared/model');

var TICKS_PER_SECOND = 30;

var tick = 0;
var commands = [];
var gameModel = new Model();
var lastUpdate = Date.now();
var nextPlayerId = 0;
var ids = {};

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

  if (Object.keys(ids).length > 0 && Math.random() > 0.99) {
    var owner = ids[Object.keys(ids)[0]];
    commands.push({
      type: 'spawnEnemy',
      data: {
        playerId: owner,
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
  commands.push({
    type: 'playerLeft',
    data: {
      id: ids[connection]
    }
  });

  delete ids[connection];
});

Server.on('connect', function(connection, syncFunction) {
  var id = nextPlayerId++;
  ids[connection] = id;
  console.log("New connection");

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
