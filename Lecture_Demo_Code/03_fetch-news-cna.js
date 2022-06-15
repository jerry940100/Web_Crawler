const fetch = require('node-fetch')
const HTMLParser = require('node-html-parser')

const url = "https://www.cna.com.tw/";

fetch(url)    // may use string templating fetch(`${url}`)
  .then (res => res.text())
  .then (body => HTMLParser.parse(body))
  .then (domRoot => extractData(domRoot))

function extractData(root){
  let nodes = root.querySelectorAll('#myLatesNews li a');
  let elem, kind, time, title, aurl;
  let description = '';
  for (i = 0; i < nodes.length; i++){
      elem  = nodes[i]
      kind  = elem.querySelector(".kind").rawText.trim()//.trim() 清掉空白
      time  = elem.querySelector(".time").rawText.trim()
      title = elem.querySelector(".title").rawText.trim()
      aurl  = elem.getAttribute('href');
      //console.log(kind + time + " " + title)
      description += kind + " " + time + " " + title + "\n"
      description += aurl + '\n\n'
  }
  
  console.log(description)
}
