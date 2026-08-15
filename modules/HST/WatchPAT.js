import { data, key, Defaults } from "../data.js";


data[key].data = {
  scored_at: Defaults.percent({value:4, precision:0, min:3, max:4}),
  epworth: Defaults.index({precision: 0, min: 0, max: 24}),
  stopbang: Defaults.index({precision: 0, min: 0, max: 8}),
  bmi: Defaults.index({precision: 1}),
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
  snore_percent: Defaults.percent({precision: 1}), // calculated
  snore_min_45db: Defaults.minutes({precision: 1}),
  snore_min_60db: Defaults.minutes({precision: 1}),
  ...data[key].data, // only set things that aren't already set
}
let DATA = data[key].data;

// non-default template setters
data[key].template_set = {
  epworth:  () => epworth_na.checked ? "[]" : DATA.epworth.value.toStr(),
  stopbang: () => stopbang_na.checked ? "[]" : DATA.stopbang.value.toStr(),
  bmi:      () => bmi_na.checked ? "[]" : DATA.bmi.value.toStr(),
  afib:     () => afib_na.checked ? "not detected" : "detected; total duration: " + DATA.afib_duration.value.toStr(),
}

// non-default onchange callback fns
data[key].update = {
  epworth_na:  () => {toggle('epworth_visibility');},
  stopbang_na: () => {toggle('stopbang_visibility');},
  bmi_na:      () => {toggle('bmi_visibility');},
  afib_na:     () => {toggle('afib_visibility');},
};

function toggle(toggle_class) {
  let elements = document.getElementsByClassName(toggle_class);
  for (let element of elements) {
    element.hidden = !element.hidden;
  }
}