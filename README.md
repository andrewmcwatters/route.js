# route.js
Provides routing and deeplinking

## Install
### yarn
```shell
yarn add andrewmcwatters/route.js#v1.4.17
```

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

## Properties
### `route.pathname`
Is a String containing an initial '/' followed by the path of the URL. If
changed, the associated document navigates to the new route.

### `route.params`
`route.params` allows you to retrieve the current set of route parameters.

## Events
### routechange
Dispatched after a route change has happened.

#### Target
window

### viewcontentloaded
Dispatched every time the view content is reloaded.

#### Target
the current data-view element

## License
MIT License

Copyright (c) 2020 Andrew McWatters

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
