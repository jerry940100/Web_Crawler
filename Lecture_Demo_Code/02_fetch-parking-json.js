// 桃園市「路外停車資訊」
// https://data.tycg.gov.tw/opendata/datalist/datasetMeta?oid=f4cc0b12-86ac-40f9-8745-885bddc18f79

//載入需要的模組，並設定取用名稱
const fetch = require('node-fetch');

// 設定目標網址
const url = 'https://data.tycg.gov.tw/api/v1/rest/datastore/0daad6e6-0632-44f5-bd25-5e1de1e9146f?format=json';

/* fetch(url)
  .then(response => {
    // console.log(response)
    console.log(response.headers.get('Content-Type'));
    let ptime = response.headers.get('Date');
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.url);
    return response.json();
  })
  .then(json => parseJSON2Table(json));  */
  

let startTime, endTime;

// Get the start time
startTime = Date.now();
  
// Perform a http(s) fetch
fetch(url)
  .then(response => response.json())
  .then(json => {
    //console.log(JSON.stringify(json));
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

const areaTarget = '中壢區'

// 解析 JSON內容
function parseJSON2Table(jsonObj) {
  let rows = [];
  let data = jsonObj.result.records;
  for (let i = 0; i < data.length; i++) {
    let areaName = data[i]['areaName']
    if (areaName == areaTarget) {
      site  = data[i]['parkName']
      addr  = data[i]['address']
      total = data[i]['totalSpace']
      left  = data[i]['surplusSpace']
      pay   = data[i]["payGuide"].split('。')[0]
      lat   = data[i]["wgsX"]
      lng   = data[i]["wgsY"]
    // ["areaName", "parkName", "totalSpace", "surplusSpace","payGuide", "address]
      let row = [site, addr, total, parseInt(left), lng+","+lat, pay]
      rows.push(row);
    //console.log(row);
    } 
  }
  return rows;
}
