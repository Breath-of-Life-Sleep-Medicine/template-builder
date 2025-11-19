import { data, key, Defaults } from "../data.js";
import { update_end } from "../form.js";

data[key].data = {
  start:       Defaults.time(),
  end:         Defaults.time(),                 // calculate
  trt:         Defaults.minutes(),
  ahi:         Defaults.index(),
  ai:          Defaults.index(),                // calculate
  hi:          Defaults.index(),
  ox_avg:      Defaults.percent({precision:0}),
  ox_min:      Defaults.percent({precision:0}),
  odi:         Defaults.index(),
  od_duration: Defaults.minutes(),
  pulse_min:   Defaults.pulse({precision:0}),
  pulse_avg:   Defaults.pulse({precision:1}),
  pulse_max:   Defaults.pulse({precision:0}),
  snores:      Defaults.count(),
}

data[key].update = {
  "start": () => {update_end(end)},
  "trt": () => {update_end(end)},
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('calculated'));
}