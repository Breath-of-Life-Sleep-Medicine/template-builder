/**
 * @jest-environment jsdom
 */

import { key, key_global} from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/ResmedAirview.js");
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
      end:         {value: "04:00"}, // 4:00 AM
      ahi:         {value: "25.0"},
      ai:          {value: "5.0"},
      s_ahi:       {value: "35.0"},
      s_percent:   {value: "50"},
      ox_base:     {value: "96"},
      ox_avg:      {value: "95"},
      ox_min:      {value: "82"},
      odi:         {value: "12.5"},
      pulse_min:   {value: "45"},
      pulse_avg:   {value: "64"},
      pulse_max:   {value: "70"},
      snores:      {value: "243"},
      guidelines:  {value: "3"},
      s_duration:  {value: {h: 3, m: 1}, class: "h m"},
      od_duration: {value: {h: 0, m: 4}, class: "h m"},
      od_percent:  {value: "1"},
      duration1:   {checked: false},
      duration2:   {checked: true},
      // calculated
      duration:    {value:{h:0, m:0}, class:"calculated h m"}, // 6 hours 0 minutes
      hi:          {value: "", class: "calculated"},           // 20.0
      scored_at:   {value: "", class: "calculated"},           // 3
      // misc
      duration1_label: {value: ""},
      duration2_label: {value: ""},
      label_scored_at: {value: ""},
    }
  });
}

function setup_empty() {
  tst.build_form({
    key_global: {
      date:      {value:""},
      referring: {value:""},
      provider:  {value:""},
    },
    key: {
      start: {value:""},
      end: {value:""},
      ahi: {value:""},
      ai: {value:""},
      s_ahi: {value:""},
      s_percent: {value:""},
      ox_base: {value:""},
      ox_avg: {value:""},
      ox_min: {value:""},
      odi: {value:""},
      pulse_min: {value:""},
      pulse_avg: {value:""},
      pulse_max: {value:""},
      snores: {value:""},
      guidelines: {value:""},
      s_duration: {value: {h: 0, m: 0}},
      od_duration: {value: {h: 0, m: 0}},
      od_percent: {value:""},
      duration1: true,
      duration2: false,
      // calculated
      duration: {value:{h:0, m:0}, class:"calculated h m"},
      hi: {value:"", class:"calculated"},
      scored_at: {value:"", class:"calculated"},
      // misc
      duration1_label: {value:""},
      duration2_label: {value:""},
      label_scored_at: {value:""},
    },
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