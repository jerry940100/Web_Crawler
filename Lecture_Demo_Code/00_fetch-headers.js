const fetch = require("node-fetch");
const url = "https://www.yzu.edu.tw/";

var UserAgentList = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/97.0.1072.69'
]
 
var Options = {
    method: 'GET', // default value
    headers: {'User-Agent': UserAgentList[Math.floor(Math.random() * UserAgentList.length)]}
}     
  
// promise chain
fetch(url, Options)
  .then(res => {
    console.log('First try ==>');
    console.log(res);
    console.log(res.ok);
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.headers.raw());
    console.log(res.headers.get("content-type"));
  });

// async function
// async function getData(url, options) {
const getData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const headJson = await response.headers.raw();
    var body = await response.text()
    //console.log(json["set-cookie"]);
    console.log('\nSecond try ==>');
    console.log(headJson["content-type"]);
    console.log(body.substring(0, 630))
  } catch (error) {
    console.log(error);
  }
};

getData(url, Options);
