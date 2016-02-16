var TypeTarget = function(word, playerId) {
  this._letterIndex = 0;
  this.word = word;
  this.playerId = playerId;
}

TypeTarget.prototype.sendKey = function(key) {
  if (this.word[this._letterIndex] === key) {
    return true;
  }

  return false;
}

TypeTarget.prototype.reset = function() {
  this._letterIndex = 0;
}

TypeTarget.prototype.finished = function() {
  this._letterIndex === this.word.length;
}

module.exports = TypeTarget;
