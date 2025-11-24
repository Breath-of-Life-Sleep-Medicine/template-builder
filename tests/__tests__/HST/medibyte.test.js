/**
 * @jest-environment jsdom
 */

import { data, key, key_global } from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/MediByte.js");
});

function update() {
  tst.update_calculated({changed:"ahi", calculated:["ai"]}); // update ai
}

function setup_valid() {
  tst.build_form({
    date: "2025-01-01",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);
  tst.build_form({
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
  update();
}

function setup_empty() {
  tst.build_form({
    date: "",
    referring: "",
    provider: "",
  }, key_global);
  tst.build_form({
    scored_at: "",
    duration: "",
    ahi: "",
    hi: "",
    s_ahi: "",
    s_percent: "",
    ox_avg: "",
    ox_min: "",
    odi: "",
    od_duration: "",
    pulse_min: "",
    pulse_avg: "",
    pulse_max: "",
    snores: "",
    // calculated
    ai: "",
  });
}

test("find_replace", () => {
  let path = "HST/MediByte";
  let {template, expected} = tst.get_paths(path);
  setup_valid();
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  setup_empty();
  let expected = {
    scored_at: "4",
    duration: "0.0 minutes",
    ahi: "0.0",
    hi: "0.0",
    s_ahi: "0.0",
    s_percent: "0.0",
    ox_avg: "0.0",
    ox_min: "0.0",
    odi: "0.0",
    od_duration: "0.0 minutes",
    pulse_min: "0.0",
    pulse_avg: "0.0",
    pulse_max: "0.0",
    snores: "0",
    // calculated
    ai: "0.0",
  };
  expect(get_map(key)).toEqual(expected);
});