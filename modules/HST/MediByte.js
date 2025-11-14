import { data, key, Defaults } from "../data.js";

data[key].data = {
  scored_at: Defaults.number.percent({value:4, precision:0, min:3, max:4}),
  duration: Defaults.duration({m:0, precision: 1, form: {set: duration_minutes_set, get: duration_minutes_get}}),
  ahi: Defaults.number.index(),
  ai: Defaults.number.index(), // calculate
  hi: Defaults.number.index(),
  s_ahi: Defaults.number.index(),
  s_percent: Defaults.number.percent(),
  ox_avg: Defaults.number.percent(),
  ox_min: Defaults.number.percent(),
  odi: Defaults.number.index(),
  od_duration: Defaults.duration({m:0, precision: 1, form: {set: duration_minutes_set, get: duration_minutes_get}}),
  pulse_min: Defaults.number.pulse(),
  pulse_avg: Defaults.number.pulse(),
  pulse_max: Defaults.number.pulse(),
  snores: Defaults.number.count(),
};

function duration_minutes_set(id, k=key) {
  let d = data[k].data[id];
  document.getElementById(id).value = d.value.m;
}

function duration_minutes_get(id) {
  return {m: document.getElementById(id).value};
}

data[key].update = {
  "scored_at": update_scored_at,
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('calculated'));
}

function update_scored_at() {
  label_scored_at.textContent = scored_at.value;
}