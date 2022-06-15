/* 桃園市藥局基本資料 */

//載入需要的模組，並設定取用名稱
var fetch = require('node-fetch');

// 設定目標網址
var url = 'https://data.fda.gov.tw/opendata/exportDataList.do?method=ExportData&InfoId=35&logType=5';

/* fetch(url)
  .then(response => {
    // console.log(response)
    console.log(response.headers.get('Content-Type'));
    var ptime = response.headers.get('Date');
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.url);
    return response.json();
  })
  .then(json => parseJSON2Table(json));  */
  

let startTime, endTime;

// Get the start time
startTime = Date.now();
  
// Perform an http(s) fetch.
fetch(url)
  .then(response => response.json()) // 取得json
  .then(json => {
    // console.log(JSON.stringify(json));
    // Get the end time
    endTime = Date.now();
    console.debug('Elapsed time:', ((endTime - startTime)/1000).toFixed(3));
    results = parseJSON2Table(json);
    results.forEach(function(result) {
      console.log(result)
    });
  })
  .catch(error => {
    console.log(error);
  });

  targetArea = "中壢區"

// 機構狀態,機構名稱,地址縣市別,地址鄉鎮市區,地址街道巷弄號,負責人姓名,負責人性別,電話,是否為健保特約藥局
// 處理 JSON 內容
function parseJSON2Table(jsonObj) {
  var rows = [];
  var data = jsonObj;
  for (var i = 0; i < data.length; i++) {
    isHS = data[i]['是否為健保特約藥局']
    area = data[i]['地址鄉鎮市區']
    if (isHS == 'Y' && area == targetArea) {
      oper = data[i]['機構狀態']
      phar = data[i]['機構名稱']
      city = data[i]['地址縣市別']
      addr = data[i]['地址街道巷弄號']
      tele = data[i]['電話']
      // [機構名稱,地址縣市別,地址鄉鎮市區,地址街道巷弄號,電話]  
      var row = [phar, city, area, addr, tele]
      rows.push(row);
      //console.log(row); 
    }
  }
  return rows;
}
