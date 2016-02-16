var Action = require(__base + 'shared/action');

var TypeTarget = function(word, playerId) {
  this.letterIndex = 0;
  this.word = word;
  this.playerId = playerId;
  this.indexChanged = new Action();
}

TypeTarget.prototype.sendKey = function(key) {
  if (this.word[this.letterIndex] === key) {
    this.letterIndex++;
    this.indexChanged.trigger();
    return true;
  }

  return false;
}

TypeTarget.prototype.reset = function() {
  this.letterIndex = 0;
  this.indexChanged.trigger();
}

TypeTarget.prototype.finished = function() {
  return this.letterIndex === this.word.length;
}

module.exports = TypeTarget;
