import { data, key, Defaults } from "../data.js";
import { get_dt } from "../util.js";
import { get_duration, duration_short_str } from "../duration.js";
import { clip_percent } from "../clip.js";

// updated duration value objects
let duration1_value = {"h":0, "m":0};
let duration2_value = {"h":0, "m":0};

data[key].init = () => {
  update_scored_at();
};

data[key].data = {
  scored_at: Defaults.percent({value:4, precision:0, min:3, max:4}),
  start: Defaults.time(),
  end: Defaults.time(),
  duration: Defaults.duration({h:0, m:0}),
  ahi: Defaults.index(),
  ai: Defaults.index(),
  hi: Defaults.index(),
  s_ahi: Defaults.index(),
  s_duration: Defaults.duration({h:0, m:0}),
  s_percent: Defaults.percent(),
  ox_base: Defaults.percent({precision: 0}),
  ox_avg: Defaults.percent({precision: 0}),
  ox_min: Defaults.percent({precision: 0}),
  odi: Defaults.index(),
  od_duration: Defaults.duration({h:0, m:0}),
  od_percent: Defaults.percent({precision: 0}),
  pulse_min: Defaults.pulse({precision: 0}),
  pulse_avg: Defaults.pulse({precision: 0}),
  pulse_max: Defaults.pulse({precision: 0}),
  snores: Defaults.count(),
  ...data[key].data, // only set things that aren't already set
}

const DATA = data[key].data;
DATA.duration.form.get = () => {
  set_duration();
  return DATA.duration.value;
};
DATA.duration.form.set = () => {};
// DATA.duration.form.set = (id) => {console.error(`TRYING TO SET DURATION (FORM) TO ${JSON.stringify(DATA.duration.value)}`)};

data[key].update = {
  "start": update_duration,
  "end": update_duration,
  "duration1": set_duration,
  "duration2": set_duration,
  "ahi": update_hi,
  "ai": update_hi,
  "guidelines": () => {
    data[key].data.scored_at.value = clip_percent(guidelines.value,0,3,4);
    update_scored_at();
  },
};

// TODO: fix this
// issue: d1 can be 60 when d2 is 0 (in this case both would be 0)
function update_duration() {
  let [s, e] = get_dt("01/01/2000", start.value, end.value);
  let d1 = get_duration(s, new Date(e.getTime() - 1000 * 60));
  let d2 = get_duration(s, e);
  duration1_label.textContent = duration_short_str(...Object.values(d1));
  duration2_label.textContent = duration_short_str(...Object.values(d2));
  duration1_value = d1;
  duration2_value = d2;
  set_duration();
}

function update_hi() {
  hi.value = ahi.value - ai.value;
  hi.dispatchEvent(new Event('calculated'));
}

function update_scored_at() {
  label_scored_at.textContent = data[key].data.scored_at.value;
}

function set_duration() {
  data[key].data.duration.value.set((duration1.checked) ? duration1_value : duration2_value);
}