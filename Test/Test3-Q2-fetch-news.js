// 載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");
// const fs = require("fs");
// const path = require("path");

// 設定目標網址
const url = "https://www.sankei.com/flash";

//#fusion-app > div.grid.grid__container.default-layout.grid__container-centered.desktop-max-width > div:nth-child(2) > main > div > div:nth-child(6) > div > article:nth-child(1) > div > h2 > a
// output file in the same folder
// const jsonfile = path.join(__dirname, "setn-news-0.json");

// 抓取 url 網頁
// fetch(url)
//   .then(res => res.text())
//   // .then(body => console.log(body))
//   .then(body => HTMLParser.parse(body))
//   .then(domRoot => extractData(domRoot))
//   .then(items => items.map(item =>
//     console.log(item.date + ' ' + item.tag + ': ' + item.title + ', ' + item.url)
//   ))

async function main() {
  var res = await fetch(url)
  var body = await res.text()
  var root = HTMLParser.parse(body)
  var items = extractData(root)
  items.map(function(item) {
    console.log(item.date + ' ' + item.tag + ': ' + item.title + '\n' + item.url+"\n")
  })
}

// 解析網頁，取得滾動頭條標題與網址 
function extractData(root) {
  var rootUrl = 'https://www.sankei.com';
  let lastHour = getHoursAgoString(1);
  let elem, title, anchor, url;
  var objs = []; //  div > article:nth-child(1) > div > h2 > a
  // var news = root.querySelectorAll('div.NewsList div.col-sm-12');
  var news = root.querySelectorAll('div.story-card-feed div.col-container article');
  // console.log(news.length);
  for (var i = 0; i < news.length; i++) {
    elem = news[i];
    // console.log(elem.innerHTML)
    anchor = elem.querySelector('div.order-1 h2 a');
    // console.log(anchor)
    if(anchor!=null){
      title = anchor.rawText.trim();        // 取得元素文字
      url = anchor.getAttribute('href');    // 取得元素href值
      // console.log(title + ', ' + url);
      let special_found = /star|travel/.test(url);
      let utmSeparator = (special_found) ? '?' :'&';
      let utm = url.indexOf(utmSeparator);
      if ( utm >= 0 ) {
        url = url.substring(0, utm);
      }
      if  (!url.startsWith('http') ) {
        url = rootUrl + url;
      }
      // console.log(url)
      time = elem.querySelector("div.under-headline time").rawText
      cate = elem.querySelector("div.under-headline a").rawText
      //console.log(title)
      //console.log(url, title, time, lastHour)
      
      // 篩選需要的網址, 以JSON物件儲存
      if (time > lastHour && url.includes("http") ) {
        objs.push({ "date": time, "tag": cate, "title": title, 
            "url": url });
      } 
    }
  }
  return objs

  // 儲存json
  // fs.writeFile(jsonfile, JSON.stringify(objs), function(err) {
  //   if (err) throw err;
  //   console.log("successfully saved file");
  // });
}

// 取得最近n小時前的時間字串: mm/dd hh:mm */
function getHoursAgoString(n) {
  var ts = Math.round(Date.now()); 
  var tsHoursAgo = ts - (n * 3600 * 1000);
  var nHoursAgo = new Date(tsHoursAgo);
  var timeString =
    //nHoursAgo.getFullYear() + "-" +
    ("0" + (nHoursAgo.getMonth()+1)).slice(-2) + "/" +
    ("0" + nHoursAgo.getDate()).slice(-2) + " " +
    ("0" + nHoursAgo.getHours()).slice(-2) + ":" +
    ("0" + nHoursAgo.getMinutes()).slice(-2)
  
  return timeString;
}

main();