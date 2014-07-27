'use strict';

var assert = require('assert');
var Promise = require('promise');
var clone = require('clone');

var oid1 = { '$oid': '53d359ffa5a42541a2000000' };
var oid2 = { '$oid': '53d359ffa5a42541a2000001' };
var guid1 = { '$oid': '53d359ffa5a42541a2000010' };
var guid2 = { '$oid': '53d359ffa5a42541a2000021' };
var guid3 = { '$oid': '53d359ffa5a42541a2000032' };
var guid4 = { '$oid': '53d359ffa5a42541a2000043' };

module.exports = test;
function test(store) {
  var getNextResult;
  return Promise.resolve(null).then(function () {
    assert(typeof store.getItem === 'function', 'store.getItem must be a function');
    assert(typeof store.getInitial === 'function', 'store.getInitial must be a function');
    assert(typeof store.writeChanges === 'function', 'store.writeChanges must be a function');
    assert(typeof store.getChanges === 'function', 'store.getChanges must be a function');

    var writeChangesResult = store.writeChanges([
      {
        action: 'insert',
        item: { make: 'honda', _id: clone(oid1) },
        guid: clone(guid1),
        collection: 'cars'
      },
      {
        action: 'insert',
        item: { make: 'volvo', _id: clone(oid2) },
        guid: clone(guid2),
        collection: 'cars'
      }
    ]);
    assert(isPromise(writeChangesResult), 'The result of calling store.writeChanges must be a Promise');
    return writeChangesResult;
  }).then(function () {
    var getItemResult = store.getItem('cars', clone(oid1));
    assert(isPromise(getItemResult), 'The result of calling store.getItem must be a Promise');
    return getItemResult;
  }).then(function (item) {
    assert.deepEqual(item, { make: 'honda', _id: clone(oid1) });
    var getInitialResult = store.getInitial({cars: {make: 'honda'}});
    assert(isPromise(getInitialResult), 'The result of calling store.getInitial must be a Promise');
    return getInitialResult;
  }).then(function (initial) {
    assert.deepEqual(initial.state, {cars: [ { make: 'honda', _id: clone(oid1) } ] });
    assert(initial.next, 'intial.next should have a value');
    getNextResult = store.getChanges(initial.next, {cars: {make: 'honda'}});
    assert(isPromise(getNextResult), 'The result of calling store.getItem must be a Promise');
    var writeChangesResult = store.writeChanges([
      {
        action: 'update',
        itemId: clone(oid1),
        update: { color: 'red' },
        guid: clone(guid3),
        collection: 'cars'
      },
      {
        action: 'update',
        itemId: clone(oid2),
        update: { color: 'blue' },
        guid: clone(guid4),
        collection: 'cars'
      }
    ]);
    assert(isPromise(writeChangesResult), 'The result of calling store.writeChanges must be a Promise');
    return writeChangesResult;
  }).then(function () {
    return getNextResult;
  }).then(function (next) {
    assert.deepEqual(next.changes, [
      {
        action: 'update',
        itemId: clone(oid1),
        update: { color: 'red' },
        guid: clone(guid3),
        collection: 'cars'
      }
    ]);
  });
}

function isPromise(value) {
  return (value && (typeof value === 'object' || typeof value === 'function') &&
          typeof value.then === 'function');
}
