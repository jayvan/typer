var TypeMaster = qc.defineBehaviour('qc.engine.TypeMaster', qc.Behaviour, function() {
  this.enemyPrefab = null;
  this.enemyNode = null;
  this.enemies = [];
}, {
  enemyPrefab: qc.Serializer.PREFAB,
  enemyNode: qc.Serializer.NODE
});

TypeMaster.prototype.awake = function() {
  this.enemies[0] = node = this.game.add.clone(this.enemyPrefab, this.enemyNode);
}
