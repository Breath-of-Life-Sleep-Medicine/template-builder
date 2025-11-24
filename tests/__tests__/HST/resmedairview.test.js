/**
 * @jest-environment jsdom
 */

import { data, key, key_global} from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/ResmedAirview.js");
});

function update() {
  // call update function to do calculations
  data[key].update.start(); // update duration
  tst.update_calculated({changed: "ahi", calculated:["hi"]});
  tst.update_calculated({changed: "guidelines", calculated:["scored_at"]});
}

function setup_valid() {
  tst.build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);
  tst.build_form({
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
  update();
}

function setup_empty() {
  tst.build_form({
    date: "",
    referring: "",
    provider: "",
  }, key_global);
  tst.build_form({
    start: "",
    end: "",
    ahi: "",
    ai: "",
    s_ahi: "",
    s_percent: "",
    ox_base: "",
    ox_avg: "",
    ox_min: "",
    odi: "",
    pulse_min: "",
    pulse_avg: "",
    pulse_max: "",
    snores: "",
    guidelines: "",
    s_duration: {h: 0, m: 0},
    od_duration: {h: 0, m: 0},
    od_percent: "",
    duration1: true,
    duration2: false,
    // calculated
    duration: "",
    hi: "",
    scored_at: "",
    // misc
    duration1_label: "",
    duration2_label: "",
    label_scored_at: "",
  });
}

// resmed airview test
test("resmed airview find_replace", () => {
  let path = "HST/ResmedAirview";
  let {template, expected} = tst.get_paths(path);
  setup_valid();
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  setup_empty();
  let expected = {
    start: "12:00 AM",
    end: "12:00 AM",
    ahi: "0.0",
    ai: "0.0",
    s_ahi: "0.0",
    s_percent: "0.0",
    ox_base: "0",
    ox_avg: "0",
    ox_min: "0",
    odi: "0.0",
    pulse_min: "0",
    pulse_avg: "0",
    pulse_max: "0",
    snores: "0",
    s_duration: "0 minutes",
    od_duration: "0 minutes",
    od_percent: "0",
    // calculated
    duration: "0 minutes",
    hi: "0.0",
    scored_at: "4",
  };
  expect(get_map(key)).toEqual(expected);
});