// 載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");
const https = require('https');

// 避開TLS 驗證
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// 設定目標網址
url = "https://www.cpbl.com.tw/stats/yearaward";

main();

async function main() {
  var res = await fetch(url);
  var body = await res.text();
  var root = HTMLParser.parse(body)
  await extractCPBLData(root);
};
// 解析網頁，取得重大新聞標題與網址
async function extractCPBLData(root) {
  let elem, title, link ;
  var news = '';
  
  page_title = root.querySelector('head  title').rawText;
  console.log('Crawling data from %s ...\n', page_title);
  
  // Get .RecordTable and all table trs
  let recordTable = root.querySelector("div.RecordTable");
 
  // Get interested headers at 1st tr
  headers = []
  headTr = recordTable.querySelector("table tr")

  // Get all headers
  ths = headTr.querySelectorAll("th")
  ths.forEach(function(cell) {
    headers.push(cell.rawText)
  });
  // console.log(headers)
  //header[0] = '年份'
  //header[-2] = '全壘打王'
  //header[-1] = '人名'
  myHeader = `${headers[0]}\tTeam\t\t${headers.at(-2)}\t${headers.at(-1)}`
  console.log(myHeader)
  
  // Get data at 1-10 trs
  trs = recordTable.querySelectorAll("table tr").slice(1,11)
  
  trs.forEach(function(tr) {
    let data = []
    let tds = tr.querySelectorAll("td")
    data.push(tds[0].rawText.trim())             // get year
    let homerun_tds = tds.slice(tds.length-2,)   // get team, "全壘打王", "全壘打"
    homerun_tds.forEach(function(td) {
      if (td.querySelector('span')) {            // 如果有 span, 抓全部
        let spans = td.querySelectorAll('span')
        for (let i =0; i < spans.length; i++) {
          data.push(spans[i].rawText.trim())
        }
      }
      else { // 沒有 span, 單純數字
        data.push(td.rawText.trim())
      }
    });
    // 根據隊名長度，調整 \t 個數，以排列整齊
    Teams = ['樂天桃猿', '統一7-ELEVEn獅', '中信兄弟']
    if (Teams.some(w => data.at(-3).includes(w))) {
      console.log(`${data[0]}\t${data.at(-3)}\t ${data.at(-2)}\t\t ${data.at(-1)}`)
    } else {
      console.log(`${data[0]}\t${data.at(-3)}\t\t ${data.at(-2)}\t\t ${data.at(-1)}`)
    }
  });
}

    