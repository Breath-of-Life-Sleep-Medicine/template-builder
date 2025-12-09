/**
 * @jest-environment jsdom
 */

import { key, key_global } from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

const empty_form = {
  key_global: {
    date:        {value: ""},
    referring:   {value: ""},
    provider:    {value: ""},
  },
  key: {
    scored_at:   {value: ""},
    start:       {value: ""},
    trt:         {value: ""},
    ahi:         {value: ""},
    hi:          {value: ""},
    ox_avg:      {value: ""},
    ox_min:      {value: ""},
    odi:         {value: ""},
    od_duration: {value: ""},
    pulse_avg:   {value: ""},
    snores:      {value: ""},
    // calculated
    end:         {value: "", class: "calculated"},
    ai:          {value: "", class: "calculated"},
    // misc
    label_scored_at: {textContent: ""},
  },
};

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/AliceOne.js");
  tst.build_form(empty_form);
});

beforeEach(() => {
  tst.update_form(empty_form);
})

function setup_valid() {
  tst.update_form({
    key_global: {
      date:        {value: "2025-01-20"},
      referring:   {value: "Example Doctor PAC"},
      provider:    {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      scored_at:   {value: "3"},
      start:       {value: "22:00"}, // 10:00 PM
      trt:         {value: "360.0"},
      ahi:         {value: "25.0"},
      hi:          {value: "20.0"},
      ox_avg:      {value: "96"},
      ox_min:      {value: "80"},
      odi:         {value: "2.4"},
      od_duration: {value: "5.4"},
      pulse_avg:   {value: "76.5"},
      snores:      {value: "243"},
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
  let expected = {
    scored_at:   "3",
    start:       "12:00 AM",
    trt:         "0.0 minutes",
    ahi:         "0.0",
    hi:          "0.0",
    ox_avg:      "0",
    ox_min:      "0",
    odi:         "0.0",
    od_duration: "0.0 minutes",
    pulse_avg:   "0.0",
    snores:      "0",
    // calculated
    end:         "12:00 AM",
    ai:          "0.0",
  };
  expect(get_map(key)).toEqual(expected);
});