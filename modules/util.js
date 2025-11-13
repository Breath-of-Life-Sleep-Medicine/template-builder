const SCORE_LABEL = {
  3: "AASM",
  4: "CMS",
};

const zero_pad = (num, places) => String(num).padStart(places, '0');

// given a number as a string
// return the number of decimal places
function decimal_places(number_str) {
  let decimal_places = number_str.indexOf('.');
  return (decimal_places >= 0) ? number_str.length - decimal_places - 1 : 0;
}

// Source - https://stackoverflow.com/a
// Posted by Billy Moon, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-07, License - CC BY-SA 4.0
function round(value, precision = 0, func = Math.round) {
  let multiplier = Math.pow(10, precision || 0);
  return func(value * multiplier) / multiplier;
}

/******************************************************************************
Desc: convert a series of time strings into Date objects (datetime)
Input:
- start_date: date of the first time as a string (ex: "2025-05-20")
- ...times: times to convert to datetimes (in sequential order) (ex: "21:54")
Output: returns the times as an array of Date objects (datetimes)
Assumes:
- less than 24 hours passing between any 2 adjacent times
******************************************************************************/
function get_dt(start_date, ...times) {
  if (!start_date) start_date = "2025-01-01"; // this will give inaccurate dates, but accurate times
  let dts = [];
  if (times.length == 0) {return dts;}
  dts.push(new Date(start_date + " " + times[0]));
  for (let i = 1; i < times.length; ++i) {
    let next = new Date(dts.at(-1).toDateString() + " " + times[i]);
    if (next < dts.at(-1)) {
      next.setDate(next.getDate() + 1); // increment date by 1 day
    }
    dts.push(next);
  }
  return dts;
}

// convert yyyy-mm-dd string to mm/dd/yyyy string
// ex: 2025-05-20 to 05/20/2025
function date_str(s) {
  return s.slice(5).replace(/-/g, "/") + "/" + s.slice(0, 4);
}

// convert dt into hh:mm format string
function time_str(dt) {
  return dt.toLocaleTimeString([], {hour: "numeric", minute: "2-digit"});
}

// convert 24 hour formatted time string to 12 hour time string
// ex: 17:31 to 5:31 PM
function time_24_to_12 (time) {
  let hours = parseInt(time.slice(0, 2));
  let suffix = hours < 12 ? " AM": " PM";
  hours = (hours + 11) % 12 + 1;
  return hours + time.slice(2) + suffix;
}

export {
  SCORE_LABEL,
  zero_pad,
  decimal_places,
  round,
  get_dt,
  date_str,
  time_str,
  time_24_to_12,
};