import { data, key } from "../../script.js";
import { clip_number, clip_index, clip_minutes, clip_percent } from "../clip.js";

// ids that have no onchange callback fn; can still trigger update w/o clean
data[key].no_change = [
  "scored_at",
];

// callback fn when data is extracted from a field
data[key].clean = {
  "scored_at": () => clip_percent(scored_at.value, 0, 3, 4),
  "duration": () => clip_minutes(duration.value),
  "ahi": () => clip_index(ahi.value),
  "ai": () => clip_index(ai.value), // calculate
  "hi": () => clip_index(hi.value),
  "s_ahi": () => clip_index(s_ahi.value),
  "s_percent": () => clip_percent(s_percent.value),
  "ox_avg": () => clip_percent(ox_avg.value),
  "ox_min": () => clip_percent(ox_min.value),
  "odi": () => clip_index(odi.value),
  "od_duration": () => clip_minutes(od_duration.value),
  "pulse_min": () => clip_number(pulse_min.value, 1, 0),
  "pulse_avg": () => clip_number(pulse_avg.value, 1, 0),
  "pulse_max": () => clip_number(pulse_max.value, 1, 0),
  "snores": () => clip_number(snores.value, 0, 0),
};

// update function that is called after clean in onchange callback fn
data[key].update = {
  "scored_at": update_scored_at,
  "ahi": () => {update_ai(ahi, ai, hi);},
  "hi": () => {update_ai(ahi, ai, hi);},
};

function update_ai(ahi, ai, hi) {
  ai.value = ahi.value - hi.value;
  ai.dispatchEvent(new Event('calculated'));
}

function update_scored_at() {
  label_scored_at.textContent = scored_at.value;
}