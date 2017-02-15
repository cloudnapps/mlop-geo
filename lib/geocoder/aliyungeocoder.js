var util             = require('util'),
    _                = require('lodash'),
    AbstractGeocoder = require('./abstractgeocoder');
var iconv = require('iconv-lite');


/**
 * Constructor
 */
var AliyunGeocoder = function AliyunGeocoder(httpAdapter, options) {
    AliyunGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(AliyunGeocoder, AbstractGeocoder);

var levelDist = {
  1: 'country',
  2: 'province',
  3: 'city',
  4: 'district'
}
var autonomousRegion = ['内蒙古', '广西', '宁夏', '新疆', '西藏'];

var stringRemoveLast = function (str) {
  try {
    return str.substring(0, str.length - 1);
  } catch (e) {
    console.log(e);
  }
};

var getDefaultResult = function () {
  return {
    adcode: '',
    country: '',
    province: '',
    city: '',
    district: ''
  }
}

/**
 * 转换城市名称数据 (省市区中国)
 */
var filterName = function (name, type) {
  var coverName = name;
  if(type === 2){
    if(name === '澳门特别行政区') {
      return '澳门';
    }
    if(name === '香港特别行政区') {
      return '香港';
    }
    var isChangeProvince = false;
    //为了防止 自治区的名称(广西壮族自治区) 高德返回的与 我们后台存储的(广西)不一致，统一改成我们数据库存储的
    _.forEach(autonomousRegion, function (item) {
      if (_.startsWith(name, item)) {
        isChangeProvince = true;
        coverName = item;
      }
    });
    if (!isChangeProvince) {
      coverName = stringRemoveLast(name);
    }
  }else if(type === 3) {
    //若是以 上海郊县 这种名称 就去除 最后两个字 变成 上海
    if(_.endsWith(name, '城区') || _.endsWith(name, '郊县')) {
      coverName = name.substring(0, name.length - 2)
    }
    //若末尾不是 ' 自治 ' 就去除最后一个字
    else if (!_.endsWith(name, '自治', name.length - 1)) {
      coverName = stringRemoveLast(name);
    }
  }else if(type === 4) {
    if(name === '市区') {
      coverName = '';
    }
  }
  return coverName;
};


AliyunGeocoder.prototype._endpoint_reverse = 'http://recode.ditu.aliyun.com/dist_query';


AliyunGeocoder.prototype._formatResult = function(result) {

    if(!result) {
      return {};
    }
    var data = getDefaultResult();
    result = JSON.parse(result);
    var arr = result.dist.split(',');
    data.adcode = result.ad_code;
    arr.forEach(function (item, n) {
      data [ levelDist[n +1] ] = filterName(item, n+1);
    });

    return data;
};

/**
* Reverse geocoding
* @param {lat:<number>,lon:<number>, ...}  lat: Latitude, lon: Longitude, ... see https://wiki.openstreetmap.org/wiki/Nominatim#Parameters_2
* @param <function> callback Callback method
*/
AliyunGeocoder.prototype._reverse = function(query, callback) {

    var _this = this;

    var params = {};

    var lat = query.lat;
    var lng = query.lon;

    params.l = lat + ',' + lng;
    this.httpAdapter.get(this._endpoint_reverse , params, function(err, result) {
        if (err) {
            return callback(err);
        } else {
          if(result.error) {
            return callback(new Error(result.error));
          }

          var results = [];
          if (result instanceof Array) {
            for (var i = 0; i < result.length; i++) {
              results.push(_this._formatResult(result[i]));
            }
          } else {
            results.push(_this._formatResult(result));
          }

          results.raw = result;
          callback(false, results);
        }
    });
};

module.exports = AliyunGeocoder;
