/**
 * @jest-environment jsdom
 */

import * as script from "/script.js";

// simple unit test
test("17:31 > 5:31 PM", () => {
  expect(script.time_24_to_12("17:31")).toBe("5:31 PM");
});