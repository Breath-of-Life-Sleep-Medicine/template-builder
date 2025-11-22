/**
 * @jest-environment jsdom
 */

import { time_24_to_12 } from "../../modules/util.js";

// simple unit test
test("17:31 > 5:31 PM", () => {
  expect(time_24_to_12("17:31")).toBe("5:31 PM");
});