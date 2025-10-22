import * as script from "/script.js";

console.log("ResmedAirview.js");

// keep updated duration value objects here b/c input.value can't store objects, only string
let duration1_value = {"h":0, "m":0};
let duration2_value = {"h":0, "m":0};

script.data[script.key] = {};

// ids that have no onchange callback fn; can still trigger update w/o clean
script.data[script.key].no_change = [
  "start",
  "end",
];

// template keywords and form ids both use the clean

// examples:

// s_duration: template keyword - combines 2 form fields
// s_duration_hr: form id - does not exist in template
// s_duration_min: form id - does not exist in template

// scored_at: template keyword & form id (calculated from guidelines)
// guidelines: form id - does not exist in template

script.data[script.key].clean = {
  "scored_at": () => script.clip_percent(scored_at.value,0,3,4),
  "start": () => script.time_24_to_12(start.value),
  "end": () => script.time_24_to_12(end.value),
  "duration": () => script.duration_str((duration2.checked ? duration2_value : duration1_value)),
  "ahi": () => script.clip_index(ahi.value),
  "ai": () => script.clip_index(ai.value),
  "hi": () => script.clip_index(hi.value),
  "s_ahi": () => script.clip_index(s_ahi.value),
  "s_duration": () => script.duration_str({h:script.data[script.key].clean.s_duration_hr(), m:script.data[script.key].clean.s_duration_min()}),
  "s_duration_hr": () => script.clip_number(s_duration_hr.value,0,0),
  "s_duration_min": () => script.clip_number(s_duration_min.value,0,0,59),
  "s_percent": () => script.clip_percent(s_percent.value, 1),
  "ox_base": () => script.clip_percent(ox_base.value, 0),
  "ox_avg": () => script.clip_percent(ox_avg.value, 0),
  "ox_min": () => script.clip_percent(ox_min.value, 0),
  "odi": () => script.clip_index(odi.value),
  "od_duration": () => script.duration_str({h:script.data[script.key].clean.od_duration_hr(), m:script.data[script.key].clean.od_duration_min()}),
  "od_duration_hr": () => script.clip_number(od_duration_hr.value,0,0),
  "od_duration_min": () => script.clip_number(od_duration_min.value,0,0,59),
  "od_percent": () => script.clip_percent(od_percent.value,0),
  "pulse_min": () => script.clip_number(pulse_min.value,0,0),
  "pulse_avg": () => script.clip_number(pulse_avg.value,0,0),
  "pulse_max": () => script.clip_number(pulse_max.value,0,0),
  "snores": () => script.clip_number(snores.value,0,0),
};

script.data[script.key].update = {
  "start": update_duration,
  "end": update_duration,
  "ahi": update_hi,
  "ai": update_hi,
  "guidelines": update_scored_at, // has update fn w/o a clean fn
}

function update_duration() {
  let [s, e] = script.get_dt("01/01/2000", start.value, end.value);
  let d1 = script.get_duration(s, new Date(e.getTime() - 1000 * 60));
  let d2 = script.get_duration(s, e);
  duration1_label.textContent = script.duration_short_str(...Object.values(d1));
  duration2_label.textContent = script.duration_short_str(...Object.values(d2));
  duration1_value = d1;
  duration2_value = d2;
}

function update_hi() {
  hi.value = ahi.value - ai.value;
  hi.dispatchEvent(new Event('change'));
}

function update_scored_at() {
  scored_at.value = guidelines.value;
}