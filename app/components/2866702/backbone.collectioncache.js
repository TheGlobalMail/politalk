/*!
 * backbone.collectioncache.js v0.0.2
 * Copyright 2012, Tim Branyen (@tbranyen)
 * backbone.collectioncache.js may be freely distributed under the MIT license.
 */
(function(window) {

"use strict";

// Dependencies
var Backbone = window.Backbone;
var _ = window._;
var $ = window.$;
// If session doesn't exist, simply use a plain object.
var sessionStorage = window.sessionStorage || {};

// Maintain an in-memory cache.
function Cache() {}
// Set the prototype to sessionStorage.
Cache.prototype = sessionStorage;

// Create a new Cache.
var cache = new Cache();

// Override sync on Collections, allowing them to cache.
Backbone.Collection.prototype.sync = function(method, collection, options) {
  // Get the correct URL.
  var url = _.isFunction(collection.url) ? collection.url() : collection.url;

  // Check for cache property and if an existing cache exists.
  if (collection.cache === true && cache[url]) {
    // Extract from sessionStroage and place into memory.
    if (_.isString(cache[url])) {
      cache[url] = JSON.parse(cache[url]);
    }

    // Trigger the success with the correct data.
    options.success.apply(this, cache[url]);

    // Emulate the jqXHR.
    return $.Deferred().resolve();
  }

  // Call out to default implementation.
  var jqXHR = Backbone.sync.apply(this, arguments);
  
  // Wait until complete and if successful, cache!
  jqXHR.then(function() {
    cache[url] = _.toArray(arguments);
    sessionStorage[url] = JSON.stringify([arguments[0], "success", {}]);
  });

  // Emulate normal Sync.
  return jqXHR;
};

})(this);