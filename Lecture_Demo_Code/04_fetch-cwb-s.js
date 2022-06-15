/* 中壢區 未來3天(72小時)逐3小時天氣預報 */

const fetch = require('node-fetch');
// url = https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-005?Authorization=rdec-key-123-45678-011121314
const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-005?' +
          'Authorization=rdec-key-123-45678-011121314';

let ptime = '';

fetch(url)
  .then(function (response) {
    console.log(response.headers.get('Content-Type'))
    let d = new Date(response.headers.get('Date'));
    let ptime = d.toLocaleString();
    console.log(ptime)
    // console.log(ptime.substring(0, ptime.indexOf('(')));
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.url);
    return response.json(); // old style return
  })
  .then(data => jsonHandler(data));
  // .catch(error => console.error(error))

var myRows = [];
const targetLoc = '中壢區';

function jsonHandler(json) {
  let data = json.records.locations[0].location;
  for (let i = 0; i < data.length; i++) {
    let loc = data[i].locationName;
    if (loc === targetLoc) {
      let wds = data[i].weatherElement[6].time;
      for (k in wds) {
        let stime = wds[k].startTime.substring(0, 16);
        // let etime = wds[k].endTime.substring(0, 16);
        let wd = wds[k].elementValue[0].value;
        let wdArr = wd.split('。');
        let ti = wdArr.length > 6 ? 2 : 1; // temp index
        let wdStr = wdArr.slice(0, ti).join(',') + ', ' + wdArr[ti].substring(4, 6) + '\xB0C';

        //console.log(wdStr)
        let row = [loc, wdStr, stime];
        console.log(row);
        myRows.push(row);
      }
    }
  }

}
