import { data, key, Defaults } from "../data.js";

data[key].data = {
  scored_at:   Defaults.percent({value:4, precision:0, min:3, max:4}),
  duration:    Defaults.minutes(),
  ahi:         Defaults.index(), // calculate
  ai:          Defaults.index(), // calculate
  hi:          Defaults.index(),
  a_ci:        Defaults.index(),
  a_mi:        Defaults.index(),
  a_oi:        Defaults.index(),
  a_cmi:       Defaults.percent({precision: 0}), // calculate
  s_ahi:       Defaults.index(),
  s_percent:   Defaults.percent(),
  ox_avg:      Defaults.percent(),
  ox_min:      Defaults.percent(),
  odi:         Defaults.index(),
  od_duration: Defaults.minutes(),
  pulse_avg:   Defaults.pulse(),
  snores:      Defaults.count(),
  ...data[key].data, // only set things that aren't already set
};

const DATA = data[key].data;
DATA.scored_at.clean.change = false;

data[key].update = {
  scored_at: update_scored_at,
  ahi: update_acmi,
  hi: update_ahi,
  ai: update_ahi,
  a_oi: update_ai,
  a_ci: update_ai,
  a_mi: update_ai,
};

function update_ai() {
  ai.value = Number(DATA.a_ci.value) + Number(DATA.a_mi.value) + Number(DATA.a_oi.value);
  ai.dispatchEvent(new Event('calculated'));
}

function update_ahi() {
  ahi.value = Number(DATA.hi.value) + Number(DATA.ai.value);
  ahi.dispatchEvent(new Event('calculated'));
}

function update_acmi() {
  a_cmi.value = 100.0 * (Number(DATA.a_ci.value) + Number(DATA.a_mi.value)) / DATA.ahi.value;
  a_cmi.dispatchEvent(new Event('calculated'));
}

function update_scored_at() {
  label_scored_at.textContent = scored_at.value;
}