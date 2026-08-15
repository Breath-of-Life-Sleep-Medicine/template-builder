import { data, key, Defaults } from "../data.js";
// import { get_dt } from "../util.js";
// import { get_duration, duration_short_str } from "../duration.js";
// import { clip_percent } from "../clip.js";


data[key].init = () => {
  update_scored_at();
};

data[key].data = {
  scored_at: Defaults.percent({value:4, precision:0, min:3, max:4}),
  start: Defaults.time(),
  end: Defaults.time(),
  trt: Defaults.duration({h:0, m:0}), // calculated
  tst: Defaults.duration({h:0, m:0}),
  tst_rem: Defaults.percent({precision: 1}),
  tst_deep: Defaults.percent({precision: 2}),
  ahi: Defaults.index({precision: 1}),
  rdi: Defaults.index({precision: 1}),
  cahi: Defaults.index({precision: 1}),
  cahi_percent: Defaults.percent({precision: 0}), // calculated
  s_ahi: Defaults.index({precision: 1}),
  s_duration_min: Defaults.minutes({precision: 1}),
  s_duration_percent: Defaults.percent({precision: 1}), // calculated
  ox_avg: Defaults.percent({precision: 0}),
  ox_min: Defaults.percent({precision: 0}),
  odi: Defaults.index({precision: 1}),
  od_duration: Defaults.minutes({precision: 1}),
  od_percent: Defaults.percent({precision: 1}), // calculated
  pulse_avg: Defaults.pulse({precision: 0}),
  pulse_min: Defaults.pulse({precision: 0}),
  pulse_max: Defaults.pulse({precision: 0}),
  afib_duration: Defaults.duration({h: 0, m: 0, s: 0}),
  snore_min: Defaults.minutes({precision: 1}),
  snore_percent: Defaults.percent({precision: 1}),
  snore_min_45db: Defaults.minutes({precision: 1}),
  snore_min_60db: Defaults.minutes({precision: 1}),
  ...data[key].data, // only set things that aren't already set
}

// epworth_na
// stopbang_na
// bmi_na
// afib_na
// afib_duration

// date
// referring
// provider

// epworth
// stopbang
// bmi

// scored_at

// start
// end
// trt - calculated

// tst
// tst_rem
// tst_deep

// ahi
// rdi
// cahi
// cahi_percent - calculated

// s_ahi
// s_duration_min
// s_duration_percent - calculated

// ox_avg
// ox_min
// odi
// od_duration
// od_percent - calculated

// pulse_avg
// pulse_min
// pulse_max

// afib

// snore_min
// snore_percent - calculated
// snore_min_45db
// snore_min_60db