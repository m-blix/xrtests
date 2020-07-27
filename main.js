'use strict';

const VERSION = 0.1;
console.log('XR Tests ' + VERSION);

let $ = document.querySelector.bind(document);

let major, minor;

const SI = 'SamsungBrowser/';
let ua = navigator.userAgent;
let uaEl = $('#ua');
uaEl.innerHTML = ua;
let isSI = ua.includes(SI);
if (isSI) {
  let version = ua.substr(ua.indexOf(SI)+SI.length, 4);
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
  var testsCount = 0;
  for (let i = 0; i < tests.length; i++) {
    let test = tests[i];
    let testF = test.f;
    let desc = test.desc;

    if (test.skip) {
      continue;
    }
    let minVersion = ('minVersion' in test) ? test.minVersion : 12;
    if (isSI && major < minVersion) {
      console.log(`skipping test for: ${minVersion} (on ${major})`);
      continue;
    }

    testsCount++;


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
  let allPass = passed === testsCount ? '<span class="pass">PASS</span>' : '<span class="fail">FAIL</span>';
  el.innerHTML = `${allPass}: ${passed} of ${testsCount} passed`;
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
  registerServiceWorker();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function() {
      console.log('service worker registration complete');
    }, function() {
      console.log('service worker registration failed');
    });
  } else {
    console.log('service worker not supported');
  }
}

load();
