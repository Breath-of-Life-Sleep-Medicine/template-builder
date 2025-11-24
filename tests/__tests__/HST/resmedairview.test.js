/**
 * @jest-environment jsdom
 */

import { data, key, key_global} from "../../../modules/data";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data, update_calculated} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/ResmedAirview.js");
});

// resmed airview test
test("resmed airview find_replace", () => {
  let path = "HST/ResmedAirview";
  let {template, expected} = get_paths(path);

  build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);

  build_form({
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
    s_duration: {h: 3, m: 1},
    od_duration: {h: 0, m: 4},
    od_percent: "1",
    duration1: false,
    duration2: true,
    // calculated
    duration: "", // 6 hours 0 minutes
    hi: "", // 20.0
    scored_at: "", // 3
    // misc
    duration1_label: "",
    duration2_label: "",
    label_scored_at: "",
  });

  // call update function to do calculations
  data[key].update.start();                                             // update duration
  update_calculated({changed: "ahi", calculated:["hi"]});               // update hi
  update_calculated({changed: "guidelines", calculated:["scored_at"]}); // update scored_at

  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});