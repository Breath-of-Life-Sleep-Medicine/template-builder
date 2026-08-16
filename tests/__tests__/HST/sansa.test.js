/**
 * @jest-environment jsdom
 */

import { key, key_global} from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

const empty_form = {
  key_global: {
    date:               {value:""},
    referring:          {value:""},
    provider:           {value:""},
  },
  key: {
    bmi:                {value:""},
    scored_at:          {value:""},
    start:              {value:""},
    end:                {value:""},
    tst:                {value: {h: 0, m: 0}, class: "h m"},
    tst_rem:            {value: {h: 0, m: 0}, class: "h m"},
    ahi:                {value:""},
    cahi:               {value:""},
    odi:                {value:""},
    rem_ahi:            {value:""},
    ox_avg:             {value:""},
    ox_min:             {value:""},
    od_duration_min:    {value:""},
    pulse_min:          {value:""},
    pulse_avg:          {value:""},
    pulse_max:          {value:""},
    s_ahi:              {value:""},
    s_duration_min:     {value:""},
    has_snoring:        {value:""},
    // checkboxes
    bmi_na:             {checked: false},
    // calculated
    trt:                {value:{h:0, m:0}, class:"calculated h m"},
    tst_non_rem:        {value:{h:0, m:0}, class:"calculated h m"},
    s_duration_percent: {value:"", class:"calculated"},
    // misc
    label_cahi:         {textContent: "", class: "centrals_percent"},
  },
};

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/templates/index/script.js");
  await import("/templates/HST/SANSA/script.js");
  tst.build_form(empty_form);
});

beforeEach(() => {
  tst.update_form(empty_form);
});

function setup_valid() {
  tst.update_form({
    key_global: {
      date:            {value: "2025-01-20"},
      referring:       {value: "Example Doctor PAC"},
      provider:        {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      bmi:             {value: "27.57"},
      scored_at:       {value: "3"},
      start:           {value: "22:00"}, // 10:00 PM
      end:             {value: "04:00"}, // 4:00 AM
      tst:             {value: {h: 4, m: 26}, class: "h m"}, // 266 min
      tvt:             {value: {h: 4, m: 0}, class: "h m"},  // 240 min
      tst_rem:         {value: "27"},    // 266 - 27 = 239 min
      ahi:             {value: "25.0"},
      cahi:            {value: "5.0"},   // 100 * 5 / 25 = 20%
      odi:             {value: "12.5"},
      rem_ahi:         {value: "47.3"},
      ox_avg:          {value: "95.2"},
      ox_min:          {value: "82.5"},
      od_duration_min: {value: "4"},     // % = 100*4/266 ~ 1.5038% ~ 1.5%
      pulse_min:       {value: "60"},
      pulse_avg:       {value: "64"},
      pulse_max:       {value: "75"},
      s_ahi:           {value: "35.1"},
      s_duration_min:  {value: "181"},   // % = 100*181/266 ~ 68.0451 ~ 68%
      has_snoring:     {value: "true"},
      // checkboxes
      bmi_na:          {checked: false},
    }
  });
}

test("sansa find_replace", () => {
  let path = "HST/SANSA";
  let {template, expected} = tst.get_paths(path);
  setup_valid();
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  let expected = {
    bmi:                "0.00",
    scored_at:          "3",
    start:              "12:00 AM",
    end:                "12:00 AM",
    tst:                "0 minutes",
    tst_rem:            "0 minutes",
    ahi:                "0.0",
    cahi:               "0.0",
    odi:                "0.0",
    rem_ahi:            "0.0",
    ox_avg:             "0.0",
    ox_min:             "0.0",
    od_duration_min:    "0 minutes",
    pulse_min:          "0",
    pulse_avg:          "0",
    pulse_max:          "0",
    s_ahi:              "0.0",
    s_duration_min:     "0 minutes",
    has_snoring:        "[] detected",
    // calculated
    trt:                "0 minutes",
    tst_non_rem:        "0 minutes",
    s_duration_percent: "0",
    centrals_percent:   "0",
  };
  expect(get_map(key)).toEqual(expected);
});