(function() {
  function getBaseHref() {
    var el = document.querySelector('base');
    return el ? el.getAttribute('href').replace(/\/$/, '') : '';
  }

  function fixedEncodeURIComponent(str) {
    return str.replace(/[?]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  var redirect = false;

  function Route() {
    this.routes = {};

    Object.defineProperty(this, 'pathname', {
      enumerable: true,
      get: function() {
        return location.pathname.replace(getBaseHref(), '');
      },
      set: function(newValue) {
        newValue = newValue[0] === '/' ? newValue : '/' + newValue;
        newValue = getBaseHref() + newValue;
        newValue = fixedEncodeURIComponent(newValue);
        history[redirect ? 'replaceState' : 'pushState'](
          {}, document.title, newValue
        );
        redirect = false;
        onpopstate();
      }
    });
  }

  function pathRegExp(path) {
    var ret = {
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(_, slash, key, option) {
        var optional = (option === '?' || option === '*?') ? '?' : null;
        var star = (option === '*' || option === '*?') ? '*' : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$');
    return ret;
  }

  Route.prototype.when = function(path, route) {
    if (path) {
      var regexp = pathRegExp(path);
      route.regexp = regexp.regexp;
      route.keys = regexp.keys;
    }
    this.routes[path] = route;

    if (path) {
      var redirectPath = (path[path.length - 1] === '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      regexp = pathRegExp(redirectPath);
      this.routes[redirectPath] = {
        redirectTo: path,
        regexp: regexp.regexp,
        keys: regexp.keys
      };
    }

    return this;
  };

  Route.prototype.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };

  window.route = new Route();

  function switchRouteMatcher(on, route) {
    var keys = route.keys,
        params = {};

    if (!route.regexp) return null;

    var m = route.regexp.exec(on);
    if (!m) return null;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = m[i];

      if (key && val) {
        params[key.name] = val;
      }
    }
    return params;
  }

  function onroutechange(route) {
    var event = new CustomEvent('routechange');
    window.dispatchEvent(event);

    if (route.handler) { route.handler(); }
  }

  function getTemplateFor(route, callback) {
    var request = new XMLHttpRequest();
    var templateUrl = route.templateUrl;
    templateUrl = templateUrl[0] === '/' ? templateUrl : '/' + templateUrl;
    request.open('GET', getBaseHref() + templateUrl, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(this.response);
      }
    };

    request.send();
  }

  function parseRoute() {
    var Route  = window.route;
    var routes = Route.routes;
    var params, match;
    for (var path in routes) {
      if (routes.hasOwnProperty(path)) {
        var route = routes[path];
        if (!match && (params = switchRouteMatcher(Route.pathname, route))) {
          match = route;
          Route.params = params;
        }
      }
    }
    return match || routes[null];
  }

  function onpopstate() {
    var route = parseRoute();
    if (!route) { return; }

    var Route = window.route;
    if (route.redirectTo) {
      redirect = true;
      Route.pathname = route.redirectTo;
      return;
    }

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

  function startsWith(haystack, needle) {
    return haystack.lastIndexOf(needle, 0) === 0;
  }

  function stripBaseUrl(base, url) {
    if (startsWith(url, base)) {
      return url.substr(base.length);
    }
  }

  var appBase = document.querySelector('base').href;

  function parseLinkUrl(url, relHref, el) {
    if (relHref && relHref[0] === '#') {
      location.hash = relHref.slice(1);
      return false;
    }
    var appUrl, prevAppUrl;
    var rewrittenUrl;

    if (typeof (appUrl = stripBaseUrl(appBase, url)) !== 'undefined') {
      prevAppUrl = appUrl;
      rewrittenUrl = appBase + prevAppUrl;
    }
    return !!rewrittenUrl;
  }

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
      if (parseLinkUrl(absHref, relHref, el)) {
        event.preventDefault();
        if (location.pathname !== el.pathname) {
          var pathname = el.pathname;
          pathname = stripBaseUrl(getBaseHref(), pathname) || pathname;
          window.route.pathname = pathname;
        }
      }
    }
  }

  ready(function() {
    document.body.addEventListener('click', onclick);
  });
})();
