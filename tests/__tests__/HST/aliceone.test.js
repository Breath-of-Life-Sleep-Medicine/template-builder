/**
 * @jest-environment jsdom
 */

import { key, key_global } from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/AliceOne.js");
});

function update() {
  tst.update_calculated({changed: "start", calculated: ["end"]}); // update end
  tst.update_calculated({changed: "ahi", calculated: ["ai"]});    // update ai
}

function setup_valid() {
  tst.build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);
  tst.build_form({
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
    end: "00:00", // 4:00 AM
    ai: "", // 5.0
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
    trt: "",
    ahi: "",
    hi: "",
    ox_avg: "",
    ox_min: "",
    odi: "",
    od_duration: "",
    pulse_min: "",
    pulse_avg: "",
    pulse_max: "",
    snores: "",
    // calculated
    end: "",
    ai: "",
  });
}

test("find_replace", () => {
  let path = "HST/AliceOne";
  let {template, expected} = tst.get_paths(path);
  setup_valid();
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  setup_empty();
  let expected = {
    start:       "12:00 AM",
    trt:         "0.0 minutes",
    ahi:         "0.0",
    hi:          "0.0",
    ox_avg:      "0",
    ox_min:      "0",
    odi:         "0.0",
    od_duration: "0.0 minutes",
    pulse_min:   "0",
    pulse_avg:   "0.0",
    pulse_max:   "0",
    snores:      "0",
    // calculated
    end:         "12:00 AM",
    ai:          "0.0",
  };
  expect(get_map(key)).toEqual(expected);
});