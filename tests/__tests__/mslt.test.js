/**
 * @jest-environment jsdom
 */

import * as script from "/script.js";
import * as data from "/modules/PSG/MSLT.js"; // sets data callback functions
import {get_paths, get_lines, find_replace, get_file_str, build_form} from "/tests/util.js";

beforeEach(() => {
  build_form({
    date: "2025-01-01",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",

    // diagnostic part
    prev_ahi: "5.0",
    prev_tst: "180.0",
    prev_eff: "50.0",
    prev_lat: "20.0",
    prev_r_lat: "42.0",

    // MSLT part
    nap1_start: "13:00", // 1:00 PM
    nap1_lat_min: "4",
    nap1_lat_sec: "5",
    nap1_r_lat_min: "0",
    nap1_r_lat_sec: "0",

    nap2_start: "13:30", // 1:30 PM
    nap2_lat_min: "2",
    nap2_lat_sec: "1",
    nap2_r_lat_min: "20",
    nap2_r_lat_sec: "1",

    nap3_start: "14:01", // 2:01 PM
    nap3_lat_min: "4",
    nap3_lat_sec: "23",
    nap3_r_lat_min: "5",
    nap3_r_lat_sec: "28",

    nap4_start: "14:55", // 2:55 PM
    nap4_lat_min: "0",
    nap4_lat_sec: "59",
    nap4_r_lat_min: "1",
    nap4_r_lat_sec: "0",

    nap5_start: "15:14", // 3:14 PM
    nap5_lat_min: "4",
    nap5_lat_sec: "43",
    nap5_r_lat_min: "7",
    nap5_r_lat_sec: "8",
  });

  // N/A checkboxes
  global.prev_r_na = {checked: false};
  global.nap1_r_na = {checked: true};
  global.nap2_r_na = {checked: false};
  global.nap3_r_na = {checked: false};
  global.nap4_r_na = {checked: false};
  global.nap5_r_na = {checked: false};
});

test("find_replace", () => {
  let path = "PSG/MSLT";
  let {template, expected} = get_paths(path);
  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});