# moped-sync-store-tests

A test suite for use with any moped-sync-store.

[![Dependency Status](https://img.shields.io/david/mopedjs/moped-sync-store-tests.svg)](https://david-dm.org/mopedjs/moped-sync-store-tests)
[![NPM version](https://img.shields.io/npm/v/moped-sync-store-tests.svg)](https://www.npmjs.org/package/moped-sync-store-tests)

## Installation

    npm install moped-sync-store-tests

## Usage

```js
'use strict';

var test = require('../../moped-sync-store-tests');
var MemoryStore = require('../');

test(new MemoryStore()).done(function () {
  console.log('Tests passed');
});
```

## Spec

A sync store is an object with the following methods:

 1. getItem(collection, itemId)
 2. getInitial(filter)
 3. writeChanges(changes)
 4. getChanges(id, filter)

### getItem(collecion, itemId)

This method returns a promise for the current value of an item.  This is useful for filtering updates.

### getInitial(filter)

This gets the initial state for a client.  It should be an object with two properties:

 1. state
 2. next

`next` is the Id to give to `getChanges` in order to get changes since this state.  `state` is the current state of all objects allowed by `filter`.  It is an object with a property for each collection, containg an array of values that match the corresponding filter.

### writeChanges(changes)

Writes an array of changes.

### getChanges(id, filter)

Gets all the changes since `id` that match filter.  Returns `{changes: [array of changes], next: [Id to give to next getChanges call]}`

## License

  MIT
