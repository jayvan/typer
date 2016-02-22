var Player = function(params) {
  var self = this;
  this.id = params.id;
  this.enemies = {};
  Object.keys(params.enemies || {}).forEach(function(enemyId) {
    var enemyData = params.enemies[enemyId];
    self.enemies[enemyData.id] = new TypeTarget(enemyData);
  });
  this.targetedEnemyIds = params.targetedEnemyIds || [];
};

Player.prototype.serialize = function() {
  var serializedEnemies = {};
  for (enemyId in this.enemies) {
    var enemy = this.enemies[enemyId];
    serializedEnemies[enemyId] = enemy.serialize();
  }

  return {
    id: this.id,
    enemies: serializedEnemies,
    targetedEnemyIds: this.targetedEnemyIds
  };
};

Player.prototype.update = function(delta) {
  for (var enemyId in this.enemies) {
    var enemy = this.enemies[enemyId];

    if (!enemy) {
      continue;
    }

    enemy.update(delta);

    if (enemy.expired) {
      this.removeEnemy(enemy);
    }
  }
}

Player.prototype.removeEnemy = function(enemy) {
  this.enemies[enemy.id] = null;
  delete this.enemies[enemy.id];

  var index = this.targetedEnemyIds.indexOf(enemy.id);
  if (index != -1) {
    this.targetedEnemyIds.splice(index, 1);
  }

  if (this.targetedEnemyIds.length == 0) {
    this.resetTargets();
  }
};

Player.prototype.resetTargets = function() {
  this.targetedEnemyIds = Object.keys(this.enemies).map(function(n) {
    return parseInt(n);
  });;
};

Player.prototype.addEnemy = function(enemy) {
  if (this.targetedEnemyIds.length == Object.keys(this.enemies).length) {
    this.targetedEnemyIds.push(enemy.id);
  }

  this.enemies[enemy.id] = enemy;
};

Player.prototype.keyTyped = function(letter) {
  var self = this;
  var reset = false;
  var matches = [];

  for (var i = 0; i < this.targetedEnemyIds.length; i++) {
    var enemyId = this.targetedEnemyIds[i];
    var enemy = this.enemies[enemyId];
    var matched = enemy.sendKey(letter);

    if (enemy.finished()) {
      delete this.enemies[enemyId];
      this.targetedEnemyIds.splice(this.targetedEnemyIds.indexOf(enemyId), 1);
      reset = true;
    }

    if (matched) {
      matches.push(enemy.id);
    }
  }

  if (reset) {
    this.targetedEnemyIds.forEach(function(enemyId) {
      self.enemies[enemyId].reset();
    });

    this.resetTargets();
  } else if (matches.length != 0) {
    for (var i = 0; i < this.targetedEnemyIds.length; i++) {
      var enemy = this.enemies[this.targetedEnemyIds[i]];
      if (matches.indexOf(enemy.id) === -1) {
        enemy.reset();
      }
    }

    this.targetedEnemyIds = matches;
  }
};

module.exports = Player;
