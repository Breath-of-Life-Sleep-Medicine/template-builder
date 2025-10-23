// to run tests
// npm test

// need to set up tests with jest for ES modules (experimental)

// setup
// https://stackoverflow.com/a/69059786

// replacing jquery
// https://youmightnotneedjquery.com/

// jsdom for simulating the browser

import $ from 'jquery';
global.$ = global.jQuery = $;

global.formID = {};
global.template = {};

// no-op functions
const nop = (...args) => {};
global.formID.addEventListener = nop;
global.template.addEventListener = nop;