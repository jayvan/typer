var TypeMaster = qc.defineBehaviour('qc.engine.TypeMaster', qc.Behaviour, function() {
  this.enemyPrefab = null;
  this.enemyContainer = null;
  this.spawnPosition = 0;
  this.spawnRate = 2500;
  this.players = {};
  this.localPlayer = null;
}, {
  spawnRate: qc.Serializer.INT,
  enemyPrefab: qc.Serializer.PREFAB,
  enemyContainer: qc.Serializer.NODE
});

TypeMaster.prototype.spawnEnemy = function(word, playerId) {
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

  this.players[playerId].addEnemy(enemy);
}

TypeMaster.prototype.spawnPlayer = function(playerData) {
  var player = new Player(playerData.id);
  if (playerData.local) {
    this.localPlayer = player;
  }
  this.players[playerData.id] = player;
};

TypeMaster.prototype.awake = function() {
  var self = this;
  this.addListener(this.game.input.onKeyDown, function(keyCode) {
    self.handleKey(String.fromCharCode(keyCode));
  });
};

TypeMaster.prototype.handleKey = function(letter) {
  this.localPlayer.keyTyped(letter);
}
