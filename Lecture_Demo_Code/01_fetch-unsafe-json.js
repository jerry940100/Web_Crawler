/* 桃園市消防安全檢查重大不合格場所 */

//載入需要的模組，並設定取用名稱
var fetch = require('node-fetch');

// 設定目標網址
var url = 'https://data.tycg.gov.tw/api/v1/rest/datastore/3c143deb-9885-4e98-9027-04df1ba6a641?format=json';

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


// 處理 JSON 內容
function parseJSON2Table(jsonObj) {
  var rows = [];
  var data = jsonObj.result.records;
  for (var i = 0; i < data.length; i++) {
    site = data[i]['場所名稱']
    addr = data[i]['場所地點']
    item = data[i]['檢查結果']
    date = data[i]['檢查日期']
    // [檢查結果,場所名稱,檢查日期,場所地點"]  
    if (site != '') {
      var row = [item, date, site, addr]
      rows.push(row);
    // console.log(row);
    }
  }
  return rows;
}
