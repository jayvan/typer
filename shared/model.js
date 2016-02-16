var Model = function() {
  this.players = [];
  this.enemies = [];
};

Model.prototype.runCommand = function(command) {
  console.log("Running command", command);
};

Model.prototype.update = function(delta) {

};

Model.prototype.serialize = function() {
  return {
    tbd: 'fill me in'
  };
};

Model.prototype.deserialize = function(state) {

};

module.exports = Model;
