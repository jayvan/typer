var Enemy = qc.defineBehaviour('qc.engine.Enemy', qc.Behaviour, function() {
  this.typeTarget = null;
  this.typedColor = null;
  this.untypedColor = null;
  this.textNode = null;
  this.subscription = null;
}, {
  textNode: qc.Serializer.NODE,
  typedColor: qc.Serializer.COLOR,
  untypedColor: qc.Serializer.COLOR
});

Enemy.prototype.awake = function() {
};

Enemy.prototype.init = function(typeTarget) {
  this.typeTarget = typeTarget;
  this.updateText();
  var self = this;
  this.subscription = typeTarget.indexChanged.subscribe(function(index) {
    self.updateText();

    if (self.typeTarget.finished()) {
      self.subscription();
      self.gameObject.destroy();
    }
  });
};

Enemy.prototype.updateText = function() {
  this.textNode.text = "[rgb(" + this.typedColor.rgb.join(",") + ")]" + this.typeTarget.word.slice(0, this.typeTarget.letterIndex) + "[-]" +
                       "[rgb(" + this.untypedColor.rgb.join(",") + ")]" + this.typeTarget.word.slice(this.typeTarget.letterIndex) + "[-]";
};
