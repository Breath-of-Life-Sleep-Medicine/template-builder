import { data, key, Defaults } from "../../../modules/data.js";

// initialization function
// - a function that runs as soon as this script is loaded
// - ex: set default template values
data[key].init = () => {
};

// data objects
// - contain value, type, clean functions, form getters and setters, template setters,
//   and most settings relevant to data
data[key].data = {
  bmi: Defaults.index({precision: 2}),
  scored_at: Defaults.percent({value:3, precision:0, min:3, max:4}),
  start: Defaults.time(),
  end: Defaults.time(),
  trt: Defaults.duration({h:0, m:0}), // calculated: end - start
  tst: Defaults.duration({h:0, m:0}),
  tst_rem: Defaults.duration({h:0, m:0}),
  tst_non_rem: Defaults.duration({h:0, m:0}), // calculated: tst - tst_rem
  ahi: Defaults.index({precision: 1}),
  cahi: Defaults.index({precision: 1}),
  centrals_percent: Defaults.percent({precision: 0}), // calculated: 100 * cahi / ahi
  odi: Defaults.index({precision: 1}),
  rem_ahi: Defaults.index({precision: 1}),
  ox_avg: Defaults.percent({precision: 1}),
  ox_min: Defaults.percent({precision: 1}),
  od_duration: Defaults.minutes({precision: 0}),
  pulse_min: Defaults.pulse({precision: 0}),
  pulse_avg: Defaults.pulse({precision: 0}),
  pulse_max: Defaults.pulse({precision: 0}),
  s_ahi: Defaults.index({precision: 1}),
  s_duration_min: Defaults.minutes({precision: 0}),
  s_duration_percent: Defaults.percent({precision: 0}), // calculated: floor(100 * s_duration_min / tst)
  has_snoring: Defaults.string({value: "unknown"}),
  // has_snoring options: unknown, true, false
    // unknown: "[]"
    // true: "was detected"
    // false: "was not detected"
  ...data[key].data, // to only set things that aren't already set
};

// update functions
// - automatically runs on item when it is changed in the form (runs after clean function)
// - ex: sum two inputs into another input when their values change
data[key].update = {
};

// non-default template setter functions
// - runs only when moving data into the template
// - for each id, if this is set, this setter function will run INSTEAD of the default template setter
data[key].template_set = {
};

// functions that return the default data value
data[key].default = {
};