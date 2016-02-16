var Player = function(id) {
  this.id = id;
  this.enemies = [];
  this.targetedEnemies = [];
};

Player.prototype.addEnemy = function(enemy) {
  if (this.targetedEnemies.length == this.enemies.length) {
    this.targetedEnemies.push(enemy);
  }

  this.enemies.push(enemy);
};

Player.prototype.keyTyped = function(letter) {
  var reset = false;
  var matches = [];

  for (var i = 0; i < this.targetedEnemies.length; i++) {
    var enemy = this.targetedEnemies[i];
    var matched = enemy.sendKey(letter);

    if (enemy.finished()) {
      this.enemies.splice(this.enemies.indexOf(enemy), 1);
      reset = true;
    }

    if (matched) {
      matches.push(enemy);
    }
  }

  if (reset) {
    this.targetedEnemies.forEach(function(enemy) {
      enemy.reset();
    });

    this.targetedEnemies = this.enemies;
  } else if (matches.length != 0) {
    for (var i = 0; i < this.targetedEnemies.length; i++) {
      var enemy = this.targetedEnemies[i];
      if (matches.indexOf(enemy) === -1) {
        enemy.reset();
      }
    }

    this.targetedEnemies = matches;
  }
};

module.exports = Player;
