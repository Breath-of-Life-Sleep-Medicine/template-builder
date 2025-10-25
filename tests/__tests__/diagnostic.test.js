/**
 * @jest-environment jsdom
 */

import * as script from "/script.js";
import {get_paths, get_lines, find_replace, get_file_str, build_form, init_data} from "/tests/util.js";

// sets data callback functions
beforeAll(async () => {
  init_data();
  await import("/modules/PSG/Diagnostic.js");
  global.rdi_pos_div = {hidden: true};
  global.rdi_pos_label = {hidden: true};
});

beforeEach(() => {
  build_form({
    date: "2025-01-20",
    referring: "Example Doctor PAC",
    provider: "Rotcod Elpmaxe FNP",
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

    // calculated
    end: "", // 4:00 AM
    eff: "", // 50.0%
    ahi: "", // 5.0
    rdi: "", // 4.9
  });

  // ids
  global.supine.id = "supine";
  global.prone.id = "prone";
  global.left.id = "left";
  global.right.id = "right";

  // call update function to do calculations
  script.data[script.key].update.trt();  // update efficiency, update end
  script.data[script.key].update.a_oc(); // update ahi (do before updating rdi)
  script.data[script.key].update.ahi();  // update rdi (requires ahi)

  // update RDI
  script.data[script.key].update.supine();
  script.data[script.key].update.prone();
  script.data[script.key].update.left();
  script.data[script.key].update.right();
});

test("update rdi", () => {
  expect(global.rdi.value).toBe(5); // check that update rdi worked
});

// diagnostic test
test("diagnostic find_replace", () => {
  let path = "PSG/Diagnostic";
  let {template, expected} = get_paths(path);

  global.rdi.value = "4.9";// change rdi to test the template better

  expect(get_lines(find_replace(template))).toStrictEqual(get_lines(get_file_str(expected))); // ignore newline
});