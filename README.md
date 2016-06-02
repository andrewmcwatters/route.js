# route.js
Provides routing and deeplinking

## Methods

### `route.when(path, route);`
Adds a new route definition to the `Route` interface.

#### Returns
self

### `route.otherwise(params);`
Sets route definition that will be used on route change when no other route
definition is matched.

#### Returns
self

## Events

### routechange
Dispatched after a route change has happened.

#### Target
window

### viewcontentloaded
Dispatched every time the view content is reloaded.

#### Target
the current element
