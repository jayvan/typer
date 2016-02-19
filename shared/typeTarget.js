var Action = require(__base + 'shared/action');

var TypeTarget = function(params) {
  this.letterIndex = params.letterIndex || 0;
  this.id = params.id;
  this.word = params.word;
  this.playerId = params.playerId;
  this.lifetime = params.lifetime || 0;
  this.duration = params.duration;
  this.expired = params.expired || false;
  this.indexChanged = new Action();
  this.timedOut = new Action();
};

TypeTarget.prototype.serialize = function() {
  return {
    letterIndex: this.letterIndex,
    id: this.id,
    word: this.word,
    playerId: this.playerId,
    lifetime: this.lifetime,
    duration: this.duration,
    expired: this.expired
  };
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
