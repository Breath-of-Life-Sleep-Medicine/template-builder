/**
 * @jest-environment jsdom
 */

import { data, key } from "../../modules/data";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
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
    start: "22:00", // 10:00 PM
    trt: "360.0",
    ahi: "25.0",
    hi: "20.0",
    ox_avg: "96",
    ox_min: "80",
    odi: "2.4",
    od_duration: "5.4",
    pulse_min: "55",
    pulse_avg: "76.5",
    pulse_max: "110",
    snores: "243",
    // calculated
    end: "", // 4:00 AM
    ai: "", // 5.0
  });

  data[key].update.start(); // update end
  data[key].update.ahi();   // update ai

  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});