var fetch = require("node-fetch");
const url = 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json'

const city = '台北市';
const targetArea = "信義區";
var columns = ["區域", "場站名稱", "地址", "可借車數", "座標", "距離(m)"];
const targetLoc= [25.033611, 121.564444] // 101
const targetName = '台北101'

fetch(url)
  .then(async response => {
    try {
      const data = await response.json()
      // console.log('response data:', JSON.stringify(data, null, 2))
      var rows = parseTYUbikes(data)
      var title = city +targetArea +targetName + '附近 YouBike2.0 概況';
      var html = array2dToHtmlTable(rows.slice(0,5), title, columns);
      //console.log(html);
      browserOpen(html);
    } catch(error) {
      console.log('Error happened!')
      console.error(error)
    }
  })


function parseTYUbikes(jsonData) {
  var rows = [];
  //let sites = jsonData.result.records; //retVal;
  let sites = jsonData
  for (k in sites) {
    // for each key in sites
    // console.log(k)
    var siteData = sites[k];
    var area = siteData.sarea;  // 區域
    var lat = siteData.lat;     // 緯度
    var lng = siteData.lng;     // 經度
    var dis = calcGeoDistance(targetLoc[0], targetLoc[1], lat, lng)
    if (area == targetArea && dis <= 0.5) {
      var name = siteData.sna;  // 場站名稱
      var bikes = parseInt(siteData.sbi); // 字串轉換成整數， 車輛數
      var addr = siteData.ar; // 地址
      var row = [area, name, addr, bikes, lat+", "+ lng, dis*1000];
      console.log(k, name)
      rows.push(row);
    }
  }
  
  // sort by bikes
  // rows.sort( (a, b) => (b[3] > a[3]) ? 1 : ((b[3] === a[3]) ? ((b[6] > a[6]) ? 1 : -1) : -1) )
  // rows.sort( (a, b) => (b[3] > a[3]) ? 1 : -1 );     // new sort
  rows.sort(function(a, b) {
    return a[5] - b[5];
  }); // old sort

  return rows;
}

function array2dToHtmlTable(dataRows, titleStr, cols) {
  var headStr = '<!doctype html>\n<html>\n<head>\n';
  var styleStr = '<style>' +
  'html { margin: 1px auto; width: 80%;}' +
  'h3 { text-align: center; }' +
  'table { border-collapse: collapse; width: 100%;}' +
  'td,th { border: 1px solid #cccccc; padding: 12px; }' +
  'tr:nth-child(odd) { background-color: #e5e5e5; }' +
  'tr:nth-child(even) { background-color: #f9f9f9; }' +
  'td:nth-child(n+4) { padding-right: 1em; text-align: right; }' +
  'th { background: black; color: white; text-align: center; }'+ '\n' +
  '</style>' + '\n';
  
  var metaStr = '<meta charset="utf-8">\n'
  metaStr += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  metaStr += '<title>' + titleStr + '</title>' + '\n';
  var htmlStr = headStr + metaStr  + styleStr + '</head>\n<body>\n'
  var d = new Date()
  var dStr = d.toString()
  var dSub = dStr.substring(0, dStr.indexOf("GMT"))

  var header = '<h3>' + titleStr + ' @ ' + dSub + '</h3>'
  htmlStr += header
  
  // Table標題列
  var theads = '<tr><th>' + cols.join('</th><th>') + '</th></tr>\n'
  htmlStr += '\n<table>\n<thead>\n' + theads + '<thead>\n<tbody>\n'
  // Table 數據列
  dataRows.forEach(function (row) {
    var trStr = '' + '<tr><td>' + row.join('</td><td>') + '</td></tr>'
    htmlStr += trStr + '\n'
  })

  htmlStr += '</tbody>\n</table>\n</body>\n</html>';
  return htmlStr;
  //console.log(tableHtml)
}

function browserOpen(htmlString) {
    // 啟動 local http server
    var http = require("http");  
    var server = http.createServer(function(request, response) {  
        response.writeHead(200, {  
            'Content-Type': 'text/html'  
        });  
        response.write(htmlString);     
        response.end();  
    });  
    server.listen(8082);  //設定 在 8082 port
    // var open = require("open")
    // open("http://localhost:8082")
    // 以 browser 開啟 server 首頁
    var launcher = require('launch-browser');
    // open browser at an URL
    // use preferred browsers (in priority order): chrome, firefox, safari
    // if no proferred browsers found, open any available browser

    launcher('http://localhost:8082', { browser: ['chrome', 'firefox', 'safari'] }, 
        function(e, browser){
            if(e) return console.log(e);
            // 關閉 browser 時, 顯示關閉訊息，並同時關閉 server
            browser.on('stop', function(code){
                console.log( 'Browser closed with exit code:', code );
                server.close(); // Close the server
            });
    
        }
    )
}

// The Haversine Formula
// calcGeoDistance(緯度1, 經度1, 緯度2, 經度2)
function calcGeoDistance (lat1, lon1, lat2, lon2) {
  var R = 6371 // km (or 3956 mi)
  var dLat = (lat2 - lat1) * Math.PI / 180
  var dLon = (lon2 - lon1) * Math.PI / 180
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon / 2) * Math.sin(dLon / 2)
  // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var c = 2 * Math.asin(Math.sqrt(a))
  var d = R * c
  // if (d > 1) return Math.round(d) + "km";
  // else if (d <= 1) return Math.round(d * 1000) + "m"
  return Math.round(d * 1000) / 1000
} 


