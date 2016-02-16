var Spawner = qc.defineBehaviour('qc.engine.Spawner', qc.Behaviour, function() {
  this.enemyPrefab = null;
  this.enemyContainer = null;
  this.spawnPosition = 0;
}, {
  enemyPrefab: qc.Serializer.PREFAB,
  enemyContainer: qc.Serializer.NODE
});

Spawner.prototype.spawn = function(enemy, local) {
  var enemyNode = this.game.add.clone(this.enemyPrefab, this.enemyContainer);
  enemyNode.y = this.spawnPosition * 100;

  if (!local) {
    enemyNode.alpha = 0.75;
  }

  var tweenPosition = enemyNode.addScript('qc.TweenPosition')
  tweenPosition.duration = 10;
  tweenPosition.from.set(-200, enemyNode.y);
  tweenPosition.to.set(750, enemyNode.y);
  tweenPosition.playForward();

  this.spawnPosition = (this.spawnPosition + 1) % 6;
  var enemyView = enemyNode.getScript("qc.engine.Enemy");
  enemyView.init(enemy);
};
