// 載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");

// 設定目標網址
const url = "https://www.yzu.edu.tw";


// 抓取 url 網頁
fetch(url)
  .then(res => res.text())
  .then(html => (domRoot = HTMLParser.parse(html)))
  .then((True) => extractData(domRoot));

// 解析網頁，取得重大新聞標題與網址
function extractData(root) {
  let elem, title, link ;
  var news = '';
  
  page_title = root.querySelector('head  title').rawText;
  console.log('Crawling %s 新聞...\n', page_title);
  // Retrieve at most 10 query result links.
  // Select all div.linkItem element inside div.slideCon.mod_news
  // then select all <a> tags inside div.linkItem
  var nodes = root.querySelectorAll('div.slideCon.mod_news div.linkItem a');
  numOpen = Math.min(10, nodes.length)

  let stopWords = ['詳細內容', '遠東商銀']
  for (var i = 0; i < nodes.length; i++) {
    elem = nodes[i];
    // console.log(elem);
    title = elem.rawText.trim();
    link = elem.getAttribute('href');
    
    // 顯示所有 Links
    /* if (! link.startsWith('http')) {
      link = 'https://www.yzu.edu.tw' + link;
    }
    console.log(title);
    console.log(link, '\n') */
    
    // 排除特定關鍵字 some vs. every
    // If not including some of the stop words
    if (! stopWords.some(w => title.includes(w))) {
      if (! link.startsWith('http')) {
        link = 'https://www.yzu.edu.tw' + link;
      }
      console.log(title);
      console.log(link, '\n')
    }
  };

}
