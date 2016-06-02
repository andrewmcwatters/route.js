(function(window, document, location) {
  function Route() {
    this.routes = {};
  }

  Route.prototype.when = function(path, route) {
    this.routes[path] = route;
    return this;
  };

  Route.prototype.otherwise = function(params) {
    this.when(null, params);
    return this;
  };

  window.route = new Route();

  function getTemplateFor(route, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', route.templateUrl, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = request.responseText;
        callback(data);
      }
    };

    request.send();
  }

  function onroutechange(route) {
    if (route.handler) { route.handler(); }

    var event = new CustomEvent('routechange');
    window.dispatchEvent(event);
  }

  function onpopstate() {
    var Route  = window.route;
    var routes = Route.routes;
    var path   = location.pathname;
    var route  = routes[path] || routes[null];
    if (route.templateUrl) {
      getTemplateFor(route, function(template) {
        Route.template = template;
        onroutechange(route);
      });
    } else {
      onroutechange(route);
    }
  }

  window.addEventListener('popstate', onpopstate);

  function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(onpopstate);

  function view() {
    var router = window.router;
    var el = document.querySelector('[data-view]');
    if (el) {
      el.innerHTML = router.template;
      var event = new CustomEvent('viewcontentloaded');
      el.dispatchEvent(event);
    }
  }

  window.addEventListener('routechange', view);
})(window, document, location);
