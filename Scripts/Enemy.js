var Enemy = qc.defineBehaviour('qc.engine.Enemy', qc.Behaviour, function() {
  this.letterIndex = 0;
  this.word = "JAYVAN";
  this.typedColor = null;
  this.untypedColor = null;
  this.textNode = null;

  var self = this;

  this.addListener(this.game.input.onKeyDown, function(keyCode) {
    self.tryKey(String.fromCharCode(keyCode));
  });
}, {
  textNode: qc.Serializer.NODE,
  typedColor: qc.Serializer.COLOR,
  untypedColor: qc.Serializer.COLOR
});

Enemy.prototype.awake = function() {
  this.updateText();
};

Enemy.prototype.update = function() {

};

Enemy.prototype.updateText = function() {
  console.log(this.typedColor);
  console.log(this.untypedColor);
  this.textNode.text = "[rgb(" + this.typedColor.rgb.join(",") + ")]" + this.word.slice(0, this.letterIndex) + "[-]" +
                       "[rgb(" + this.untypedColor.rgb.join(",") + ")]" + this.word.slice(this.letterIndex) + "[-]";
};

Enemy.prototype.tryKey = function(key) {
  if (this.word[this.letterIndex] == key) {
    this.letterIndex++;
    this.updateText();
    return true;
  }

  return false;
};
