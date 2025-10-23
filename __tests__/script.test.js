/**
 * @jest-environment jsdom
 */

// need to set up tests with jest for ES modules (experimental)


// setup
// https://stackoverflow.com/a/69059786

// replacing jquery
// https://youmightnotneedjquery.com/

// jsdom for simulating the browser


// "test": "jest"
// "jest": "./jest.config.js"

// import {test, expect} from '@jest/globals';
import * as script from "/script.js";

// const { JSDOM } = require("jsdom");
// const { window } = new JSDOM(`<!DOCTYPE html>`);
// const $ = require('jquery')(window);

// // In your test file or a setup file
// jest.mock('jquery', () => ({
//   ajax: jest.fn(() => Promise.resolve({ data: 'mocked data' })),
//   // Mock other jQuery functions as needed
// }));

const globalDatabase = makeGlobalDatabase();

beforeAll(() => {
  window.$ = require('path/to/jquery');
  
  return globalDatabase.clear().then(() => {
    return globalDatabase.insert({
      testData: 'foo'
    });
  });
});

// const script = require("/script");

// const script = require("./script");

// var formID, template; // ignore

// let spy;

// beforeAll(() => {
//   spy = jest.spyOn(document, 'getElementById');
// });

test("", () => {
  let formID = document.createElement()
  expect(script.time_24_to_12("17:31")).toBe("05:31 PM");
});