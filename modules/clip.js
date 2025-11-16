import { round } from "./util.js";

function clip_number(number, precision = null, min = null, max = null, fn=Math.floor) {
  if (number === "" | number === null) {
    number = 0;
  }
  number = parseFloat(number);
  if (isNaN(number)) {
    number = 0;
  }
  if (min != null) {
    number = Math.max(number, min);
  }
  if (max != null) {
    number = Math.min(number, max);
  }
  if (precision != null) {
    number = round(number, precision, fn).toFixed(precision);
  }
  return number;
}

const clip_index = clip_minutes;

function clip_count(number, precision = 0, min = 0, max = null, fn=Math.floor) {
  return clip_number(number, precision, min, max, fn);
}

function clip_minutes(number, precision = 1, min = 0, max = null, fn=Math.floor) {
  return clip_number(number, precision, min, max, fn);
}

function clip_percent(number, precision=1, min=0, max=100, fn=Math.floor) {
  return clip_number(number, precision, min, max, fn);
}

export {
  clip_number,
  clip_index,
  clip_count,
  clip_minutes,
  clip_percent,
};