import { data, key, Defaults } from "../data.js";
import { get_dt } from "../util.js";


data[key].data = {
  scored_at: Defaults.percent({value:3, precision:0, min:3, max:4}),
  epworth: Defaults.index({precision: 0, min: 0, max: 24}),
  stopbang: Defaults.index({precision: 0, min: 0, max: 8}),
  bmi: Defaults.index({precision: 1}),
  start: Defaults.time(),
  end: Defaults.time(),
  trt: Defaults.duration({h:0, m:0}), // calculated
  tst: Defaults.duration({h:0, m:0}),
  tvt: Defaults.duration({h:0, m:0}),
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
  epworth:  () => epworth_na.checked ? "[]" : DATA.epworth.template.set("epworth"),
  stopbang: () => stopbang_na.checked ? "[]" : DATA.stopbang.template.set("stopbang"),
  bmi:      () => bmi_na.checked ? "[]" : DATA.bmi.template.set("bmi"),
  afib:     () => afib_na.checked ? "not detected" : "detected; total duration: " + DATA.afib_duration.value.toStr(),
}

// non-default onchange callback fns
data[key].update = {
  // NA toggles
  epworth_na:  () => {toggle('epworth_visibility');},
  stopbang_na: () => {toggle('stopbang_visibility');},
  bmi_na:      () => {toggle('bmi_visibility');},
  afib_na:     () => {toggle('afib_visibility');},
  // update calculated fields
  start: update_duration,
  end: update_duration,
  ahi: update_cahi_percent,
  cahi: update_cahi_percent,
  tst: () => {
    update_duration_percent(s_duration_percent, "s_duration_percent", s_duration_min);
    update_duration_percent(od_percent, "od_percent", od_duration);
    update_duration_percent(snore_percent, "snore_percent", snore_min);
  },
  s_duration_min: () => {update_duration_percent(s_duration_percent, "s_duration_percent", s_duration_min)},
  od_duration:    () => {update_duration_percent(od_percent, "od_percent", od_duration)},
  snore_min:      () => {update_duration_percent(snore_percent, "snore_percent", snore_min)},
};

function toggle(toggle_class) {
  let elements = document.getElementsByClassName(toggle_class);
  for (let element of elements) {
    element.hidden = !element.hidden;
  }
}

// calculations for calculated fields

function update_duration() {
  // duration = end - start
  let [s, e] = get_dt("1970-01-01", start.value, end.value);
  DATA.trt.value.set_dt(s, e);
  trt.value = DATA.trt.value;
  trt.dispatchEvent(new Event('calculated'));
}

function update_cahi_percent() {
  // cahi % = cahi / ahi
  let val = 100.0 * Number(DATA.cahi.value) / Number(DATA.ahi.value);
  DATA.cahi_percent.clean.fn(val, "cahi_percent");
}

// get % of minutes / tst
function update_duration_percent(percent, percent_str, minutes) {
  DATA[percent_str].clean.fn(100.0 * (Number(minutes.value)/Number(DATA.tst.value.toMinutes())), percent_str);
  percent.value = DATA[percent_str].value;
  percent.dispatchEvent(new Event('calculated'));
}