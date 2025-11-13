import { data, key, time_24_to_12 } from "../../script.js";
import { update_end } from "../form.js";
import { clip_number, clip_index, clip_minutes, clip_percent } from "../clip.js";

data[key].clean = {
  "trt": () => clip_minutes(trt.value),
  "ahi": () => clip_index(ahi.value),
  "ai": () => clip_index(ai.value), // calculate
  "hi": () => clip_index(hi.value),
  "ox_avg": () => clip_percent(ox_avg.value, 0),
  "ox_min": () => clip_percent(ox_min.value, 0),
  "odi": () => clip_index(odi.value),
  "od_duration": () => clip_minutes(od_duration.value),
  "pulse_min": () => clip_number(pulse_min.value, 0, 0),
  "pulse_avg": () => clip_number(pulse_avg.value, 1, 0),
  "pulse_max": () => clip_number(pulse_max.value, 0, 0),
  "snores": () => clip_number(snores.value, 0, 0),
};

data[key].update = {
  "start": () => {update_end(start, end, trt)},
  "trt": () => {update_end(start, end, trt)},
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

data[key].template_set = {
  "start": () => time_24_to_12(start.value),
  "end": () => time_24_to_12(end.value), // calculate
}

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('calculated'));
}