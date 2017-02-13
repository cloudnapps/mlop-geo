## Usage example

```javascript
var mlopGeocoder = require('mlop-geo');

var options = {
  provider: 'aliyun',
  httpAdapter: 'http-aliyun' // 若是阿里云地图 必须指定为 http-aliyun 对阿里云请求与结果都做了处理
};


var geocoder = mlopGeocoder(options);

// Using callback
geocoder.reverse({lat: 30.2946651399,
   lon: 109.4796537731}, function(err, res) {
  console.log(res);
});

//Or using Promise
geocoder.reverse(
  {lat: 30.2946651399,
   lon: 109.4796537731}
   )
 .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });

// output
[ { country: '中国',
  province: '湖北',
  city: '恩施土家族苗族自治州',
  district: '恩施市',
  provider: 'aliyun' } ]
```