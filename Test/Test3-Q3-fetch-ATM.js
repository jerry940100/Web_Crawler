// 桃園市「路外停車資訊」
// https://data.tycg.gov.tw/opendata/datalist/datasetMeta?oid=f4cc0b12-86ac-40f9-8745-885bddc18f79

//載入需要的模組，並設定取用名稱
var fetch = require("node-fetch");

// 設定目標網址
var url =
  "https://www.post.gov.tw/post/internet/Templates/getOpenDataFile.jsp?vkey=85422E4D-6133-4404-851E-08EC2077A162";

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

// 設定篩選條件
const city = "桃園市";
const areaTarget = "中壢區";
const columns = ["編號", "縣市", "鄉鎮市區", "郵局地址", "局名", "局外ATM?"];
index=0;
//Get the start time
let startTime = Date.now();

// Perform a http(s) fetch
fetch(url)
  .then(response => response.text())
  .then(data => {
    // console.log(data);
    // Get the end time
    endTime = Date.now();
    console.debug('Elapsed time:', ((endTime - startTime)/1000).toFixed(3));
    rows = parseCsv2Table(data);
    // var curTime = new Date().toString().slice(0,24);
    // datarows 轉換成 table html
    var title = city + areaTarget + "郵局外ATM位置 ";
    html = array2dToHtmlTable(rows.slice(0,5), title, columns);
    // 開啟網頁
    browserOpen(html);
  })
  .catch(error => {
    console.log(error);
  });

// 解析CSV內容
function parseCsv2Table(csvText) {
  var rows = [];
  var lines = csvText.split("\n");
  lines.shift(); // 移除欄位列
  while (lines[0] && lines[0].length > 0) {
    var line = lines.shift(); // get first data line
    var splits = line.split(","); // 以, 切割字串為陣列
    // console.log(splits);
    // [wgsY,wgsX,areaId,address,parkName,areaName,_id,totalSpace,payGuide,parkId,introduction,surplusSpace]
    var areaName = splits[1];
    var ATM_out = splits[14];
    if (areaName == areaTarget && ATM_out=="局外") {
      // var coord = splits[0] + "," + splits[1];
      index++;
      // var ci = splits[4];
      // var address = splits[3];
      var location = splits[5];
      var name =  splits[3];
      // 需要的欄位：[停車場','地址', '總車位', '空車位', '座標', '計費方式'];
      var row = [parseInt(index), city, areaName, location, name, ATM_out];
      rows.push(row);
      // if (parkName== "南園停車場") {
      //   console.log(row);
      // }
    }
  }
  // 按剩餘數量 遞減排序
  // rows.sort(function (a, b) {
  //   return b[3] - a[3];
  // });
  return rows;
}

// 轉換 2d 陣列數據成 table
function array2dToHtmlTable(dataRows, title, cols) {
  var htmlStr = '<!DOCTYPE html>\n<html>\n';
  var styleStr = '<style>\n' +
  'html {width:96%; margin: 1% auto;}' + '\n' +
  '.sexyborder {border:1px solid #0066cc; padding:3px; border-radius: 3px; }' + '\n' +
  'table { border-collapse: collapse; width: 100%;}' + '\n' +
  'td,th { border: 1px solid #cccccc; padding: 6px; }' + '\n' +
  'tr:nth-child(odd) { background-color: #e5e5e5; }' + '\n' +
  'tr:nth-child(even) { background-color: #f9f9f9; }' + '\n' +
  'th { background-color: black; color: white; }'+ '\n' +
  '</style>' + '\n';
  var metaStr = '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  var titleStr =  '<title>' + title + '</title>' + '\n';  
  
  // <head>
  htmlStr += '<head>\n' + metaStr + titleStr + styleStr + '</head>\n'
  
  /* htmlStr = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      html {width:96%; margin: 1% auto;}
      .sexyborder {border:1px solid #0066cc; padding:3px; border-radius: 3px; }
      table { border-collapse: collapse; width: 100%;}
      td,th { border: 1px solid #cccccc; padding: 6px; }
      tr:nth-child(odd) { background-color: #e5e5e5; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      th { background-color: black; color: white; }
    </style>
  </head>\n` */
  
  
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

// 以瀏覽器開啟 html
function browserOpen(htmlString) {
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
}
