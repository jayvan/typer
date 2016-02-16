var Action = function() {
  this._listeners = [];
}

Action.prototype.subscribe = function(callback) {
  this._listeners.push(callback);
  var removeIndex = this._listeners.length - 1;
  var self = this;
  return function() {
    self._listeners[removeIndex] = null;
  };
};

Action.prototype.trigger = function(value) {
  for (var i = 0; i < this._listeners.length; i++) {
    var listener = this._listeners[i];
    if (listener !== null) {
      listener(value);
    }
  }
};

module.exports = Action;
