'use strict';

const VERSION = 0.1;
console.log('XR Tests ' + VERSION);

let objs = Object.getOwnPropertyNames(window).sort(function(a,b){return a.length - b.length;});
let xrObjs = objs.filter(function(a){ return a.startsWith('XR') });
console.log(xrObjs);

let $ = document.querySelector.bind(document);
let testOutput = $('#test-output');


for (let i = 0; i < tests.length; i++) {
  let test = tests[i];
  let testF = test.f;
  let desc = test.desc;

  let _result = testF();
  console.log(_result);

  let result;
  if (_result === test.expect) {
    result = '<span class="pass">PASS</span>';
  } else {
    result = '<span class="fail">FAIL</span>';
    // TODO: add in expect message
  }

  let el = document.createElement('div');
  el.innerHTML = `${desc}: ${result}`;

  testOutput.appendChild(el);
}
