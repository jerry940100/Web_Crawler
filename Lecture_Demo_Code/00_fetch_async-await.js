// 載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");

// 設定目標網址
const url = "https://www.yzu.edu.tw";

// 同步函式 (Synchronous function)
function getPage() {
  var response = fetch(url);
  var body = response.text(); // get html
  var root = HTMLParser.parse(body);
  var node = root.querySelector('title');
  console.log(body.substring(0, 100))
  console.log("getPage() =>")
  console.log(node.rawText);
}

// 非同步函式 (Asynchronous function)
async function getPage2() {
  var response = await fetch(url);
  var body = await response.text();
  var root = HTMLParser.parse(body);
  var node = root.querySelector('title');
  process.stdout.write("\ngetPage2() => ")
  console.log(node.rawText, "\n")
}

// getPage();
getPage2();

// 抓取 url 網頁 promise chain 
/* fetch(url)
    .then(respose => response.text())       //有response, 呼叫.text()取它的html
    .then(body => HTMLParser.parse(body))   //把回傳的html當成body, 剖析body
    .then(root => {                         //剖析結果的root
      node = root.querySelector('title')    //查詢title節點
      process.stdout.write("fetch(url) => ")
      console.log(node.rawText)             //輸出節點的文字內容
    }); */
