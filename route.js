(function(window, document, location) {
  function Route() {
    this.routes = {};
  }

  Route.prototype.when = function(path, route) {
    this.routes[path] = route;
    return this;
  };

  Route.prototype.otherwise = function(route) {
    this.when(null, route);
    return this;
  };

  window.route = new Route();

  window.onpopstate = function(event) {
    var route    = window.route;
    var routes   = route.routes;
    var path     = location.pathname;
    var listener = routes[path] || routes[null];
    if (listener) { listener(); }
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
