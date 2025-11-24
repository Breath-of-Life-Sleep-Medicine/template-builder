/**
 * @jest-environment jsdom
 */

import { data, key, key_global } from "../../../modules/data";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data, update_calculated} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/AliceOne.js");
});

// aliceone test
test("aliceone find_replace", () => {
  let path = "HST/AliceOne";
  let {template, expected} = get_paths(path);

  build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);

  build_form({
    start: "22:00", // 10:00 PM
    trt: {m:360.0},
    ahi: "25.0",
    hi: "20.0",
    ox_avg: "96",
    ox_min: "80",
    odi: "2.4",
    od_duration: {m:5.4},
    pulse_min: "55",
    pulse_avg: "76.5",
    pulse_max: "110",
    snores: "243",
    // calculated
    end: "00:00", // 4:00 AM
    ai: "", // 5.0
  });

  update_calculated({changed: "start", calculated: ["end"]}); // update end
  update_calculated({changed: "ahi", calculated: ["ai"]});    // update ai

  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});