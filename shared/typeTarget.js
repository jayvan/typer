var Action = require(__base + 'shared/action');

var TypeTarget = function(params) {
  this.letterIndex = 0;
  this.word = params.word;
  this.playerId = params.playerId;
  this.lifetime = 0;
  this.duration = params.duration;
  this.indexChanged = new Action();
  this.expired = false;
  this.timedOut = new Action();
};

TypeTarget.prototype.update = function(delta) {
  this.lifetime += delta;
  if (!this.expired && this.lifetime >= this.duration) {
    this.timedOut.trigger();
    this.expired = true;
  }
};

TypeTarget.prototype.sendKey = function(key) {
  if (this.word[this.letterIndex] === key) {
    this.letterIndex++;
    this.indexChanged.trigger();
    return true;
  }

  return false;
};

TypeTarget.prototype.reset = function() {
  this.letterIndex = 0;
  this.indexChanged.trigger();
};

TypeTarget.prototype.finished = function() {
  return this.letterIndex === this.word.length;
};

module.exports = TypeTarget;
