let key = null;           // key for active template data
let key_global = "index"; // key for global data
let data = {};
let path_base;

// enum-esque object of types
const Type = Object.freeze({
  COUNT: Symbol('count'),
  INDEX: Symbol('index'),
  PERCENT: Symbol('percent'),
  PULSE: Symbol('pulse'),
  DATE: Symbol('date'),
  TIME: Symbol('time'),
  DURATION: Symbol('duration'),
  STRING: Symbol('string'),
});

// default values for data objects
const Defaults = {
  number: {
    count: ({value=0, min=0, precision=0}={}) => ({value, min, precision, type:Type.COUNT}),
    index: ({value=0, min=0, precision=1, unit="evt/hr"}={}) => ({value, min, precision, unit, type:Type.INDEX}),
    percent: ({value=0, min=0, max=100, precision=1, unit="%"}={}) => ({value, min, max, precision, unit, type:Type.PERCENT}),
    pulse: ({value=0, min=0, precision=1, unit="bpm"}={}) => ({value, min, precision, unit, type:Type.PULSE}),
  },
  date: ({value = new Date(1970,1,1)}={}) => ({value, type:Type.DATE}),
  time: ({value = new Date(1970,1,1)}={}) => ({value, type:Type.TIME}),
  duration: ({h=null, m=null, s=null}={}) => ({value: new Duration({h, m, s}), type:Type.DURATION}),
  string: ({value=""}={}) => ({value, type:Type.STRING}),
};

class Duration {
  // - h: hours
  // - m: minutes
  // - s: seconds
  // for h, m, s:
  // - initialize/set to non-null value (ex: 0) to track
  // - initialize/set to null to untrack
  // example: new Duration({h:0, m:0}) will only track hours and minutes, not seconds
  constructor ({h=null, m=null, s=null}={}) {
    this.h = h;
    this.m = m;
    this.s = s;
  }
  set({h=null, m=null, s=null}={}) {
    let input = {h, m, s};
    let high_set = false;
    for (let [k,v] of input.fromEntries()) {
      if (v === null) {
        this[k] = null;
      } else if (high_set) {
        this[k] = clip_count(v,0,0,59);
      } else {
        this[k] = clip_count(v,0,0);
        high_set = true;
      }
    }
  }
  set(start_dt, end_dt) {
    let d = end_dt - start_dt;
    if (this.h !== null) {
      this.h = Math.floor(d/1000/60/60);
    }
    if (this.m !== null) {
      this.m = Math.floor(d/1000/60 - this.h*60);
    }
    if (this.s !== null) {
      this.s = Math.floor(d/1000 - this.m*60 - this.h*60*60);
    }
  }
  toStr() {
    let str = [];
    if (this.h > 0 || (this.m === null && this.s === null)) {
      str.push(`${this.h} hour${(this.h!=1)?"s":""}`);
    }
    if (this.m > 0 || this.s === null) {
      str.push(`${this.m} minute${(this.m!=1)?"s":""}`);
    }
    if (this.s !== null) {
      str.push(`${this.s} second${(this.s!=1)?"s":""}`);
    }
    return str.join(" ");
  }
  toStrShort() {
    return [this.h, this.m, this.s].filter((v)=>v!==null).map((v) => zero_pad(v,2)).join(":");
  }
}

// document ready function (short version)
$(function(){
  // URL/index.html to URL
  path_base = document.location.pathname.split('/');
  path_base.pop();
  path_base = path_base.join('/');

  load_script(key_global); // initialize data for main form
  load_form();             // load sub-form & initialize its data

  // event listeners
  formID.addEventListener("submit", submit_copy);

  // mutation observer - detect changes to the DOM
  const config = {attributes: false, childList: true, subtree: false};
  const observer = new MutationObserver(initialize);
  observer.observe(form_container, config);
  // to stop observing
  //observer.disconnect();
});

// create empty data object for this template key
// assumes key is already set
data.init = (k=key) => {
  if (!(k in data)) {
    data[k] = {};
    data[k].init = () => {};
    data[k].data = {};
    data[k].no_change = [];
    data[k].clean = {};
    data[k].update = {};
    data[k].template_set = {};
  }
}

data.typeof = (id, k=key) => {
  return data[k]?.data[id]?.type;
}

// given new input value, clean the input & set the data
data.clean = (id, k=key) => {
  let d = data[k]?.data[id];
  if (d === undefined) {
    console.error(`cannot clean undefined data[${k}].data[${id}]`);
    return;
  }
  switch(data.typeof(id, k)) {
    case Type.STRING:
      return (value) => { d.value =  value.trim(); };
    case Type.DATE:
      return (value) => {
        let v = value.split("-");
        d.value.setYear(v[0]);
        d.value.setMonth(v[1]-1);
        d.value.setDate(v[2]);
      };
    case Type.TIME:
      return (value) => {
        let v = value.split(":");
        d.value.setHours(v[0]);
        d.value.setMinutes(v[1]);
      };
    case Type.DURATION:
      return ({h=null, m=null, s=null}) => {d.value.set({h,m,s});};
    default: // number
      return (value) => {d.value = clip_number(value, d.precision, d.min, d.max);};
  }
}

// data > form generic convert
data.form_value = (id, k=key) => {
  let d = data[k]?.data[id];
  if (d === undefined) {
    console.error(`cannot get form value of undefined data[${k}].data[${id}]`);
    return;
  }
  switch(data.typeof(id, k)) {
    case Type.STRING:
      return () => d.value;
    case Type.DATE:
      return () => {
        return `${zero_pad(d.value.getFullYear(), 4)}-${zero_pad(d.value.getMonth() + 1, 2)}-${zero_pad(d.value.getDate(), 2)}`;
      };
    case Type.TIME:
      return () => {
        return `${zero_pad(d.value.getHours(),2)}:${zero_pad(d.value.getMinutes(),2)}`;
      };
    case Type.DURATION:
      return () => ({h: d.value.h, m: d.value.m, s: d.value.s});
    default: // number
      return () => Number(d.value).toFixed(d.precision);
  }
}

// data > template generic convert
data.template_value = (id, k=key) => {
  let d = data[k]?.data[id];
  if (d === undefined) {
    console.error(`cannot get template value of undefined data[${k}].data[${id}]`);
    return;
  }
  switch(data.typeof(id, k)) {
    case Type.STRING:
      return () => d.value;
    case Type.DATE:
      return () => {
        return `${d.value.getMonth() + 1}/${d.value.getDate()}/${d.value.getFullYear()}`;
      };
    case Type.TIME:
      return () => time_str(d.value);
    case Type.DURATION:
      return () => d.value.toStr();
    default: // number
      return () => Number(d.value).toFixed(d.precision);
  }
}

// https://getbootstrap.com/docs/5.3/components/alerts/
function append_alert (msg, type="secondary") {
  let time = (new Date()).toLocaleTimeString([], {hour12: false});
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible p-1 d-flex align-items-center" role="alert">`,
    `  <div class="d-flex">`,
    `    <div>${time}</div>`,
    `    <div>${msg}</div>`,
    `  </div>`,
    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('');
  submit_alert.append(wrapper);
}

// returns a map of keywords to values for replacing keywords in the template
function get_map(k=key) {
  // priority: data > template_set > clean
  // where template_set and clean are functions and data is a value
  // no need to remove values, last defined will be set
  // let clean = Object.fromEntries(Object.entries(data[k].clean).map(([k,v])=>[k, v()]));
  let template_set = Object.fromEntries(Object.entries(data[k].template_set).map(([k,v])=>[k, v()]));
  let d = Object.fromEntries(Object.keys(data[k].data).map((id)=>[id, data.template_value(id, k)()]));
  return {...template_set, ...d};
}

// get data from metadata
function metadata(name) {
  const meta = document.querySelector('meta[name="'+name+'"]');
  return meta ? meta.content : undefined;
}

function initialize() {
  let cls = document.getElementsByClassName("calculated");
  for (let elem of cls) {
    if (elem.type == "text" && elem.inputMode == "numeric") {
      elem.type = "number";
      // TODO: make a precision associated with the input field in the js files; luckily or not, all the calculated fields atm are 0.1 precision
      elem.step = "0.1";
      elem.addEventListener("calculated", () => {
        // clipped to hard min/max in change event
        let v = Number(elem.value);
        let precision = decimal_places(elem.step);
        elem.value = v.toFixed(precision);
        elem.min = (v - Number(elem.step)).toFixed(precision);
        elem.max = (v + Number(elem.step)).toFixed(precision);
        elem.dispatchEvent(new Event("change"));
      });
    } else if (elem.type == "time") {
      elem.addEventListener("change", () => {
        // clip calculated time changes to their set max and min
        // what if max or min aren't set?
        let v = new Date("2025-01-01 " + elem.value).getTime();
        let min = new Date("2025-01-01 " + elem.min).getTime();
        let max = new Date("2025-01-01 " + elem.max).getTime();
        elem.value = new Date (Number(clip_count(v, 0, min, max))).toTimeString().slice(0,5);
      });
      elem.addEventListener("calculated", () => {
        let v = new Date("2025-01-01 " + elem.value).getTime();
        elem.min = new Date(v - 1000*60).toTimeString().slice(0,5);
        elem.max = new Date(v + 1000*60).toTimeString().slice(0,5);
      });
    }
  }
}

const zero_pad = (num, places) => String(num).padStart(places, '0');

// Source - https://stackoverflow.com/a
// Posted by Billy Moon, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-07, License - CC BY-SA 4.0
function round(value, precision = 0, func = Math.round) {
  let multiplier = Math.pow(10, precision || 0);
  return func(value * multiplier) / multiplier;
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

// on change:
// 1. clean input
// 2. set data & input value
// 3. call update fn
function add_onchange_listeners(ids, k=key, update_only = false) {
  for (const id of ids) {
    let elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("change", () => {
        if (!update_only) {
          data.clean(id,k)(elem.value);
          elem.value = data.form_value(id,k)();
        }
        if (id in data[k].update) {
          data[k].update[id]();
        }
      });
    }
  }
}

function load_script(k=key) {
  data.init(k); // create empty data object if necessary
  const script = document.createElement('script');
  script.src = path_base + "/modules/"+k+".js";
  script.type = "module";
  script.onload = () => {
    data[k].init();
    // add onchange event listeners
    let ids;
    const d = new Set(Object.keys(data[k].data));
    ids = d;
    // const no_change = new Set(data[key].no_change);
    // ids = d.difference(no_change);
    add_onchange_listeners(ids,k);
    const update = new Set(Object.keys(data[k].update));
    ids = update.difference(ids);
    add_onchange_listeners(ids,k,true);
  };
  document.body.appendChild(script);
}

// onchange callbacks are generated from {clean - no_change}, or {update - clean}
function load_form() {
  key = template.value;
  let path = "forms/"+key+".html";
  let id = "form_container";
  fetch(path)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error. status: ${response.status}`);
    }
    return response.text();
  })
  .then(form => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.innerHTML = form;
    } else {
      console.error(`Element with ID ${id} not found.`);
    }
    // script tags cannot be inserted via "innerHTML" to prevent XSS attacks
    load_script(key);
  })
  .catch(error => {
    console.error("error with fetch operation:", error);
  });
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

function find_replace(str) {
  let map = {
    ...get_map(key_global),
    ...get_map(key)
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

  // file may be lf or crlf
  if (is_windows()) {
    str = str.replace(/\r\n|\n/gm, "\r\n");
  } else {
    str = str.replace(/\r\n|\n/gm, "\n");
  }

  return str;
}

// return true if OS is windows, o/w false
function is_windows() {
  return (navigator.userAgent.indexOf("Win") !== -1);
}

function submit_copy(event) {
  load_txt_file(path_base + "/templates/"+template.value+".txt")
    .then(content => copy_to_clipboard(find_replace(content)))
    .catch(error => console.error("error loading file: ", error));
  // do not clear the form
  event.preventDefault();
  append_alert("Copied template to clipboard.", "success");
  return false;
}

async function copy_to_clipboard(txt) {
  try {
    await navigator.clipboard.writeText(txt);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

async function load_txt_file(file_path) {
  const response = await fetch(file_path);
  const txt = await response.text();
  return txt;
}

// given a number as a string
// return the number of decimal places
function decimal_places(number_str) {
  let decimal_places = number_str.indexOf('.');
  return (decimal_places >= 0) ? number_str.length - decimal_places - 1 : 0;
}

export {
  data,
  key,
  key_global,
  Defaults,
  Duration,
  submit_copy,
  load_form,
  decimal_places,
  zero_pad,
  // cleaning
  clip_number,
  clip_index,
  clip_minutes,
  clip_percent,
  clip_count,
  // date / time
  get_dt,
  date_str,
  time_str,
  time_24_to_12,
  get_duration,
  duration_str,
  duration_short_str,
  // for testing
  find_replace,
};
