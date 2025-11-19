import { data, key, Defaults } from "../data.js";

// TODO: once sessionStorage is in use, use it to load in data from the previous diagnostic PSG to fill in the diagnostic part

data[key].data = {
  // stats from the diagnostic study
  prev_ahi:   Defaults.index(),   // AHI (events/hr)
  prev_tst:   Defaults.minutes(), // total sleep time (minutes)
  prev_eff:   Defaults.percent(), // sleep efficiency (%)
  prev_lat:   Defaults.minutes(), // sleep onset latency (minutes)
  prev_r_lat: Defaults.minutes(), // rem latency - less wake time (minutes)

  // MSLT naps
  // start, sleep latency, REM latency
  // note: REM latency can be N/A
  nap1_start: Defaults.time(),
  nap1_lat:   Defaults.duration({m:0, s:0, precision: 0}),
  nap1_r_lat: Defaults.duration({m:0, s:0, precision: 0}),

  nap2_start: Defaults.time(),
  nap2_lat:   Defaults.duration({m:0, s:0, precision: 0}),
  nap2_r_lat: Defaults.duration({m:0, s:0, precision: 0}),

  nap3_start: Defaults.time(),
  nap3_lat:   Defaults.duration({m:0, s:0, precision: 0}),
  nap3_r_lat: Defaults.duration({m:0, s:0, precision: 0}),

  nap4_start: Defaults.time(),
  nap4_lat:   Defaults.duration({m:0, s:0, precision: 0}),
  nap4_r_lat: Defaults.duration({m:0, s:0, precision: 0}),

  nap5_start: Defaults.time(),
  nap5_lat:   Defaults.duration({m:0, s:0, precision: 0}),
  nap5_r_lat: Defaults.duration({m:0, s:0, precision: 0}),
}

let DATA = data[key].data;

// non-default template setters
data[key].template_set = {
  // stats from the diagnostic study
  // rem latency - less wake time (minutes)
  prev_r_lat: () => prev_r_na.checked ? "N/A" : DATA.prev_r_lat.value.toStr(),
  // MSLT naps
  // rem latency
  nap1_r_lat: () => nap1_r_na.checked ? "N/A" : DATA.nap1_r_lat.value.toStr(),
  nap2_r_lat: () => nap2_r_na.checked ? "N/A" : DATA.nap2_r_lat.value.toStr(),
  nap3_r_lat: () => nap3_r_na.checked ? "N/A" : DATA.nap3_r_lat.value.toStr(),
  nap4_r_lat: () => nap4_r_na.checked ? "N/A" : DATA.nap4_r_lat.value.toStr(),
  nap5_r_lat: () => nap5_r_na.checked ? "N/A" : DATA.nap5_r_lat.value.toStr(),
};

// non-default onchange callback fns
data[key].update = {
  prev_r_na: () => {toggle('prev_r_lat_visibility');},
  nap1_r_na: () => {toggle('nap1_visibility');},
  nap2_r_na: () => {toggle('nap2_visibility');},
  nap3_r_na: () => {toggle('nap3_visibility');},
  nap4_r_na: () => {toggle('nap4_visibility');},
  nap5_r_na: () => {toggle('nap5_visibility');},
};

function toggle(toggle_class) {
  let elements = document.getElementsByClassName(toggle_class);
  for (let element of elements) {
    element.hidden = !element.hidden;
  }
}