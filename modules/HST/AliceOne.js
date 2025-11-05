import * as script from "../../script.js";
import * as util from "../util.js";

script.data[script.key].clean = {
  "trt": () => script.clip_minutes(trt.value),
  "ahi": () => script.clip_index(ahi.value),
  "ai": () => script.clip_index(ai.value), // calculate
  "hi": () => script.clip_index(hi.value),
  "ox_avg": () => script.clip_percent(ox_avg.value),
  "ox_min": () => script.clip_percent(ox_min.value),
  "odi": () => script.clip_index(odi.value),
  "od_duration": () => script.clip_minutes(od_duration.value),
  "pulse_min": () => script.clip_number(pulse_min.value, 1, 0),
  "pulse_avg": () => script.clip_number(pulse_avg.value, 1, 0),
  "pulse_max": () => script.clip_number(pulse_max.value, 1, 0),
  "snores": () => script.clip_number(snores.value, 0, 0),
};

script.data[script.key].update = {
  "start": () => {util.update_end(start, end, trt)},
  "trt": () => {util.update_end(start, end, trt)},
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

script.data[script.key].template_set = {
  "start": () => script.time_24_to_12(start.value),
  "end": () => script.time_24_to_12(end.value), // calculate
}

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('change'));
}