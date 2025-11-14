import { data, key, Defaults } from "../data.js";
import { update_end } from "../form.js";

data[key].data = {
  start:       Defaults.time(),
  end:         Defaults.time(),                        // calculate
  trt:         Defaults.duration({m:0, precision:1, form: {set: duration_minutes_set, get: duration_minutes_get}}),
  ahi:         Defaults.number.index(),
  ai:          Defaults.number.index(),                // calculate
  hi:          Defaults.number.index(),
  ox_avg:      Defaults.number.percent({precision:0}),
  ox_min:      Defaults.number.percent({precision:0}),
  odi:         Defaults.number.index(),
  od_duration: Defaults.duration({m:0, precision:1, form: {set: duration_minutes_set, get: duration_minutes_get}}),
  pulse_min:   Defaults.number.pulse({precision:0}),
  pulse_avg:   Defaults.number.pulse({precision:1}),
  pulse_max:   Defaults.number.pulse({precision:0}),
  snores:      Defaults.number.count(),
}

function duration_minutes_set(id, k=key) {
  let d = data[k].data[id];
  document.getElementById(id).value = d.value.m;
}

function duration_minutes_get(id) {
  return {m: document.getElementById(id).value};
}

data[key].update = {
  "start": () => {update_end(start, end, trt)},
  "trt": () => {update_end(start, end, trt)},
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('calculated'));
}