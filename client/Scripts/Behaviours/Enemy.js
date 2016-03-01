var Enemy = qc.defineBehaviour('qc.engine.Enemy', qc.Behaviour, function() {
  this.typeTarget = null;
  this.typedColor = null;
  this.untypedColor = null;
  this.textNode = null;
  this.destroyed = new Action();
  this.subscriptions = [];
}, {
  textNode: qc.Serializer.NODE,
  typedColor: qc.Serializer.COLOR,
  untypedColor: qc.Serializer.COLOR
});

Enemy.prototype.awake = function() {
};

Enemy.prototype.onDestroy = function() {
  this.destroyed.trigger();
  this.subscriptions.forEach(function(subscription) {
    subscription();
  });
};

Enemy.prototype.update = function() {
  var pc = this.typeTarget.lifetime / this.typeTarget.duration;
  this.gameObject.setAnchor(new qc.Point(pc, 0), new qc.Point(pc, 0), false);
};

Enemy.prototype.init = function(typeTarget) {
  this.typeTarget = typeTarget;
  this.updateText();
  var self = this;

  this.subscriptions.push(typeTarget.indexChanged.subscribe(function(index) {
    self.updateText();

    if (self.typeTarget.finished()) {
      self.gameObject.destroy();
    }
  }));

  this.subscriptions.push(typeTarget.timedOut.subscribe(function() {
    self.gameObject.destroy();
  }));
};

Enemy.prototype.updateText = function() {
  this.textNode.text = "[rgb(" + this.typedColor.rgb.join(",") + ")]" + this.typeTarget.word.slice(0, this.typeTarget.letterIndex) + "[-]" +
                       "[rgb(" + this.untypedColor.rgb.join(",") + ")]" + this.typeTarget.word.slice(this.typeTarget.letterIndex) + "[-]";
};
