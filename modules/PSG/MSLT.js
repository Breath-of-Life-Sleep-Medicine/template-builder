import * as script from "/script.js";

// TODO: once sessionStorage is in use, use it to load in data from the previous diagnostic PSG to fill in the diagnostic part

script.data[script.key] = {};

// ids that have no onchange callback fn; can still trigger update w/o clean
// don't clean time fields
script.data[script.key].no_change = [
  "nap1_start",
  "nap2_start",
  "nap3_start",
  "nap4_start",
  "nap5_start",
];

// input cleaning & simple template setters
script.data[script.key].clean = {
  // stats from the diagnostic study
  "prev_ahi":   () => script.clip_index(prev_ahi.value),     // AHI (events/hr)
  "prev_tst":   () => script.clip_minutes(prev_tst.value),   // total sleep time (minutes)
  "prev_eff":   () => script.clip_percent(prev_eff.value),   // sleep efficiency (%)
  "prev_lat":   () => script.clip_minutes(prev_lat.value),   // sleep onset latency (minutes)
  "prev_r_lat": () => script.clip_minutes(prev_r_lat.value), // rem latency - less wake time (minutes)

  // MSLT naps
  // start, sleep latency, REM latency
  // note: REM latency can be N/A
  "nap1_start":     () => script.time_str(...script.get_dt(null, nap1_start.value)),
  "nap1_lat_min":   () => script.clip_number(nap1_lat_min.value,0,0),
  "nap1_lat_sec":   () => script.clip_number(nap1_lat_sec.value,0,0,59),
  "nap1_r_lat_min": () => script.clip_number(nap1_r_lat_min.value,0,0),
  "nap1_r_lat_sec": () => script.clip_number(nap1_r_lat_sec.value,0,0,59),

  "nap2_start":     () => script.time_str(...script.get_dt(null, nap2_start.value)),
  "nap2_lat_min":   () => script.clip_number(nap2_lat_min.value,0,0),
  "nap2_lat_sec":   () => script.clip_number(nap2_lat_sec.value,0,0,59),
  "nap2_r_lat_min": () => script.clip_number(nap2_r_lat_min.value,0,0),
  "nap2_r_lat_sec": () => script.clip_number(nap2_r_lat_sec.value,0,0,59),

  "nap3_start":     () => script.time_str(...script.get_dt(null, nap3_start.value)),
  "nap3_lat_min":   () => script.clip_number(nap3_lat_min.value,0,0),
  "nap3_lat_sec":   () => script.clip_number(nap3_lat_sec.value,0,0,59),
  "nap3_r_lat_min": () => script.clip_number(nap3_r_lat_min.value,0,0),
  "nap3_r_lat_sec": () => script.clip_number(nap3_r_lat_sec.value,0,0,59),

  "nap4_start":     () => script.time_str(...script.get_dt(null, nap4_start.value)),
  "nap4_lat_min":   () => script.clip_number(nap4_lat_min.value,0,0),
  "nap4_lat_sec":   () => script.clip_number(nap4_lat_sec.value,0,0,59),
  "nap4_r_lat_min": () => script.clip_number(nap4_r_lat_min.value,0,0),
  "nap4_r_lat_sec": () => script.clip_number(nap4_r_lat_sec.value,0,0,59),

  "nap5_start":     () => script.time_str(...script.get_dt(null, nap5_start.value)),
  "nap5_lat_min":   () => script.clip_number(nap5_lat_min.value,0,0),
  "nap5_lat_sec":   () => script.clip_number(nap5_lat_sec.value,0,0,59),
  "nap5_r_lat_min": () => script.clip_number(nap5_r_lat_min.value,0,0),
  "nap5_r_lat_sec": () => script.clip_number(nap5_r_lat_sec.value,0,0,59),
};

// complicated template setters
script.data[script.key].template_set = {
  // stats from the diagnostic study
  // rem latency - less wake time (minutes)
  "prev_r_lat": () => prev_r_na.checked ? "N/A" : script.clip_minutes(prev_r_lat.value) + " Minutes",
  // MSLT naps
  // sleep latency
  "nap1_lat": () => script.duration_str({m:script.clip_number(nap1_lat_min.value,0,0), s:script.clip_number(nap1_lat_sec.value,0,0,59)}),
  "nap2_lat": () => script.duration_str({m:script.clip_number(nap2_lat_min.value,0,0), s:script.clip_number(nap2_lat_sec.value,0,0,59)}),
  "nap3_lat": () => script.duration_str({m:script.clip_number(nap3_lat_min.value,0,0), s:script.clip_number(nap3_lat_sec.value,0,0,59)}),
  "nap4_lat": () => script.duration_str({m:script.clip_number(nap4_lat_min.value,0,0), s:script.clip_number(nap4_lat_sec.value,0,0,59)}),
  "nap5_lat": () => script.duration_str({m:script.clip_number(nap5_lat_min.value,0,0), s:script.clip_number(nap5_lat_sec.value,0,0,59)}),
  // rem latency
  "nap1_r_lat": () => nap1_r_na.checked ? "N/A" : script.duration_str({m:script.clip_number(nap1_r_lat_min.value,0,0), s:script.clip_number(nap1_r_lat_sec.value,0,0,59)}),
  "nap2_r_lat": () => nap2_r_na.checked ? "N/A" : script.duration_str({m:script.clip_number(nap2_r_lat_min.value,0,0), s:script.clip_number(nap2_r_lat_sec.value,0,0,59)}),
  "nap3_r_lat": () => nap3_r_na.checked ? "N/A" : script.duration_str({m:script.clip_number(nap3_r_lat_min.value,0,0), s:script.clip_number(nap3_r_lat_sec.value,0,0,59)}),
  "nap4_r_lat": () => nap4_r_na.checked ? "N/A" : script.duration_str({m:script.clip_number(nap4_r_lat_min.value,0,0), s:script.clip_number(nap4_r_lat_sec.value,0,0,59)}),
  "nap5_r_lat": () => nap5_r_na.checked ? "N/A" : script.duration_str({m:script.clip_number(nap5_r_lat_min.value,0,0), s:script.clip_number(nap5_r_lat_sec.value,0,0,59)}),
};


// onchange callback fns
script.data[script.key].update = {
  "prev_r_na": () => {toggle('prev_r_lat_visibility');},
  "nap1_r_na": () => {toggle('nap1_visibility');},
  "nap2_r_na": () => {toggle('nap2_visibility');},
  "nap3_r_na": () => {toggle('nap3_visibility');},
  "nap4_r_na": () => {toggle('nap4_visibility');},
  "nap5_r_na": () => {toggle('nap5_visibility');},
};

function toggle(toggle_class) {
  let elements = document.getElementsByClassName(toggle_class);
  for (let element of elements) {
    element.hidden = !element.hidden;
  }
}