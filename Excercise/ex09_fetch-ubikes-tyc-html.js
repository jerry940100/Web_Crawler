const fetch = require("node-fetch");

const url =
  "https://data.tycg.gov.tw/api/v1/rest/datastore/a1b4714b-3b75-4ff8-a8f2-cc377e4eaa0f?"

var params = new URLSearchParams({
  format: 'json',
  limit: 400,
})
console.log(params.toString())
  
const city = "桃園市";
const targetLoc = "中壢區";
// var columns = ["區域", "場站名稱", "地址", "可借車數", "座標", "更新時間"];
var columns = ["場站名稱", "地址", "可借車數", "座標", "更新時間"];

fetch(url + params)
  .then(res => res.json())
  .then(json => {
    rows = parseTYUbikes(json)
    var curTime = new Date().toString().slice(0,24);
    var title = city + targetLoc + ' YouBike 概況 @ ' + curTime;
    var html = array2dToHtmlTable(rows, title, columns);
    // console.log(html);
    browserOpen(html);
  });

/* fetch(url)
  .then(function(response) {
    console.log(response.headers.get("Content-Type"));
    var d = new Date(response.headers.get("Date"));
    console.log(d.toLocaleString());
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.url);
    return response.json();
  })
  .then(data => parseTYUbikes(data)); */


function parseTYUbikes(jsonData) {
  var rows = [];
  var sites = jsonData.result.records;
  for (var i = 0; i < sites.length; i++) {
    // for each key in sites
    // console.log(k)
    var siteData = sites[i];
    var sitearea = siteData.sarea; // 區域
    if (sitearea == targetLoc) {
      var sitename = siteData.sna; // 場站名稱
      var bikes = parseInt(siteData.sbi); // 字串轉換成整數， 車輛數
      var lat = siteData.lat; // 緯度
      var lng = siteData.lng; // 經度
      var mday = siteData.mday; // 更新時間
      //mday = mday.substring(0,4)+'-'+mday.substring(4,6)+'-'+mday.substring(6,8)+' '+mday.substring(8,10)
      //      +':'+mday.substring(10,12)+':'+mday.substring(12,14)
      var addr = siteData.ar; // 地址
      var row = [sitename, addr, bikes, lat+", "+ lng, mday];
      rows.push(row);
    }
    rows.sort(function (a, b) {
      return b[2] - a[2];
    });
  }
  
  // sort by bikes then by mday
  // rows.sort( (a, b) => (b[3] > a[3]) ? 1 : ((b[3] === a[3]) ? ((b[6] > a[6]) ? 1 : -1) : -1) )
  // rows.sort( (a, b) => (b[3] > a[3]) ? 1 : -1 );     // new sort
  rows.sort(function(a, b) {
    return b[3] - a[3];
  }); // old sort

  return rows;
}

// Convert 2d array to html table
function array2dToHtmlTable(dataRows, title, cols) {
  var htmlStr = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      html {width:96%; margin: 1% auto;}
      .sexyborder {border:1px solid #0066cc; padding:5px; border-radius: 5px; }
      table { border-collapse: collapse; width: 100%;}
      td,th { border: 1px solid #cccccc; padding: 6px; }
      tr:nth-child(odd) { background-color: #e5e5e5; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      th { background-color: black; color: white; }
    </style>
  </head>\n`
  
  // <body>
  htmlStr += '<body>\n'
  var contentHead = '<h3 style="text-align: center;">' + title + '</h3>'
  htmlStr += contentHead
  
  // <div><table>
  htmlStr += '\n<div class="sexyborder">\n<table>\n'
  // 標題列
  var ths = '<tr><th style="text-align: center;">' + cols.join('</th><th>') + '</th></tr>\n'
  htmlStr += '<tbody>\n' + ths
  // 數據列
  dataRows.forEach(function (row) {
    var tr = '' + '<tr><td>' + row.join('</td><td>') + '</td></tr>'
    htmlStr += tr + '\n'
  })
  // </table></div>
  htmlStr += '</tbody>\n'
  htmlStr += '</table>\n</div>\n'

  // </body>
  htmlStr += '</body>\n</html>';
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
    
    // 以 browser 開啟 server 首頁
    var launcher = require('launch-browser');

    launcher('http://localhost:8082', 
        { browser: ['chrome', 'firefox', 'safari'] }, 
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
