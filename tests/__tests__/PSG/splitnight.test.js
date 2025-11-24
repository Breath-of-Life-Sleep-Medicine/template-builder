/**
 * @jest-environment jsdom
 */

import { data, key, key_global } from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/PSG/SplitNight.js");
  global.rdi_pos_div = {hidden: true};
  global.rdi_pos_label = {hidden: true};
});

function update() {
  // call update function to do calculations
  tst.update_calculated({changed: "tst", calculated: ["eff", "ahi"]});
  tst.update_calculated({changed: "ahi", calculated: ["rdi"]});
  tst.update_calculated({changed: "ti_start", calculated: ["ti_end"]});
  tst.update_calculated({changed: "ti_tst", calculated: ["ti_eff", "ti_supine", "ti_rem"]});

  // update RDI
  data[key].update.supine();
  data[key].update.prone();
  data[key].update.left();
  data[key].update.right();
}

function setup_valid() {
  tst.build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
  }, key_global);
  tst.build_form({
    start: "22:00", // 10:00 PM
    trt: "360.0", // 360 minutes (6 hours)
    tst: "180.0", // 180 minutes (3 hours)
    lat: "20.0",
    waso: "10.0",
    r_lat: "42.0",
    n1: "9.0",
    n2: "51.0",
    n3: "25.0",
    rem: "15.0",
    a_cc: "1",
    a_oc: "4",
    a_mc: "3",
    h_c: "7",
    rera: "2",
    arem_ahi: "1.7",
    rem_ahi: "3.1",
    supine: "30.0",
    prone: "10.0",
    left: "7.0",
    right: "53.0",
    rdi_s: "1.7",
    rdi_p: "3.2",
    rdi_l: "0.2",
    rdi_r: "2.1",
    arousals: "12",
    arousals_sai: "0.5",
    arousals_rai: "0.4",
    limb: "22",
    limb_ai: "0.3",
    limb_plmi: "0.2",
    ox_w_avg: "95.0",
    ox_tst_avg: "93.2",
    ox_tst_min: "79.9",
    od_duration: "11.1",
    pulse_min: "50.0",
    pulse_avg: "63.7",
    pulse_max: "92.0",

    // titration
    ti_start: "04:00", // 4:00 AM
    ti_trt: "240.0", // 4 hours
    ti_tst: "180.0", // 3 hours
    ti_lat: "35.0",
    ti_rem_duration: "72.0",
    ti_supine_duration: "99.0",
    ti_ahi: "0.3",
    ti_cai: "0.1",

    // calculated
    ti_end: "00:00", // 8:00 AM
    eff: "", // 75.0%
    ahi: "", // 5.0
    rdi: "", // 4.9
    ti_eff: "", // 75.0%
    ti_rem: "", // 40.0%
    ti_supine: "", // 55.0%

    // misc / labels
    sum_phase: "",
    sum_pos: "",
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
    tst: "",
    lat: "",
    waso: "",
    r_lat: "",
    n1: "",
    n2: "",
    n3: "",
    rem: "",
    a_cc: "",
    a_oc: "",
    a_mc: "",
    h_c: "",
    rera: "",
    arem_ahi: "",
    rem_ahi: "",
    supine: "",
    prone: "",
    left: "",
    right: "",
    rdi_s: "",
    rdi_p: "",
    rdi_l: "",
    rdi_r: "",
    arousals: "",
    arousals_sai: "",
    arousals_rai: "",
    limb: "",
    limb_ai: "",
    limb_plmi: "",
    ox_w_avg: "",
    ox_tst_avg: "",
    ox_tst_min: "",
    od_duration: "",
    pulse_min: "",
    pulse_avg: "",
    pulse_max: "",

    // titration
    ti_start: "",
    ti_trt: "",
    ti_tst: "",
    ti_lat: "",
    ti_rem_duration: "",
    ti_supine_duration: "",
    ti_ahi: "",
    ti_cai: "",

    // calculated
    ti_end: "",
    eff: "",
    ahi: "",
    rdi: "",
    ti_eff: "",
    ti_rem: "",
    ti_supine: "",

    // misc / labels
    sum_phase: "",
    sum_pos: "",
  });
}

test("update rdi", () => {
  setup_valid();
  expect(Number(global.rdi.value)).toBe(5); // check that update rdi worked
});

test("find_replace", () => {
  setup_valid();
  let path = "PSG/SplitNight";
  let {template, expected} = tst.get_paths(path);

  data[key].data.rdi.clean.fn(4.9, "rdi"); // change rdi to test the template better

  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  setup_empty();
  let expected = {
    scored_at: "4",
    start: "12:00 AM",
    trt: "0.0 minutes",
    tst: "0.0 minutes",
    lat: "0.0 minutes",
    waso: "0.0 minutes",
    r_lat: "N/A",
    n1: "0.0",
    n2: "0.0",
    n3: "0.0",
    rem: "0.0",
    a_cc: "0",
    a_oc: "0",
    a_mc: "0",
    h_c: "0",
    rera: "0",
    arem_ahi: "0.0",
    rem_ahi: "N/A",
    supine: "0.0",
    prone: "0.0",
    left: "0.0",
    right: "0.0",
    rdi_s: "0.0",
    rdi_p: "0.0",
    rdi_l: "0.0",
    rdi_r: "0.0",
    arousals: "0",
    arousals_sai: "0.0",
    arousals_rai: "0.0",
    limb: "0",
    limb_ai: "0.0",
    limb_plmi: "0.0",
    ox_w_avg: "0.0",
    ox_tst_avg: "0.0",
    ox_tst_min: "0.0",
    od_duration: "0.0 minutes",
    pulse_min: "0.0",
    pulse_avg: "0.0",
    pulse_max: "0.0",

    // titration
    ti_start: "12:00 AM",
    ti_trt: "0.0 minutes",
    ti_tst: "0.0 minutes",
    ti_lat: "0.0 minutes",
    ti_rem_duration: "0.0 minutes",
    ti_supine_duration: "0.0 minutes",
    ti_ahi: "0.0",
    ti_cai: "0.0",

    // calculated
    ti_end: "12:00 AM",
    eff: "0.0",
    ahi: "0.0",
    rdi: "0.0",
    ti_eff: "0.0",
    ti_rem: "0.0",
    ti_supine: "0.0",

    // will be generated by get_map
    scored_at_label: "CMS",
    rdi_positions: "",
  };
  expect(get_map(key)).toEqual(expected);
});