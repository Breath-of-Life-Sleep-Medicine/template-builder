import * as script from "/script.js";

console.log("MediByte.js");

script.data[script.key] = {};

// callback fn when data is extracted from a field (no changes)
script.data[script.key]["clean"] = {
  "scored_at": () => script.clip_percent(scored_at.value, 0, 3, 4),
  "duration": () => script.clip_minutes(duration.value),
  "ahi": () => script.clip_index(ahi.value),
  "ai": () => script.clip_index(ai.value), // calculate
  "hi": () => script.clip_index(hi.value),
  "s_ahi": () => script.clip_index(s_ahi.value),
  "s_percent": () => script.clip_percent(s_percent.value),
  "ox_avg": () => script.clip_percent(ox_avg.value),
  "ox_min": () => script.clip_percent(ox_min.value),
  "odi": () => script.clip_index(odi.value),
  "od_duration": () => script.clip_minutes(od_duration.value),
  "pulse_min": () => script.clip_number(pulse_min.value, 1, 0),
  "pulse_avg": () => script.clip_number(pulse_avg.value, 1, 0),
  "pulse_max": () => script.clip_number(pulse_max.value, 1, 0),
  "snores": () => script.clip_number(snores.value, 0, 0),
};

// onchange callback fn
script.data[script.key]["update"] = {
  "duration": () => duration.value = script.clip_minutes(duration.value),
  "ahi": () => {
    ahi.value = script.clip_index(ahi.value);
    update_ai(ahi, ai, hi);
  },
  "ai": () => ai.value = script.clip_index(ai.value), // calculate
  "hi": () => {
    hi.value = script.clip_index(hi.value);
    update_ai(ahi, ai, hi);
  },
  "s_ahi": () => s_ahi.value = script.clip_index(s_ahi.value),
  "s_percent": () => s_percent.value = script.clip_percent(s_percent.value),
  "ox_avg": () => ox_avg.value = script.clip_percent(ox_avg.value),
  "ox_min": () => ox_min.value = script.clip_percent(ox_min.value),
  "odi": () => odi.value = script.clip_index(odi.value),
  "od_duration": () => od_duration.value = script.clip_minutes(od_duration.value),
  "pulse_min": () => pulse_min.value = script.clip_number(pulse_min.value, 1, 0),
  "pulse_avg": () => pulse_avg.value = script.clip_number(pulse_avg.value, 1, 0),
  "pulse_max": () => pulse_max.value = script.clip_number(pulse_max.value, 1, 0),
  "snores": () => snores.value = script.clip_number(snores.value, 0, 0),
};

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('change'));
}