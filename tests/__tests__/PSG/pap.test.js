/**
 * @jest-environment jsdom
 */

import { data, key, key_global } from "/modules/data.js";
import * as tst from "/tests/util.js";
import { get_map } from "/script.js";

const empty_form = {
  key_global: {
    date:         {value: ""},
    referring:    {value: ""},
    provider:     {value: ""},
  },
  key: {
    scored_at:    {value: ""},
    start:        {value: ""},
    trt:          {value: ""},
    tst:          {value: ""},
    lat:          {value: ""},
    waso:         {value: ""},
    r_lat:        {value: ""},
    n1:           {value: ""},
    n2:           {value: ""},
    n3:           {value: ""},
    rem:          {value: ""},
    a_cc:         {value: ""},
    a_oc:         {value: ""},
    a_mc:         {value: ""},
    h_c:          {value: ""},
    rera:         {value: ""},
    arem_ahi:     {value: ""},
    rem_ahi:      {value: ""},
    supine:       {value: ""},
    prone:        {value: ""},
    left:         {value: ""},
    right:        {value: ""},
    rdi_s:        {value: ""},
    rdi_p:        {value: ""},
    rdi_l:        {value: ""},
    rdi_r:        {value: ""},
    arousals:     {value: ""},
    arousals_sai: {value: ""},
    arousals_rai: {value: ""},
    limb:         {value: ""},
    limb_ai:      {value: ""},
    limb_plmi:    {value: ""},
    ox_w_avg:     {value: ""},
    ox_tst_avg:   {value: ""},
    ox_tst_min:   {value: ""},
    od_duration:  {value: ""},
    pulse_min:    {value: ""},
    pulse_avg:    {value: ""},
    pulse_max:    {value: ""},

    // calculated
    end: {value: "", class: "calculated"},
    eff: {value: "", class: "calculated"},
    ahi: {value: "", class: "calculated"},
    a_ci: {value: "", class: "calculated"},
    rdi: {value: "", class: "calculated"},

    // misc / labels
    label_scored_at: {textContent: ""},
    sum_phase:       {textContent: ""},
    sum_pos:         {textContent: ""},
  },
};

// sets data callback functions
beforeAll(async () => {
  tst.init_data();
  await import ("/modules/index.js");
  await import("/modules/PSG/PAP.js");
  global.rdi_pos_div = {hidden: true};
  global.rdi_pos_label = {hidden: true};
  tst.build_form(empty_form);
});

beforeEach(() => {
  tst.update_form(empty_form);
})

// corresponds with the file in /expected
// values are valid; extremely straightforward conversion
function setup_valid() {
  tst.update_form({
    key_global: {
      date:         {value: "2025-01-20"},
      referring:    {value: "Example Doctor PAC"},
      provider:     {value: "Rotcod Elpmaxe FNP"},
    },
    key: {
      scored_at:    {value: "4"},
      start:        {value: "22:00"}, // 10:00 PM
      trt:          {value: "360.0"}, // 360 minutes (6 hours)
      tst:          {value: "180.0"}, // 180 minutes (3 hours)
      lat:          {value: "20.0"},
      waso:         {value: "10.0"},
      r_lat:        {value: "42.0"},
      n1:           {value: "9.0"},
      n2:           {value: "51.0"},
      n3:           {value: "25.0"},
      rem:          {value: "15.0"},
      a_cc:         {value: "1"},
      a_oc:         {value: "4"},
      a_mc:         {value: "3"},
      h_c:          {value: "7"},
      rera:         {value: "2"},
      arem_ahi:     {value: "1.7"},
      rem_ahi:      {value: "3.1"},
      supine:       {value: "30.0"},
      prone:        {value: "10.0"},
      left:         {value: "7.0"},
      right:        {value: "53.0"},
      rdi_s:        {value: "1.7"},
      rdi_p:        {value: "3.2"},
      rdi_l:        {value: "0.2"},
      rdi_r:        {value: "2.1"},
      arousals:     {value: "12"},
      arousals_sai: {value: "0.5"},
      arousals_rai: {value: "0.4"},
      limb:         {value: "22"},
      limb_ai:      {value: "0.3"},
      limb_plmi:    {value: "0.2"},
      ox_w_avg:     {value: "95.0"},
      ox_tst_avg:   {value: "93.2"},
      ox_tst_min:   {value: "79.9"},
      od_duration:  {value: "11.1"},
      pulse_min:    {value: "51.2"},
      pulse_avg:    {value: "63.7"},
      pulse_max:    {value: "92.8"},
    },
  });
}

test("update rdi", () => {
  setup_valid();
  expect(Number(global.rdi.value)).toBe(5); // check that update rdi worked
});

test("find_replace", () => {
  setup_valid();
  let path = "PSG/Inspire";
  let {template, expected} = tst.get_paths(path);
  tst.update_form({
    key: {
      rdi: {value: "4.9"}
    }
  });
  expect(tst.get_lines(tst.find_replace(template))).toStrictEqual(tst.get_lines(tst.get_file_str(expected))); // ignore newline
});

test("empty form", () => {
  let expected = {
    scored_at:    "3",
    start:        "12:00 AM",
    trt:          "0.0 minutes",
    tst:          "0.0 minutes",
    lat:          "0.0 minutes",
    waso:         "0.0 minutes",
    r_lat:        "N/A",
    n1:           "0.0",
    n2:           "0.0",
    n3:           "0.0",
    rem:          "0.0",
    a_cc:         "0",
    a_oc:         "0",
    a_mc:         "0",
    h_c:          "0",
    rera:         "0",
    arem_ahi:     "0.0",
    rem_ahi:      "N/A",
    supine:       "0.0",
    prone:        "0.0",
    left:         "0.0",
    right:        "0.0",
    rdi_s:        "0.0",
    rdi_p:        "0.0",
    rdi_l:        "0.0",
    rdi_r:        "0.0",
    arousals:     "0",
    arousals_sai: "0.0",
    arousals_rai: "0.0",
    limb:         "0",
    limb_ai:      "0.0",
    limb_plmi:    "0.0",
    ox_w_avg:     "0.0",
    ox_tst_avg:   "0.0",
    ox_tst_min:   "0.0",
    od_duration:  "0.0 minutes",
    pulse_min:    "0.0",
    pulse_avg:    "0.0",
    pulse_max:    "0.0",

    // calculated
    end:  "12:00 AM",
    eff:  "0.0",
    ahi:  "0.0",
    a_ci: "0.0",
    rdi:  "0.0",

    // will be generated by get_map
    scored_at_label: "AASM",
    rdi_positions:   "",
  }
  expect(get_map(key)).toEqual(expected);
});