// 桃園市「路外停車資訊」
// https://data.tycg.gov.tw/opendata/datalist/datasetMeta?oid=f4cc0b12-86ac-40f9-8745-885bddc18f79

//載入需要的模組，並設定取用名稱
var fetch = require('node-fetch');

// 設定目標網址
var url = 'https://data.tycg.gov.tw/api/v1/rest/datastore/0daad6e6-0632-44f5-bd25-5e1de1e9146f?format=csv';

/* fetch(url)
  .then(response => {
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
  
// Perform a http(s) fetch
fetch(url)
  .then(response => response.text())
  .then(data => {
    // console.log(data);
    // Get the end time
    endTime = Date.now();
    console.debug('Elapsed time:', ((endTime - startTime)/1000).toFixed(3));
    results = parseCsv2Table(data);
    results.forEach(function(result) {
      console.log(result)
    });;
  })
  .catch(error => {
    console.log(error);
  });


// 設定篩選條件
const areaTarget = '中壢區'

function parseCsv2Table(csvText) {
  var rows = [];
  var lines = csvText.split("\n");
  lines.shift();                    // 移除欄位列
  while( lines[0] && lines[0].length > 0) {
    var line = lines.shift();       // get first data line
    var splitArr = line.split(','); // 以, 切割字串為陣列
    // [wgsY,wgsX,areaId,address,parkName,areaName,_id,totalSpace,payGuide,parkId,introduction,surplusSpace] 
    var areaName = splitArr[5];
    if (areaName == areaTarget) {   // 比對條件
      var coord = splitArr[0] +", " + splitArr[1];
      var parkName = splitArr[4];
      var address  = splitArr[3];
      var totalsp  = parseInt(splitArr[7]);
      var surplus  = parseInt(splitArr[splitArr.length-1]);
      var payGuide = splitArr[8].split('。')[0].replace(/[&\/\\#,+()$~%.'"*?<>{}]/g, '');
      // 需要的欄位：['區域, '停車場','地址', '全部車位', '可用車位', '座標', '計費方式'];
      var row = [areaName, parkName, address, totalsp, surplus, coord, payGuide]
      rows.push(row);
      // console.log(row); 
    }
  }
  return rows;
}


