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
  // bmi
  // scored_at
  // start
  // end
  // duration // calculated
  // tst
  // tst_rem
  // tst_non_rem
  // ahi
  // cahi
  // centrals_percent // calculated
  // odi
  // rem_ahi
  // ox_avg
  // ox_min
  // od_duration
  // pulse_min
  // pulse_avg
  // pulse_max
  // s_ahi
  // s_duration_min
  // s_duration_percent // caculated
  // has_snoring
  // has_snoring options: null/unknown, true, false
    // null/unknown: "[]"
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