'use strict';

var Helper = require('./helper.js');
var Geocoder = require('./geocoder.js');

var HttpAdapter = require('./httpadapter/httpadapter.js');
var HttpAdapter_Aliyun = require('./httpadapter/httpadapter-aliyun.js');
var HttpsAdapter = require('./httpadapter/httpsadapter.js');
var RequestAdapter = require('./httpadapter/requestadapter.js');

var AliyunGeocoder = require('./geocoder/aliyungeocoder.js');
/**
* Geocoder Facotry
*/
var GeocoderFactory = {

  /**
  * Return an http adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getHttpAdapter: function(adapterName, options) {
    if (adapterName === 'http') {
      return new HttpAdapter(null, options);
    }
    if(adapterName === 'http-aliyun') {
      return new HttpAdapter_Aliyun(null, options);
    }
    if (adapterName === 'https') {
      return new HttpsAdapter(null, options);
    }
    if (adapterName === 'request') {
      return new RequestAdapter(null, options);
    }
  },
  /**
  * Return a geocoder adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getGeocoder: function(geocoderName, adapter, extra) {
    if (geocoderName === 'aliyun') {
      return new AliyunGeocoder(adapter);
    }

    throw new Error('No geocoder provider find for : ' + geocoderName);
  },
  /**
  * Return an formatter adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getFormatter: function(formatterName, extra) {
    if (formatterName === 'gpx') {
      var GpxFormatter = require('./formatter/gpxformatter.js');

      return new GpxFormatter();
    }

    if (formatterName === 'string') {
      var StringFormatter = require('./formatter/stringformatter.js');

      return new StringFormatter(extra.formatterPattern);
    }
  },
  /**
  * Return a geocoder
  * @param  <string|object> geocoderAdapter Geocoder adapter name or adapter object
  * @param  <string|object> httpAdapter     Http adapter name or adapter object
  * @param  <array>         extra           Extra parameters array
  * @return <object>
  */
  getGeocoder: function(geocoderAdapter, httpAdapter, extra) {
    if (typeof geocoderAdapter === 'object') {
      extra = geocoderAdapter;
      geocoderAdapter = null;
      httpAdapter = null;
    }

    if (!extra) {
      extra = {};
    }

    if (extra.httpAdapter) {
      httpAdapter = extra.httpAdapter;
    }

    if (extra.provider) {
      geocoderAdapter = extra.provider;
    }

    if (!httpAdapter) {
      httpAdapter = 'https';
    }

    if (!geocoderAdapter) {
      geocoderAdapter = 'aliyun';
    }

    if (Helper.isString(httpAdapter)) {
      httpAdapter = this._getHttpAdapter(httpAdapter, extra);
    }

    if (Helper.isString(geocoderAdapter)) {
      geocoderAdapter = this._getGeocoder(geocoderAdapter, httpAdapter, extra);
    }

    var formatter = extra.formatter;

    if (Helper.isString(formatter)) {
      formatter = this._getFormatter(formatter, extra);
    }

    return new Geocoder(geocoderAdapter, formatter);
  }
};

module.exports = GeocoderFactory;
