var TypeMaster = qc.defineBehaviour('qc.engine.TypeMaster', qc.Behaviour, function() {
  this.enemyPrefab = null;
  this.enemyContainer = null;
  this.enemies = [];
  this.targetedEnemies = [];
  this.spawnPosition = 0;
  this.spawnRate = 2500;
}, {
  spawnRate: qc.Serializer.INT,
  enemyPrefab: qc.Serializer.PREFAB,
  enemyContainer: qc.Serializer.NODE
});

TypeMaster.prototype._spawnEnemy = function(word) {
  var enemyNode = this.game.add.clone(this.enemyPrefab, this.enemyContainer);
  enemyNode.y = this.spawnPosition * 100;

  var tweenPosition = enemyNode.addScript('qc.TweenPosition')
  tweenPosition.duration = 10;
  tweenPosition.from.set(-200, enemyNode.y);
  tweenPosition.to.set(750, enemyNode.y);
  tweenPosition.playForward();

  this.spawnPosition = (this.spawnPosition + 1) % 6;
  var enemy = enemyNode.getScript("qc.engine.Enemy");
  enemy.word = word;
  enemy.updateText();

  if (this.targetedEnemies.length == this.enemies.length) {
    this.targetedEnemies.push(enemy);
  }

  this.enemies.push(enemy);
}

TypeMaster.prototype.awake = function() {
  var self = this;
  this.addListener(this.game.input.onKeyDown, function(keyCode) {
    self._handleKey(String.fromCharCode(keyCode));
  });
};

TypeMaster.prototype._handleKey = function(letter) {
  var reset = false;
  var matches = [];

  console.log(this.targetedEnemies);

  for (var i = 0; i < this.targetedEnemies.length; i++) {
    var enemy = this.targetedEnemies[i];
    var matched = enemy.tryKey(letter);

    if (enemy.finished()) {
      enemy.gameObject.destroy();
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
}
