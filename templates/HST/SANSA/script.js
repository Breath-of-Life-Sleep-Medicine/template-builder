import { data, key, Defaults } from "../../../modules/data.js";
import { get_dt } from "../../../modules/util.js";

// initialization function
// - a function that runs as soon as this script is loaded
// - ex: set default template values
data[key].init = () => {
  // update labels
  data[key].scored_at = Defaults.percent({value:3, precision:0, min:3, max:4});
  data[key].scored_at.clean.fn(3, "scored_at");
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
  od_duration_min: Defaults.minutes({precision: 0}),
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
let DATA = data[key].data;

// clean function
DATA.has_snoring.clean.fn = (value, id, k=key) => {
  let d = data[k].data[id];
  d.value = value.trim();
  if (d.value == "true" || d.value == "false")
    return;
  d.value = "unknown";
}

// clean:{fn:clean_fn=clean_date, on:clean_on=true, change:clean_change=true}

// update functions
// - automatically runs on item when it is changed in the form (runs after clean function)
// - ex: sum two inputs into another input when their values change
data[key].update = {
  // NA toggles
  bmi_na: () => {toggle('bmi_visibility');},
  // update calculated fields
  start: update_trt,
  end: update_trt,
  ahi: update_centrals_percent,
  cahi: update_centrals_percent,
  tst_rem: update_tst_non_rem,
  s_duration_min: update_supine_time,
  tst: () => {
    update_tst_non_rem();
    update_supine_time();
  },
};

// non-default template setter functions
// - runs only when moving data into the template
// - for each id, if this is set, this setter function will run INSTEAD of the default template setter
data[key].template_set = {
  bmi: () => bmi_na.checked ? "[]" : DATA.bmi.template.set("bmi"),
  has_snoring: () => {
    switch (DATA.has_snoring.value) {
      case "unknown":
        return "[] detected";
      case "true":
        return "was detected";
      case "false":
        return "was not detected";
      default:
        return "[] detected";
    }
  },
};

// functions that return the default data value
data[key].default = {
  has_snoring: () => "unknown",
};

function toggle(toggle_class) {
  let elements = document.getElementsByClassName(toggle_class);
  for (let element of elements) {
    element.hidden = !element.hidden;
  }
}

// calculations for calculated fields

function update_trt() {
  // duration = end - start
  let [s, e] = get_dt("1970-01-01", start.value, end.value);
  DATA.trt.value.set_dt(s, e);
  trt.value = DATA.trt.value;
  trt.dispatchEvent(new Event('calculated'));
}

function update_centrals_percent() {
  let val = 100.0 * Number(DATA.cahi.value) / Number(DATA.ahi.value);
  DATA.centrals_percent.clean.fn(val, "centrals_percent");
}

function update_supine_time() {
  let val = Math.floor(100.0 * Number(DATA.s_duration_min.value.m) / Number(DATA.tst.value.toMinutes()));
  DATA.s_duration_percent.clean.fn(val, "s_duration_percent");
  s_duration_percent.value = DATA.s_duration_percent.value;
  s_duration_percent.dispatchEvent(new Event('calculated'));
}

function update_tst_non_rem() {
  subtract_durations(DATA.tst_non_rem.value, DATA.tst.value, DATA.tst_rem.value);
  DATA.tst_non_rem.clean.fn(DATA.tst_non_rem.value, "tst_non_rem");
  tst_non_rem.value = DATA.tst_non_rem.value;
  tst_non_rem.dispatchEvent(new Event('calculated'));
}

// store l - r into result and return result
// could rewrite to be smart actually
function subtract_durations(result, l, r) {
  let s = Number(l.toSeconds() - r.toSeconds());
  if (result.h !== null) {
    result.h = Math.floor(s/60/60);
  }
  if (result.m !== null) {
    result.m = Math.floor(s/60 - result.h*60);
  }
  if (result.s !== null) {
    result.s = Math.floor(s - result.m*60 - result.h*60*60);
  }
  return result;
}