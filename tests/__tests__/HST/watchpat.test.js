/**
 * @jest-environment jsdom
 */

import { key, key_global} from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

const empty_form = {
  key_global: {
    date:          {value:""},
    referring:     {value:""},
    provider:      {value:""},
  },
  key: {
    scored_at:     {value:""},
    epworth:       {value:""},
    stopbang:      {value:""},
    bmi:           {value:""},
    start:         {value:""},
    end:           {value:""},
    tst:           {value: {h: 0, m: 0}, class: "h m"},
    tst_rem:       {value:""},
    ahi:           {value:""},
    cahi:          {value:""},
    odi:           {value:""},
    rdi:           {value:""},
    afib_duration: {value: {h: 0, m: 0, s: 0}, class: "h m s"},
    ox_avg:        {value:""},
    ox_min:        {value:""},
    od_duration:   {value: {h: 0, m: 0}, class: "h m"},
    pulse_avg:     {value:""},
    pulse_min:     {value:""},
    pulse_max:     {value:""},
    s_duration:    {value: {h: 0, m: 0}, class: "h m"},
    s_ahi:         {value:""},
    snore_min:     {value:""},
    snore_min_60db:{value:""},
    snore_min_45db:{value:""},
    tst_deep:      {value:""},
    // checkboxes
    epworth_na:    {checked: false},
    stopbang_na:   {checked: false},
    bmi_na:        {checked: false},
    afib_na:       {checked: false},
    // calculated
    trt:           {value:{h:0, m:0}, class:"calculated h m"},
    od_percent:    {value:"", class:"calculated"},
    s_percent:     {value:"", class:"calculated"},
    snore_percent: {value:"", class:"calculated"},
    // misc
    label_cahi:    {textContent: "", class: "cahi_percent"},
  },
};

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/HST/WatchPAT.js");
  tst.build_form(empty_form);
});

beforeEach(() => {
  tst.update_form(empty_form);
});

function setup_valid() {
  tst.update_form({
    key_global: {
      date:          {value: "2025-01-20"},
      referring:     {value: "Example Doctor PAC"},
      provider:      {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      scored_at:     {value: "3"},
      epworth:       {value: "24"},
      stopbang:      {value: "8"},
      bmi:           {value: "27.5"},
      start:         {value: "22:00"}, // 10:00 PM
      end:           {value: "04:00"}, // 4:00 AM
      tst:           {value: {h: 4, m: 0}, class: "h m"},
      tst_rem:       {value: "17.4"},
      ahi:           {value: "25.0"},
      cahi:          {value: "5.0"},
      odi:           {value: "12.5"},
      rdi:           {value: "24.9"},
      afib_duration: {value: {h: 1, m: 35, s: 47}, class: "h m s"},
      ox_avg:        {value: "95"},
      ox_min:        {value: "82"},
      od_duration:   {value: {h: 0, m: 4}, class: "h m"},
      pulse_avg:     {value: "64"},
      pulse_min:     {value: "60"},
      pulse_max:     {value: "75"},
      s_duration:    {value: {h: 3, m: 1}, class: "h m"},
      s_ahi:         {value: "35.0"},
      snore_min:     {value: "60.0"},
      snore_min_60db:{value: "5.7"},
      snore_min_45db:{value: "37.6"},
      tst_deep:      {value: "42.86"},
      // checkboxes
      epworth_na:    {checked: true},
      stopbang_na:   {checked: true},
      bmi_na:        {checked: true},
      afib_na:       {checked: true},
    }
  });
}

test("watchpat find_replace", () => {
  let path = "HST/WatchPAT";
  let {template, expected} = tst.get_paths(path);
  setup_valid();
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  let expected = {
    scored_at:     "3",
    epworth:       "[]",
    stopbang:      "[]",
    bmi:           "[]",
    start:         "12:00 AM",
    end:           "12:00 AM",
    tst:           "0 minutes",
    tst_rem:       "0.0",
    ahi:           "0.0",
    cahi:          "0.0",
    odi:           "0.0",
    rdi:           "0.0",
    afib_duration: "0 seconds",
    ox_avg:        "0",
    ox_min:        "0",
    od_duration:   "0 minutes",
    pulse_avg:     "0",
    pulse_min:     "0",
    pulse_max:     "0",
    s_duration:    "0 minutes",
    s_ahi:         "0.0",
    snore_min:     "0.0",
    snore_min_60db:"0.0",
    snore_min_45db:"0.0",
    tst_deep:      "0.00",
    // calculated
    trt:           "0 minutes",
    od_percent:    "0",
    s_percent:     "0",
    snore_percent: "0",
    cahi_percent:  "0",
  };
  expect(get_map(key)).toEqual(expected);
});