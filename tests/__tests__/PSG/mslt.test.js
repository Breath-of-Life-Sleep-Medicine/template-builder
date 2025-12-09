/**
 * @jest-environment jsdom
 */

import { key } from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

const empty_form = {
  key_global: {
    date:      {value: ""},
    referring: {value: ""},
    provider:  {value: ""},
  },
  key: {
    // diagnostic part
    prev_ahi:   {value: ""},
    prev_tst:   {value: ""},
    prev_eff:   {value: ""},
    prev_lat:   {value: ""},
    prev_r_lat: {value: ""},

    // MSLT part
    nap1_start: {value: ""},
    nap1_lat:   {value: {m: "0", s: "0"}, class: "m s"},
    nap1_r_lat: {value: {m: "0", s: "0"}, class: "m s"},

    nap2_start: {value: ""},
    nap2_lat:   {value: {m: "0", s: "0"}, class: "m s"},
    nap2_r_lat: {value: {m: "0", s: "0"}, class: "m s"},

    nap3_start: {value: ""},
    nap3_lat:   {value: {m: "0", s: "0"}, class: "m s"},
    nap3_r_lat: {value: {m: "0", s: "0"}, class: "m s"},

    nap4_start: {value: ""},
    nap4_lat:   {value: {m: "0", s: "0"}, class: "m s"},
    nap4_r_lat: {value: {m: "0", s: "0"}, class: "m s"},

    nap5_start: {value: ""},
    nap5_lat:   {value: {m: "0", s: "0"}, class: "m s"},
    nap5_r_lat: {value: {m: "0", s: "0"}, class: "m s"},

    // N/A checkboxes
    prev_r_na: {checked: false},
    nap1_r_na: {checked: false},
    nap2_r_na: {checked: false},
    nap3_r_na: {checked: false},
    nap4_r_na: {checked: false},
    nap5_r_na: {checked: false},
  },
};

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/PSG/MSLT.js");
  tst.build_form(empty_form);
});

beforeEach(() => {
  tst.update_form(empty_form);
});

function setup_valid() {
  tst.update_form({
    key_global: {
      date:      {value: "2025-01-25"},
      referring: {value: "Example Doctor PAC"},
      provider:  {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      // diagnostic part
      prev_ahi:   {value: "5.0"},
      prev_tst:   {value: "180.0"},
      prev_eff:   {value: "50.0"},
      prev_lat:   {value: "20.0"},
      prev_r_lat: {value: "42.0"},

      // MSLT part
      nap1_start: {value: "13:00"}, // 1:00 PM
      nap1_lat:   {value: {m: "4", s: "5"}, class: "m s"},
      nap1_r_lat: {value: {m: "0", s: "0"}, class: "m s"},

      nap2_start: {value: "13:30"}, // 1:30 PM
      nap2_lat:   {value: {m: "2", s: "1"}, class: "m s"},
      nap2_r_lat: {value: {m: "20", s: "1"}, class: "m s"},

      nap3_start: {value: "14:01"}, // 2:01 PM
      nap3_lat:   {value: {m: "4", s: "23"}, class: "m s"},
      nap3_r_lat: {value: {m: "5", s: "28"}, class: "m s"},

      nap4_start: {value: "14:55"}, // 2:55 PM
      nap4_lat:   {value: {m: "0", s: "59"}, class: "m s"},
      nap4_r_lat: {value: {m: "1", s: "0"}, class: "m s"},

      nap5_start: {value: "15:14"}, // 3:14 PM
      nap5_lat:   {value: {m: "4", s: "43"}, class: "m s"},
      nap5_r_lat: {value: {m: "7", s: "8"}, class: "m s"},

      // N/A checkboxes
      prev_r_na: {checked: false},
      nap1_r_na: {checked: true},
      nap2_r_na: {checked: false},
      nap3_r_na: {checked: false},
      nap4_r_na: {checked: false},
      nap5_r_na: {checked: false},
    },
  });
}

test("find_replace", () => {
  setup_valid();
  let path = "PSG/MSLT";
  let {template, expected} = tst.get_paths(path);
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  let expected = {
    // diagnostic part
    prev_ahi:   "0.0",
    prev_tst:   "0.0 minutes",
    prev_eff:   "0.0",
    prev_lat:   "0.0 minutes",
    prev_r_lat: "0.0 minutes",

    // MSLT part
    nap1_start: "12:00 AM",
    nap1_lat:   "0 seconds",
    nap1_r_lat: "0 seconds",

    nap2_start: "12:00 AM",
    nap2_lat:   "0 seconds",
    nap2_r_lat: "0 seconds",

    nap3_start: "12:00 AM",
    nap3_lat:   "0 seconds",
    nap3_r_lat: "0 seconds",

    nap4_start: "12:00 AM",
    nap4_lat:   "0 seconds",
    nap4_r_lat: "0 seconds",

    nap5_start: "12:00 AM",
    nap5_lat:   "0 seconds",
    nap5_r_lat: "0 seconds",
  };
  expect(get_map(key)).toEqual(expected);
});