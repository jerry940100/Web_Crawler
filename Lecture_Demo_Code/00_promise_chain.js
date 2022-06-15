// Promise chain
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 500); // (*)

}).then(function(result) { // (**)
  // console.log(result); // 1
  return result * 2;

}).then(function(result) { // (***)
  //console.log(result); // 2
  return result * 2;

}).then(function(result) {
  //console.log(result); // 4
  return result * 2;

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