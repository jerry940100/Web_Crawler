//載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");

// 設定目標網址
const url =
  "https://data.tycg.gov.tw/api/v1/rest/datastore/0daad6e6-0632-44f5-bd25-5e1de1e9146f?format=json";

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

// 設定篩選條件
const areaTarget = "中壢區";
const columns = ["停車場", "地址", "總車位", "空車位", "座標", "計費方式"];

//Get the start time
let startTime = Date.now();

// Perform a http(s) fetch
fetch(url)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    // Get the end time
    endTime = Date.now();
    console.debug('Elapsed time:', ((endTime - startTime)/1000).toFixed(3));
    rows = parseJSON2Table(data);
    // rows 轉換成 table html
    var title = areaTarget + "停車場 車位剩餘數量";
    html = array2dToHtmlTable(rows, title, columns);
    // 開啟網頁
    browserOpen(html);
  })
  .catch(error => {
    console.log(error);
  });

// 解析 JSON內容
function parseJSON2Table(jsonObj) {
  var rows = [];
  var data = jsonObj.result.records;
  for (var i = 0; i < data.length; i++) {
    var areaName = data[i]["areaName"];
    if (areaName == areaTarget) {
      site  = data[i]["parkName"];
      addr  = data[i]["address"];
      total = data[i]["totalSpace"];
      left  = data[i]["surplusSpace"];
      pay   = data[i]["payGuide"].split("。")[0];
      lat   = data[i]["wgsX"];
      lng   = data[i]["wgsY"];
      // ["areaName", "parkName", "totalSpace", "surplusSpace","payGuide", "address]
      var row = [site, addr, total, parseInt(left), lng + "," + lat, pay];
      rows.push(row);
      // if (site == "南園停車場") {
      //   console.log(row);
      // }
    }
  }
  // 按剩餘數量 遞減排序
  rows.sort(function (a, b) {
    return b[3] - a[3];
  });
  
  return rows;
}

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
      td,th { border: 1px solid #cccccc; padding: 6px; text-align: center }
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

  htmlStr += '</tbody>\n'
  htmlStr += '</table>\n</div>\n'

  // </body>
  htmlStr += '</body>\n</html>';
  return htmlStr;
  //console.log(tableHtml)
}  

async function browserOpen(htmlString) {
  // 啟動 local http server
  var http = require("http");
  var server = http.createServer(function (request, response) {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.write(htmlString);
    response.end();
  });
  server.listen(8082); //設定 在 8082 port
 
  // 以 browser 開啟 server 首頁
  const launcher = require("launch-browser");
  launcher(
    "http://localhost:8082",
    {
      browser: ["chrome", "firefox", "safari"],
    },
    function (e, browser) {
      if (e) return console.log(e);
      // 關閉 browser 時, 顯示關閉訊息，並同時關閉 server
      browser.on("stop", function (code) {
        console.log("Browser closed with exit code:", code);
        server.close(); // Close the server
      });
    }
    ); 
  
  
  // const chromeLauncher = require('chrome-launcher');
  
  // chromeLauncher.launch({
  //   startingUrl: "http://localhost:8082",
  //   }).then(chrome => {
  //       msg1 = `Chrome debugging port running on ${chrome.port}...`
  //       msg2 = 'Press CTRL+C or close chrome to stop the calling app.'
  //       console.log('\n%s %s\n', msg1, msg2)
  //       // console.log(chrome.process)
  //       chrome.process.on('exit', function (code) {
  //         console.log( 'Browser closed with exit code:', code );
  //         server.close(); // Close the server
  //       });
  //   }); 
  
}