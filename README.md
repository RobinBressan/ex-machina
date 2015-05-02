# ex-machina [![Build Status](https://travis-ci.org/RobinBressan/ex-machina.svg?branch=master)](https://travis-ci.org/RobinBressan/ex-machina)

A minimalist state machine.

## Installation

It is available with bower or npm:

```
bower install ex-machina
npm install ex-machina
```

Include `ex-machina.min.js` to the HTML, and the `exMachina` object is now available in the global scope:

```html
<script type="text/javascript" src="/path/to/bower_components/ex-machina/dist/ex-machina.min.js"></script>
```

Alternately, you can use [Browserify](http://browserify.org/) or [RequireJS](http://requirejs.org/) to avoid global scoping.

```js
var exMachina = require('ex-machina');
```

## Usage

### Create a state machine

To create a state machine, use the `exMachina` factory:

```js
var machine = exMachina({
    state1: {
        state2: function(payload) {
            return <condition>;
        }
    }
})
```

You must pass a config object to the state machine factory. It describes all available transitions. In the above example, when `state1` is ended, if the given callback for `state2` returns `true`, the `state2` will be activated. The payload is the value returned by the state which is `state1` here.

*Note: Only one state can be activated at the same time.*

### Add a state

When your state machine is created, you must register all states you described into your config object:

```js
machine.state('state1', function(payload) {
    // the payload is the value returned by the previous state or 
    // the initial payload if it is the first state
    
    // you can return a payload.
    // if you perform asynchronous operation, return the promise.
    // The payload will be the result of the promise
    return <new_payload>;
});
```

### Run the state machine

To run your state machine, just execute it:

```js
machine('<initial_state>', '<initial_payload>')
    .then(function(payload) {
        // a final state was reached
    }, function(error) {
        // an error occurred
    });

```

### Dealing with events

The state machine triggers some events before and after state activation:

```js
machine.on(machine.PRE_STATE_EVENT, function(data) {
    // this is triggered before a state activation
    // data looks like { stateName: <something>, payload: <something> }
});

machine.on(machine.POST_STATE_EVENT, function(data) {
    // this is triggered after a state activation
    // data looks like { stateName: <something>, payload: <something> }
});
```

## Development

Install dependencies:

```sh
make install
```

### Build

To rebuild the minified JavaScript you must run: `make build`.

During development you can run `make watch` to trigger a build at each change.

### Tests

```sh
make test
```

## Contributing

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

## License

This application is available under the [MIT License](https://github.com/RobinBressan/ex-machina/blob/master/LICENSE).
