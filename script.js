document.getElementById("formID").addEventListener("submit", submit_copy);

const zero_pad = (num, places) => String(num).padStart(places, '0');

function initialize() {
  const CalculatedElements = document.querySelectorAll(".calculated");
  CalculatedElements.forEach(element =>{
    element.disabled = true;
    element.addEventListener('mouseover', function(event){
      element.disabled = false;
    });
    element.addEventListener('mouseout', function(event) {
      element.disabled = true;
    });
  });
}

function save(data) {
  sessionStorage.setItem("data", JSON.stringify(data));
}

function load() {
  return JSON.parse(sessionStorage.getItem("data"));
}

// convert yyyy-mm-dd string to mm/dd/yyyy string
// ex: 2025-05-20 to 05/20/2025
function date_str(s) {
  return s.slice(5).replace(/-/g, "/") + "/" + s.slice(0, 4);
}

// convert dt into hh:mm format string
function time_str(dt) {
  return dt.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

// convert 24 hour formatted time string to 12 hour time string
// ex: 17:31 to 5:31 PM
function time_24_to_12 (time) {
  let hours = parseInt(time.slice(0, 2));
  let suffix = hours < 12 ? " AM": " PM";
  hours = (hours + 11) % 12 + 1;
  return zero_pad(hours, 2) + time.slice(2) + suffix;
}

// start is a dt
// end is a dt
// return duration in hours & minutes
function get_duration(start_dt, end_dt) {
  let d,h,m;
  d = end_dt - start_dt;
  h = Math.floor(d/1000/60/60);
  m = Math.floor(d/1000/60 - h*60);
  return {h, m};
}

// {h:4, m:0} -> 4 hours 0 minutes
// {h:0, m:0} -> 0 minutes
// {h:1, m:1} -> 1 hour 1 minute
function duration_str({h, m, s}) {
  let str = [];
  if (h > 0 || (m === undefined && s === undefined)) {
    str.push(`${h} hour${(h!=1)?"s":""}`);
  }
  if (m > 0 || s === undefined) {
    str.push(`${m} minute${(m!=1)?"s":""}`);
  }
  if (s !== undefined) {
    str.push(`${s} second${(s!=1)?"s":""}`);
  }
  return str.join(" ");
}

// converts {h, m} object into ...h:mm format string
// converts {m, s} object into ...m:ss format string
// converts {h, m, s} object into ...h:mm:ss format string
function duration_short_str(v1, v2, v3=null) {
  return (v3 === null) ? `${v1}:${zero_pad(v2,2)}` : `${v1}:${zero_pad(v2,2)}:${zero_pad(v3,2)}`;
}

function load_form(event) {
  $("#form_container").load("forms/"+template.value+".html");
}

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

function validate(event, precision = null, min = null, max = null) {
  this.value = clip_number(this.value, precision, min, max);
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

// console.log(get_datetimes("2025-05-20", "21:30"))

function find_replace(str) {
  let map = {
    "date": date_str(date.value),
    "referring": referring.value,
    "provider": provider.value,
    ...get_map() // form html needs to define get_map()
  }; 

  // regex literal: /pattern/flags
  // - better performance, but not dynamic
  // regex constructor: new RegExp("pattern", "flags")
  // - for dynamic patterns; patterns from strings

  // find all ${...} matches in text look up value in map using key
  let pattern = /\${(\S+?)}/gm
  // console.log(str.match(pattern)); // see all keys in template
  str = str.replace(pattern, function(_,key){return map[key];});
  console.log(str);

  return str;
}

function submit_copy(event) {
  load_txt_file("templates/"+template.value+".txt")
    .then(content => copy_to_clipboard(find_replace(content)))
    .catch(error => console.error("error loading file: ", error));
  // do not clear the form
  event.preventDefault();
  return false;
}

async function copy_to_clipboard(txt) {
  try {
    await navigator.clipboard.writeText(txt);
    console.log('Text successfully copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

async function load_txt_file(file_path) {
  const response = await fetch(file_path);
  const txt = await response.text();
  return txt;
}