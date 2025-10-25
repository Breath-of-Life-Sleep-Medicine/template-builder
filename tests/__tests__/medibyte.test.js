/**
 * @jest-environment jsdom
 */

import * as script from "/script.js";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
  await import("/modules/HST/MediByte.js");
});

// medibyte test
test("medibyte find_replace", () => {
  let path = "HST/MediByte";
  let {template, expected} = get_paths(path);

  build_form({
    date: "2025-01-01",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
    scored_at: "3",
    duration: "480.0",
    ahi: "25.0",
    hi: "20.0",
    s_ahi: "35.0",
    s_percent: "60.0",
    ox_avg: "95.4",
    ox_min: "82.0",
    odi: "12.5",
    od_duration: "5.4",
    pulse_min: "45.0",
    pulse_avg: "64.3",
    pulse_max: "70.0",
    snores: "243",
    // calculated
    ai: "",
  });

  script.data[script.key].update.ahi(); // update ai

  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});