/**
 * @jest-environment jsdom
 */

import * as script from "/script.js";

test("", () => {
  expect(script.time_24_to_12("17:31")).toBe("05:31 PM");
});