global.__base = __dirname + '/';

var WordBank = require(__base + 'wordbank');
var Server = require(__base + 'server');
var Model = require(__base + 'shared/model');

var TICKS_PER_SECOND = 20;

var tick = 0;
var commands = [];
var gameModel = new Model();
var lastUpdate = Date.now();

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
}, 1000 / TICKS_PER_SECOND);

Server.on('receive', function(data) {
  console.log('RECEIVED:', data);
  commands.push.apply(commands, data);
});

Server.on('connect', function(syncFunction) {
  console.log("New connection");
  syncFunction({
    tick: tick,
    snapshot: true,
    state: gameModel.serialize()
  });
});
