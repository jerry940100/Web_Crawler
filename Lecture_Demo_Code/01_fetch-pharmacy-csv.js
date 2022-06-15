/* 桃園市藥局基本資料 */

//載入需要的模組，並設定取用名稱
var fetch = require('node-fetch');

// 設定目標網址
var url = 'https://data.fda.gov.tw/opendata/exportDataList.do?method=ExportData&InfoId=35&logType=2';

/* fetch(url)
  .then(function(response) {
    // console.log(response)
    console.log(response.headers.get('Content-Type'));
    var ptime = response.headers.get('Date');
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.url);
    return response.text();
  })
  .then(data => parseCsv2Table(data));  */
  

let startTime, endTime;

// Get the start time
startTime = Date.now();
  
// Perform an http(s) fetch.
fetch(url)
  .then(response => response.text())
  .then(data => {
    // console.log(data);
    // Get the end time
    endTime = Date.now();
    console.debug('Elapsed time:', ((endTime - startTime)/1000).toFixed(3));
    var results = parseCsv2Table(data);
    //ref:https://ithelp.ithome.com.tw/articles/10215281
    //result為results array正在處理的元素
    results.map(function(result) {
      console.log(result)
    });
  })
  .catch(error => {
    console.log(error);
  });

targetArea = "中壢區";

// 機構狀態,機構名稱,地址縣市別,地址鄉鎮市區,地址街道巷弄號,負責人姓名,負責人性別,電話,是否為健保特約藥局
// 處理 CSV 內容
function parseCsv2Table(csvText) {
  var rows = [];  // 預備儲存解譯結果，一列csv = 一個 row
  var lines = csvText.split("\r\n");
  lines.shift();  // 移除欄位列(第一列)
  
  // 解譯資料列，直到內容為空 (null or empty strings)
  while( lines[0] && lines[0].length > 0) {
    var line = lines.shift();         // get first data line
    line = line.replace(/"|\r/g, ''); // remove leading and trailing "|\r
    var splits = line.split(',');     // 以, 切割字串為陣列
    // console.log(splits)
    if (splits[3] == targetArea && splits[splits.length-1] == "Y") {
      var row = [];
      // 取得部分欄位
      row = splits.slice(0, 5).concat(splits.slice(-2, -1))
      rows.push(row);
      // console.log(row); 
    }
  }
  return rows;
}
