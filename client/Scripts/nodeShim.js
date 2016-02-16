window.__base = "";

window.require = function(path) {
  var last = path.split('/').pop();
  var name = last.charAt(0).toUpperCase() + last.slice(1);
  return window[name];
};

window.module = {};
