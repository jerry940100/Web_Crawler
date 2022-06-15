// Promise chain
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 500); // return 1

}).then(function(result1) { // (**)
  // console.log(result1); // 1
  return result1 * 2;

}).then(function(result2) { // (***)
  //console.log(result2); // 2
  return result2 * 2;

}).then(function(result3) {
  //console.log(result3); // 4
  return result3 * 2;

});

promise.then(function(final) {
  console.log("promise-chain:", final);
});


// Async-await
async function promise_chain() {
  var result = await new Promise(function(resolve, reject) {
    setTimeout(resolve(1), 5000)
  })
  result *= 2
  result *= 2
  result *= 2
  return result
}

async function main() {
  var final = await promise_chain();
  console.log("async-await:", final);
}

main();

// using async-await is faster