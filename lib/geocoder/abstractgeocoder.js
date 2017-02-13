'use strict';

var net = require('net');
var ValueError = require('../error/valueerror.js');

function formatGeocoderName(name) {
  return name.toLowerCase().replace(/geocoder$/, '');
}

/**
 * AbstractGeocoder Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options
 */
var AbstractGeocoder = function(httpAdapter, options) {
  if (!this.constructor.name) {
    throw new Error('The Constructor must be named');
  }

  this.name = formatGeocoderName(this.constructor.name);

  if (!httpAdapter || httpAdapter == 'undefined') {
    throw new Error(this.constructor.name + ' need an httpAdapter');
  }
  this.httpAdapter = httpAdapter;

  if (!options || options == 'undefined') {
    options = {};
  }

  if (this.options) {
    this.options.forEach(function(option) {
      if (!options[option] || options[option] == 'undefined') {
        options[option] = null;
      }
    });
  }

  this.options = options;
};

/**
* Reverse geocoding
* @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.reverse = function(query, callback) {
  if (typeof this._reverse != 'function') {
    throw new Error(this.constructor.name + ' no support reverse geocoding');
  }

  return this._reverse(query, callback);
};

module.exports = AbstractGeocoder;
