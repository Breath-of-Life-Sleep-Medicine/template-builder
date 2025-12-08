import { data, key, Defaults } from "../data.js";
import { update_end, update_scored_at } from "../form.js";

data[key].data = {
  scored_at:   Defaults.percent({value:4, precision:0, min:3, max:4}),
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
  pulse_avg:   Defaults.pulse({precision:1}),
  snores:      Defaults.count(),
  ...data[key].data, // only set things that aren't already set
}

const DATA = data[key].data;
DATA.scored_at.clean.change = false;

data[key].update = {
  "scored_at": update_scored_at,
  "start": () => {update_end(end)},
  "trt": () => {update_end(end)},
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('calculated'));
}