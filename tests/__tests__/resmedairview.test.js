/**
 * @jest-environment jsdom
 */

import * as script from "/script.js";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
  await import("/modules/HST/ResmedAirview.js");
});

// resmed airview test
test("resmed airview find_replace", () => {
  let path = "HST/ResmedAirview";
  let {template, expected} = get_paths(path);

  script.data[script.key].template_set = {};

  build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
    start: "22:00", // 10:00 PM
    end: "04:00", // 4:00 AM
    ahi: "25.0",
    ai: "5.0",
    s_ahi: "35.0",
    s_percent: "50",
    ox_base: "96",
    ox_avg: "95",
    ox_min: "82",
    odi: "12.5",
    pulse_min: "45",
    pulse_avg: "64",
    pulse_max: "70",
    snores: "243",
    guidelines: "3",
    s_duration_hr: "3",
    s_duration_min: "1",
    od_duration_hr: "0",
    od_duration_min: "4",
    od_percent: "1",
    // calculated
    scored_at: "", // 3
    duration: "", // 6 hours 0 minutes
    hi: "", // 20.0
  });

  // checkboxes
  global.duration1 = global.duration2 = global.duration1_label = global.duration2_label = {};
  global.duration1.checked = false;
  global.duration2.checked = true;

  // call update function to do calculations
  script.data[script.key].update.start();      // update duration
  script.data[script.key].update.ahi();        // update hi
  script.data[script.key].update.guidelines(); // update scored at

  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});