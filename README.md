# route.js
Used for configuring routes

## Methods

### `route.when(path, handler);`
Adds a new route definition to the `Route` interface.

#### Returns
self

### `route.otherwise(handler);`
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
