(function(window, document, location) {
  function Route() {
    this.routes = {};
  }

  Route.prototype.when = function(path, handler) {
    this.routes[path] = handler;
    return this;
  };

  Route.prototype.otherwise = function(handler) {
    this.when(null, handler);
    return this;
  };

  window.route = new Route();

  window.onpopstate = function(event) {
    var route   = window.route;
    var routes  = route.routes;
    var path    = location.pathname;
    var handler = routes[path] || routes[null];
    if (handler) { handler(); }
  };

  function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(window.onpopstate);
})(window, document, location);
