function clip_number(number, precision = null, min = null, max = null) {
  if (number === "" | number === null) {
    number = 0;
  }
  number = parseFloat(number);
  if (number == "NaN") {
    number = 0;
  }
  if (min != null) {
    number = Math.max(number, min);
  }
  if (max != null) {
    number = Math.min(number, max);
  }
  if (precision != null) {
    number = number.toFixed(precision);
  }
  return number;
}

const clip_index = clip_minutes;

function clip_count(number, precision = 0, min = 0, max = null) {
  return clip_number(number, precision, min, max);
}

function clip_minutes(number, precision = 1, min = 0, max = null) {
  return clip_number(number, precision, min, max);
}

function clip_percent(number, precision=1, min=0, max=100) {
  return clip_number(number, precision, min, max);
}

export {
  clip_number,
  clip_index,
  clip_count,
  clip_minutes,
  clip_percent,
};