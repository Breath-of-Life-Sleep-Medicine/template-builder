/**
 * @jest-environment jsdom
 */

import { key_global } from "../../../modules/data";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
  await import ("/modules/index.js");
  await import("/modules/PSG/MSLT.js");
});

beforeEach(() => {
  build_form({
    date: "2025-01-25",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);

  build_form({
    // diagnostic part
    prev_ahi: "5.0",
    prev_tst: "180.0",
    prev_eff: "50.0",
    prev_lat: "20.0",
    prev_r_lat: "42.0",

    // MSLT part
    nap1_start: "13:00", // 1:00 PM
    nap1_lat: {m: "4", s: "5"},
    nap1_r_lat: {m: "0", s: "0"},

    nap2_start: "13:30", // 1:30 PM
    nap2_lat: {m: "2", s:"1"},
    nap2_r_lat: {m: "20", s:"1"},

    nap3_start: "14:01", // 2:01 PM
    nap3_lat: {m: "4", s:"23"},
    nap3_r_lat: {m: "5", s:"28"},

    nap4_start: "14:55", // 2:55 PM
    nap4_lat: {m: "0", s:"59"},
    nap4_r_lat: {m: "1", s:"0"},

    nap5_start: "15:14", // 3:14 PM
    nap5_lat: {m: "4", s:"43"},
    nap5_r_lat: {m: "7", s:"8"},
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