(function() {
  function Route() {
    this.routes = {};

    Object.defineProperty(this, 'pathname', {
      enumerable: true,
      get: function() { return location.pathname; },
      set: function(newValue) {
        history.pushState({}, document.title, newValue);
        onpopstate();
      }
    });
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
        callback(request.responseText);
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
    if (!route) { return; }

    if (route.template) {
      Route.template = route.template;
      onroutechange(route);
    } else if (route.templateUrl) {
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
    var route = window.route;
    var el = document.querySelector('[data-view]');
    if (el) {
      el.innerHTML = route.template;
      var event = new CustomEvent('viewcontentloaded');
      el.dispatchEvent(event);
    }
  }

  window.addEventListener('routechange', view);

  var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;

  function onclick(event) {
    if (event.ctrlKey || event.shiftKey || event.metaKey) { return; }
    if (event.button === 2) { return; }

    var el = event.target;

    while (el.nodeName !== 'A') {
      if (el === document.body || !(el = el.parentNode)) { return; }
    }

    var absHref = el.href;
    var relHref = el.getAttribute('href');

    if (IGNORE_URI_REGEXP.test(absHref)) return;

    if (absHref && !el.getAttribute('target') && !event.defaultPrevented) {
      event.preventDefault();
      window.route.pathname = relHref[0] === '/' ? relHref : '/' + relHref;
    }
  }

  ready(function() {
    document.body.addEventListener('click', onclick);
  });
})();
