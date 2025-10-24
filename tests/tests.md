# Tests

to run tests

```
npm test
```

- jest config file: `jest.config.js`
- jest setup file: `jest.setup.js`
  - list jest setup file in jest config
- tests: `__tests__/*`

## How tests are set up

- [Jest](https://jestjs.io/)
  - `npm install --save-dev jest`
  - [tests using jest for ES modules (experimental)](https://jestjs.io/docs/ecmascript-modules)
    - disable code transforms in jest config: `transform: {}`
    - [stack overflow: setup jest for ES modules](https://stackoverflow.com/a/69059786)
  - [jsdom for simulating the browser environment](https://jestjs.io/docs/tutorial-jquery)
    - `npm install --save-dev jest-environment-jsdom`
    - `@jest-environment jsdom` in test file header comment
  - getting jest to not flip out over jquery $
    - jquery as a node module
      - `npm install --save-dev jquery`
      - in jest setup file:
        ```js
        import $ from 'jquery';
        global.$ = global.jQuery = $;
        ```

<!--
replacing jquery
https://youmightnotneedjquery.com/
-->