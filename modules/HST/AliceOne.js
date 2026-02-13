import { data, key, Defaults } from "../data.js";
import { update_end, update_scored_at } from "../form.js";

data[key].data = {
  scored_at:   Defaults.percent({value:4, precision:0, min:3, max:4}),
  start:       Defaults.time(),
  end:         Defaults.time(),                  // calculate
  trt:         Defaults.minutes(),
  ahi:         Defaults.index(),                 // calculate
  ai:          Defaults.index(),                 // calculate
  hi:          Defaults.index(),
  a_ci:        Defaults.index(),
  a_mi:        Defaults.index(),
  a_oi:        Defaults.index(),
  a_cmi:       Defaults.percent({precision: 0}), // calculate
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
  scored_at: update_scored_at,
  start: () => {update_end(end)},
  trt: () => {update_end(end)},
  ahi: update_acmi,
  hi: update_ahi,
  // ai: update_ahi,
  a_oi: update_ai,
  a_ci: update_ai,
  a_mi: update_ai,
};

function update_ai() {
  let val = Number(DATA.a_ci.value) + Number(DATA.a_mi.value) + Number(DATA.a_oi.value);
  DATA.ai.clean.fn(val, "ai");
  update_ahi();
}

function update_ahi() {
  ahi.value = Number(DATA.hi.value) + Number(DATA.ai.value);
  ahi.dispatchEvent(new Event('calculated'));
}

function update_acmi() {
  let val = 100.0 * (Number(DATA.a_ci.value) + Number(DATA.a_mi.value)) / Number(DATA.ahi.value);
  DATA.a_cmi.clean.fn(val, "a_cmi");
}