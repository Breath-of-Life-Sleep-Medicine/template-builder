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

function setup_valid() {
  tst.build_form({
    key_global: {
      date:        {value: "2025-01-20"},
      referring:   {value: "Example Doctor PAC"},
      provider:    {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      start:       {value: "22:00"}, // 10:00 PM
      trt:         {value: "360.0"},
      ahi:         {value: "25.0"},
      hi:          {value: "20.0"},
      ox_avg:      {value: "96"},
      ox_min:      {value: "80"},
      odi:         {value: "2.4"},
      od_duration: {value: "5.4"},
      pulse_min:   {value: "55"},
      pulse_avg:   {value: "76.5"},
      pulse_max:   {value: "110"},
      snores:      {value: "243"},
      // calculated
      end:         {value: "00:00", class: "calculated"}, // 4:00 AM
      ai:          {value: "", class: "calculated"},      // 5.0
    },
  });
}

function setup_empty() {
  tst.build_form({
    key_global: {
      date:        {value: ""},
      referring:   {value: ""},
      provider:    {value: ""},
    },
    key: {
      start:       {value: ""},
      trt:         {value: ""},
      ahi:         {value: ""},
      hi:          {value: ""},
      ox_avg:      {value: ""},
      ox_min:      {value: ""},
      odi:         {value: ""},
      od_duration: {value: ""},
      pulse_min:   {value: ""},
      pulse_avg:   {value: ""},
      pulse_max:   {value: ""},
      snores:      {value: ""},
      // calculated
      end:         {value: "", class: "calculated"},
      ai:          {value: "", class: "calculated"},
    },
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