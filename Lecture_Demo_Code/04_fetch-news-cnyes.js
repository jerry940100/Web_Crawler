// 載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");
const fs = require("fs");

// 設定目標網址
const url = "https://news.cnyes.com/news/cat/headline?exp=a";


// 抓取 url 網頁
/* fetch(url)
  .then(res => res.text())
  .then(body => (root = HTMLParser.parse(body)))
  .then(() => extractNewsItems(root)); */

async function main() {
  var res = await fetch(url);
  var body = await res.text();
  var root = HTMLParser.parse(body)
  await extractNewsItems(root);
}

main();


// 解析網頁，取得每則新聞標題與URLURL
async function extractNewsItems(root) {
  var elem, cate,temp, time, title, aurl;
  var baseurl = "https://news.cnyes.com";
  var objs = [];
  var nodes = root.querySelectorAll('div.theme-list a')
  // console.log(nodes.length)
  for (var i = 0; i < nodes.length; i++) {
    elem = nodes[i]
    cate = elem.querySelector('div.theme-sub-cat').rawText;
    temp = elem.querySelector('time').getAttribute('datetime');
    time = temp.replace("T", ' ').substring(0,19);
    title = elem.getAttribute('title');
    aurl = decodeURI(elem.getAttribute('href'))       // 取得元素href值
    if (! aurl.startsWith("http")) {
      aurl = baseurl + aurl;
    }
    // 篩選需要的網址, 以JSON物件儲存
    if (aurl && aurl.includes("news") ) {
      found = objs.find(obj => obj['網址'] == aurl)
      if (! found) {
        objs.push({"分類": cate, "時間": time, "標題": title, "網址": aurl });
      } 
    } 
  }
  
  //console.log( JSON.stringify(objs) );
  console.log(objs);
  // 儲存json
  fs.writeFile("cnyes-news.json", JSON.stringify(objs), function(err) {
    if (err) throw err;
    console.log("successfully saved file");
  });
}
