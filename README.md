## Usage example

```javascript
var mlopGeocoder = require('mlop-geo');

var options = {
  provider: 'aliyun',
  httpAdapter: 'http-aliyun' // 若是阿里云地图 必须指定为 http-aliyun 对阿里云请求与结果都做了处理
};


var geocoder = mlopGeocoder(options);

// Using callback
geocoder.reverse({
  lat: 31.2303122784 ,
  lon: 121.4735623090
  }, function(err, res) {
  console.log(res);
});

//Or using Promise
geocoder.reverse(
  {
    lat: 31.2303122784 ,
    lon: 121.4735623090
  }
  )
 .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });

// output
[ { adcode: '310101',
    country: '中国',
    province: '上海',
    city: '上海',
    district: '黄浦区',
    provider: 'aliyun' } ]
    
```