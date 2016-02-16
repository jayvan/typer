window.require = function(path) {
  last = path.split('/').pop;
  return window[last];
};

window.module = {};
