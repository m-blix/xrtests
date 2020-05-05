'use strict';

const VERSION = 0.1;
console.log('XR Tests ' + VERSION);

let $ = document.querySelector.bind(document);

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
  let testOutput = $('#test-output');
  testOutput.innerHTML = '';

  var passed = 0;
  for (let i = 0; i < tests.length; i++) {
    let test = tests[i];
    let testF = test.f;
    let desc = test.desc;


    var result;
    var errorMsg = false;
    try {
      console.log('Running test: ' + desc);
      result = await testF();
    } catch (error) {
      console.log(error);
      result = 'error';
    }

    let output;
    if (result === 'error') {
      output = '<span class="info">[Requires User Activation]</span>';
      console.log('  requires user activation');
    } else if (result === test.expect) {
      output = '<span class="pass">PASS</span>';
      console.log('  PASS');
      passed++;
    } else {
      output = '<span class="fail">FAIL</span>';
      console.log('  FAIL');
      // TODO: add in expect message
    }

    let el = document.createElement('div');
    el.innerHTML = `${output} : ${desc}`;

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

  $('#run-btn').addEventListener('click', function(){
    let _tests = TESTS;
    runTests(_tests);
  });

  //runTests(_tests);
}

load();
