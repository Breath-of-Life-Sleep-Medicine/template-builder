import { data, key, Defaults } from "../data.js";

data[key].data = {
  scored_at:   Defaults.percent({value:4, precision:0, min:3, max:4}),
  duration:    Defaults.minutes(),
  ahi:         Defaults.index(),
  ai:          Defaults.index(), // calculate
  hi:          Defaults.index(),
  s_ahi:       Defaults.index(),
  s_percent:   Defaults.percent(),
  ox_avg:      Defaults.percent(),
  ox_min:      Defaults.percent(),
  odi:         Defaults.index(),
  od_duration: Defaults.minutes(),
  pulse_min:   Defaults.pulse(),
  pulse_avg:   Defaults.pulse(),
  pulse_max:   Defaults.pulse(),
  snores:      Defaults.count(),
  ...data[key].data, // only set things that aren't already set
};

const DATA = data[key].data;
DATA.scored_at.clean.change = false;

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