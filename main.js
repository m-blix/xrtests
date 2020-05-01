'use strict';

const VERSION = 0.1;
console.log('XR Tests ' + VERSION);

let $ = document.querySelector.bind(document);
let testOutput = $('#test-output');


let _tests = TESTS;

const SI = 'SamsungBrowser/';
let ua = navigator.userAgent;
let uaEl = $('#ua');
uaEl.innerHTML = ua;
if (ua.includes(SI)) {
  let version = ua.substr(ua.indexOf(SI)+SI.length, 4);
  let major, minor;
  [major, minor] = version.split('.');
  console.log(version);
  if (major >= 12) {
    $('#browser-msg').style.display = 'none';
  }
}

async function runTests(tests) {
  testOutput.innerHTML = '';

  var passed = 0;
  for (let i = 0; i < tests.length; i++) {
    let test = tests[i];
    let testF = test.f;
    let desc = test.desc;

    let _result = testF();

    let result;
    if (_result === test.expect) {
      result = '<span class="pass">PASS</span>';
      passed++;
    } else {
      result = '<span class="fail">FAIL</span>';
      // TODO: add in expect message
    }

    let el = document.createElement('div');
    el.innerHTML = `${result} : ${desc}`;

    testOutput.appendChild(el);
  }

  let el = document.createElement('div');
  el.classList.add('final');
  let allPass = passed === tests.length ? '<span class="pass">PASS</span>' : '<span class="fail">FAIL</span>';
  el.innerHTML = `${allPass}: ${passed} of ${tests.length} passed`;
  testOutput.appendChild(el);
}

const HIT_TEST_ENABLED = true;
function showValidTestPages() {
  if (!HIT_TEST_ENABLED) {
    var pages = $('#pages').querySelectorAll('.hit-test');
    pages.forEach(function(page){
      page.style.display = 'none';
    });
  }
}

function load() {
  showValidTestPages();
  runTests(_tests);
}

load();
