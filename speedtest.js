'use strict';

const { performance, PerformanceObserver } = require('perf_hooks');

const STRING_COUNT =  100000;
const TEST_COUNT =    10000;

const ALPHA_START = 32;
const ALPHA_END = 126;

const MIN_LENGTH = 5;
const MAX_LENGTH = 100;

function randomInt(min, max) {
  return Math.floor(Math.random()*(max-min))+min;
}

function randomString() {
  let str = '';
  const size = randomInt(MIN_LENGTH, MAX_LENGTH);
  for (let j=0;j<size;j++) {
    str += String.fromCharCode(randomInt(ALPHA_START, ALPHA_END));
  }
  return str;
}

console.log('Generating test cases');
const strings = new Array(STRING_COUNT);
const tests = new Array(TEST_COUNT);

for (let i=0;i<STRING_COUNT;i++) {
  strings[i] = randomString();
}

for (let i=0;i<TEST_COUNT;i++) {
  if (randomInt(0,1)) {
    tests[i] = strings[randomInt(0,STRING_COUNT-1)];
  } else {
    tests[i] = randomString();
  }
}

const obs = new PerformanceObserver((list, observer) => {
  for (let entry of list.getEntriesByType('measure')) {
    console.log(entry.name, entry.duration);
  } 
});
obs.observe({ entryTypes: ['measure'], buffered: true });


function listTest(strings, tests) {
  let count = 0;
  let data = strings.slice(0);

  console.log('Starting list test');
  performance.mark('list');

  for (let i=0;i<TEST_COUNT;i++) {
    if (data.includes(tests[i])) count++;
  }

  performance.measure('list', 'list');
}

function setTest(strings, tests) {
  let count = 0;

  const stringSet = new Set();
  for (let i=0;i<STRING_COUNT;i++) {
    stringSet.add(strings[i]);
  }

  console.log('Starting set test');
  performance.mark('set');

  for (let i=0;i<TEST_COUNT;i++) {
    if (stringSet.has(tests[i])) count++;
  }

  performance.measure('set', 'set');
}

function mapTest(strings, tests) {
  let count = 0;

  const stringMap = new Map();
  for (let i=0;i<STRING_COUNT;i++) {
    stringMap.set(strings[i],true);
  }

  console.log('Starting map test');
  performance.mark('map', 'map');

  for (let i=0;i<TEST_COUNT;i++) {
    if (stringMap.has(tests[i])) count++;
  }

  performance.measure('map');
}

function objectTest(strings, tests) {
  let count = 0;

  const stringObject = {};
  for (let i=0;i<STRING_COUNT;i++) {
    stringObject[strings[i]] = true;
  }

  console.log('Starting object test');
  performance.mark('object');

  for (let i=0;i<TEST_COUNT;i++) {
    if (tests[i] in stringObject) count++;
  }

  performance.measure('object', 'object');
}


const TESTS = [objectTest,mapTest,setTest,listTest];
for (let test of TESTS) {
  test.call(null, strings, tests);
}
