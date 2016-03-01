var Spawner = qc.defineBehaviour('qc.engine.Spawner', qc.Behaviour, function() {
  this.enemyPrefab = null;
  this.enemyContainer = null;
  this.spawnPosition = 0;
  this.enemies = {};
}, {
  enemyPrefab: qc.Serializer.PREFAB,
  enemyContainer: qc.Serializer.NODE
});

Spawner.prototype.spawn = function(enemy, local) {
  var enemyNode = this.game.add.clone(this.enemyPrefab, this.enemyContainer);
  this.enemies[enemy.id] = enemyNode;

  enemyNode.y = this.spawnPosition * 100;

  if (!local) {
    enemyNode.alpha = 0.75;
  }

  this.spawnPosition = (this.spawnPosition + 1) % 6;
  var enemyView = enemyNode.getScript("qc.engine.Enemy");
  enemyView.init(enemy);

  var self = this;
  enemyView.destroyed.subscribe(function() {
    self.enemies[enemy.id] = null;
    delete self.enemies[enemy.id];
  });
};

Spawner.prototype.reassign = function(enemy, local) {
  this.enemies[enemy.id].alpha = local ? 1 : 075;
};
