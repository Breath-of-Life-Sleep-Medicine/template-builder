import * as script from "/script.js";

// keep updated duration value objects here b/c input.value can't store objects, only string
var duration1_value = {"h":0, "m":0};
var duration2_value = {"h":0, "m":0};

script.get_map = function() {
  let [start, end] = get_dt(date.value, time_started.value, time_ended.value);
  let duration = duration_str((duration2.checked ? duration2_value : duration1_value));

  let map = {
    "scored_at": clip_percent(scored_at.value,0,3,4),
    "start": time_str(start),
    "end": time_str(end),
    "duration": duration,
    "ahi": clip_index(ahi.value),
    "ai": clip_index(ai.value),
    "hi": clip_index(hi.value),
    "s_ahi": clip_index(s_ahi.value),
    "s_duration": duration_str({h:clip_number(s_duration_hr.value,0,0), m:clip_number(s_duration_min.value,0,0,59)}),
    "s_percent": clip_percent(s_percent.value, 1),
    "ox_base": clip_percent(ox_base.value, 0),
    "ox_avg": clip_percent(ox_avg.value, 0),
    "ox_min": clip_percent(ox_min.value, 0),
    "odi": clip_index(odi.value),
    "od_duration": duration_str({h:clip_number(od_duration_hr.value,0,0), m:clip_number(od_duration_min.value,0,0,59)}),
    "od_percent": clip_percent(od_percent.value,0),
    "pulse_min": clip_number(pulse_min.value,0,0),
    "pulse_avg": clip_number(pulse_avg.value,0,0),
    "pulse_max": clip_number(pulse_max.value,0,0),
    "snores": clip_number(snores.value,0,0),
  };

  return map;
}

function update_duration(event) {
  let [start, end] = get_dt("01/01/2000", time_started.value, time_ended.value);
  let d1 = get_duration(start, new Date(end.getTime() - 1000 * 60));
  let d2 = get_duration(start, end);
  duration1_label.textContent = duration_short_str(...Object.values(d1));
  duration2_label.textContent = duration_short_str(...Object.values(d2));
  duration1_value = d1;
  duration2_value = d2;
}

function update_hi(event, ahi, ai, hi) {
  hi.value = ahi.value - ai.value;
  hi.dispatchEvent(new Event('change'));
}

function update_scored_at(event, guidelines, scored_at) {
  scored_at.value = guidelines.value;
}