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
  await import("/modules/HST/MediByte.js");
});

function setup_valid() {
  tst.build_form({
    key_global: {
      date:        {value: "2025-01-01"},
      referring:   {value: "Example Doctor PAC"},
      provider:    {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      scored_at:   {value: "3"},
      duration:    {value: "480.0"},
      ahi:         {value: "25.0"},
      hi:          {value: "20.0"},
      s_ahi:       {value: "35.0"},
      s_percent:   {value: "60.0"},
      ox_avg:      {value: "95.4"},
      ox_min:      {value: "82.0"},
      odi:         {value: "12.5"},
      od_duration: {value: "5.4"},
      pulse_avg:   {value: "64.3"},
      snores:      {value: "243"},
      // calculated
      ai:          {value: "", class: "calculated"},
      // misc
      label_scored_at: {textContent: ""},
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
      scored_at:   {value: ""},
      duration:    {value: ""},
      ahi:         {value: ""},
      hi:          {value: ""},
      s_ahi:       {value: ""},
      s_percent:   {value: ""},
      ox_avg:      {value: ""},
      ox_min:      {value: ""},
      odi:         {value: ""},
      od_duration: {value: ""},
      pulse_avg:   {value: ""},
      snores:      {value: ""},
      // calculated
      ai:          {value: "", class: "calculated"},
      // misc
      label_scored_at: {textContent: ""},
    },
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
    scored_at:   "3",
    duration:    "0.0 minutes",
    ahi:         "0.0",
    hi:          "0.0",
    s_ahi:       "0.0",
    s_percent:   "0.0",
    ox_avg:      "0.0",
    ox_min:      "0.0",
    odi:         "0.0",
    od_duration: "0.0 minutes",
    pulse_avg:   "0.0",
    snores:      "0",
    // calculated
    ai:          "0.0",
  };
  expect(get_map(key)).toEqual(expected);
});