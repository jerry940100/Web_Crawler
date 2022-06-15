// 載入需要的模組，並設定取用名稱
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");
const UserAgent = require('user-agents');
const fs = require("fs");
const path = require("path");
const os = require("os");

// 設定目標網址與搜尋參數
const url = "https://www.ibon.com.tw/retail_inquiry_ajax.aspx";

const paramObj = {"strTargetField": "ZIPCODE","strKeyWords": 320}
const postParams = new URLSearchParams(paramObj);
//const postParams = new URLSearchParams();
//postParams.append("strTargetField", "ZIPCODE");
//postParams.append("strKeyWords", 320);
console.log(postParams.toString());

var headers = {"User-Agent": new UserAgent().toString()};

// options= {key: value}
// keys: method, headers, body
const options = {
    method: "POST",
    headers: headers,
    body: postParams,
};

// output file in the same folder
const filename = path.parse(__filename)['name'] + '.csv'
const filepath = path.join(__dirname, filename);
const output = []; // holds all rows of data

// async function request() {
const request = async () => {
  const response = await fetch(url, options);
  const data = await response.text();
  var records = await parseHtml2(data);
  // console.log(records);
  return records;
};

// Start execution here
request()
  .then((records) => {
    //fs.writeFileSync(file, data)
    fs.writeFileSync(filepath, records.join(os.EOL)); //EOL: end-of-line marker e.g.,\r\n
    prependBOM(filepath);
  })
  .then(()=> console.log('The CSV file was written successfully.'))
  .catch((err) => console.log("Ooops, error", err.message));

// Return a 2d array containing arrays of strings seperated by comma
async function parseHtml2(html) {
  var arr2d = [];
  const root = HTMLParser.parse(html);
  var trs = root.querySelectorAll("tr");
  for (i = 0; i < trs.length; i++) {
    var obj = {};
    var tds = trs[i].querySelectorAll("td");
    //console.log(tds[0].rawText)
    var sid = tds[0].rawText;
    var store = tds[1].text;
    var addr  = tds[2].text;
    console.log(sid, store, addr);
    arr2d.push([sid, store, addr]);
  }
  return arr2d;
}

async function write2Csv(arr, file) {
  await new Promise(done => fs.writeFileSync(file, arr.join(os.EOL)));
  prependBOM(file);
};

// Prepend BOM to file for displaying correctly
function prependBOM(file) {        
  let fileContents = fs.readFileSync(file);
  let included = fileContents.indexOf('\ufeff', 0) !== -1;
  if (!included) {
    fs.writeFileSync(file, "\ufeff" + fileContents);
  }
}

