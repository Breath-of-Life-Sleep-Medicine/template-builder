import * as script from "../../script.js";

// updated duration value objects
let duration1_value = {"h":0, "m":0};
let duration2_value = {"h":0, "m":0};

script.data[script.key].init = () => {
  update_scored_at();
};

script.data[script.key].data = {
  scored_at: script.Defaults.number.percent({value:4, precision:0, min:3, max:4}),
  start: script.Defaults.time(),
  end: script.Defaults.time(),
  duration: script.Defaults.duration({h:0, m:0}),
  ahi: script.Defaults.number.index(),
  ai: script.Defaults.number.index(),
  hi: script.Defaults.number.index(),
  s_ahi: script.Defaults.number.index(),
  s_duration: script.Defaults.duration({h:0, m:0}),
  s_percent: script.Defaults.number.percent(),
  ox_base: script.Defaults.number.percent({precision: 0}),
  ox_avg: script.Defaults.number.percent({precision: 0}),
  ox_min: script.Defaults.number.percent({precision: 0}),
  odi: script.Defaults.number.index(),
  od_duration: script.Defaults.duration({h:0, m:0}),
  od_percent: script.Defaults.number.percent({precision: 0}),
  pulse_min: script.Defaults.number.pulse({precision: 0}),
  pulse_avg: script.Defaults.number.pulse({precision: 0}),
  pulse_max: script.Defaults.number.pulse({precision: 0}),
  snores: script.Defaults.number.count(),
}

script.data[script.key].update = {
  "start": update_duration,
  "end": update_duration,
  "duration1": set_duration,
  "duration2": set_duration,
  "ahi": update_hi,
  "ai": update_hi,
  "guidelines": () => {
    script.data[script.key].data.scored_at.value = script.clip_percent(guidelines.value,0,3,4);
    update_scored_at();
  },
};

function update_duration() {
  let [s, e] = script.get_dt("01/01/2000", start.value, end.value);
  let d1 = script.get_duration(s, new Date(e.getTime() - 1000 * 60));
  let d2 = script.get_duration(s, e);
  duration1_label.textContent = script.duration_short_str(...Object.values(d1));
  duration2_label.textContent = script.duration_short_str(...Object.values(d2));
  duration1_value = d1;
  duration2_value = d2;
}

function update_hi() {
  hi.value = ahi.value - ai.value;
  hi.dispatchEvent(new Event('calculated'));
}

function update_scored_at() {
  label_scored_at.textContent = script.data[script.key].data.scored_at.value;
}

function set_duration() {
  script.data[script.key].data.duration = (duration1.checked) ? duration1_value : duration2_value;
}