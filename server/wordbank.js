var fs = require('fs');

console.log("Loading word bank...");
var words = fs.readFileSync('words', 'utf8').split('\n');
words.pop();
console.log('' + words.length, 'words loaded');

var getWord = function() {
  return words[Math.floor(Math.random() * words.length)];
}

module.exports = {
  getWord: getWord
};
