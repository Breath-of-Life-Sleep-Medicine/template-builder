import { Duration } from "./duration.js";
import { time_str, zero_pad } from "./util.js";
import { clip_number } from "./clip.js";
// import { update_rdi } from "./form.js";

let key = null;           // key for active template data
let key_global = "index"; // key for global data
let data = {};
const default_dt = () => new Date(1970, 0, 1);

// enum-esque object of types
const Type = Object.freeze({
  NUMBER: Symbol('number'),
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
let Defaults = {
  number: ({
    value=0, min=null, max=null, precision=null, str=str_number,
    clean:{fn:clean_fn=clean_number, on:clean_on=true, change:clean_change=true}={},
    form:{get:form_get=default_form_getter,set:form_set=form_set_number}={},
    template:{set:temp_set=template_set_number}={}
  }={}) => ({
    value, min, max, precision, type:Type.NUMBER, str,
    clean: {fn:clean_fn, on:clean_on, change:clean_change}, 
    form: {get: form_get, set: form_set},
    template: {set: temp_set}
  }),

  date: ({
    value = default_dt(),
    clean:{fn:clean_fn=clean_date, on:clean_on=true, change:clean_change=true}={},
    str=str_date,
    form:{get:form_get=default_form_getter, set:form_set=form_set_date}={},
    template:{set:temp_set=template_set_date}={}
  }={}) => ({
    value, type:Type.DATE, str,
    clean: {fn:clean_fn, on:clean_on, change:clean_change},
    form: {get: form_get, set: form_set},
    template: {set: temp_set}
  }),

  time: ({
    value = default_dt(), str=str_time,
    clean:{fn:clean_fn=clean_time, on:clean_on=true, change:clean_change=true}={},
    form:{get:form_get=default_form_getter, set:form_set=form_set_time}={},
    template: {set:temp_set=template_set_time}={}
  }={}) => ({
    value, type:Type.TIME, str,
    clean: {fn:clean_fn, on:clean_on, change:clean_change},
    form: {get: form_get, set: form_set},
    template: {set: temp_set}
  }),

  duration: ({
    h=null, m=null, s=null, precision=0, str=str_duration,
    clean:{fn:clean_fn=clean_duration, on:clean_on=true, change:clean_change=true}={},
    form:{get:form_get=default_form_getter, set:form_set=form_set_duration}={},
    template: {set:temp_set=template_set_duration}={}
  }={}) => ({
    value: new Duration({h, m, s, precision}), type:Type.DURATION, str,
    clean: {fn:clean_fn, on:clean_on, change:clean_change},
    form: {get: form_get, set: form_set},
    template: {set: temp_set}
  }),

  string: ({
    value="", str=str_str,
    clean:{fn:clean_fn=clean_string, on:clean_on=true, change:clean_change=true}={},
    form:{get:form_get=default_form_getter, set:form_set=form_set_str}={},
    template: {set:temp_set=template_set_string}={}
  }={}) => ({
    value, type:Type.STRING, str,
    clean: {fn:clean_fn, on:clean_on, change:clean_change},
    form: {get: form_get, set: form_set},
    template: {set: temp_set}
  }),
};

// alternative versions of number default
// TODO: these can't handle defaults for sub-objects
// example: defining clean.on but not clean.fn will destroy the first clean object and completely replace it with this new one
// maybe could make a helper function??
Defaults.count = (obj={}) => ({...Defaults.number(), min:0, precision:0, ...obj, type:Type.COUNT});
Defaults.index = (obj={}) => ({...Defaults.number(), min:0, precision:1, ...obj, type:Type.INDEX});
Defaults.pulse = (obj={}) => ({...Defaults.number(), min:0, precision:1, ...obj, type:Type.PULSE});
Defaults.percent = (obj={}) => ({...Defaults.number(), min:0, max:100, precision:1, ...obj, type:Type.PERCENT});

// alternative version of duration where the input is just a single text field instead of input-duration
// mostly same as duration except it uses different form getters/setters b/c the form value has a different format.
Defaults.minutes = (obj={}) => {
  let {m=0, precision=1} = obj;
  return {...Defaults.duration({m, precision}), form:{set: duration_minutes_set, get: duration_minutes_get}, ...obj}
};

// alternative version of percent where clean function updates positional rdi
// Defaults.position = (obj) => ({...Defaults.percent(), clean:{fn:clean_position, on:true}, ...obj});

function str_number(id, k=key) {
  let d = data[k].data[id];
  return Number(d.value).toFixed(d.precision);
}

// mm/dd/yyyy format
function str_date(id, k=key) {
  let d = data[k].data[id];
  return `${d.value.getMonth() + 1}/${d.value.getDate()}/${d.value.getFullYear()}`;
}

function str_time(id, k=key) {
  return time_str(data[k].data[id].value);
}

function str_duration(id, k=key) {
  return data[k].data[id].value.toStr();
}

function str_str(id, k=key) {
  return data[k].data[id].value;
}

function template_set_number(id, k=key) {
  let d = data[k].data[id];
  return Number(d.value).toFixed(d.precision);
}

function template_set_date(id, k=key) {
  let d = data[k].data[id];
  return `${d.value.getMonth() + 1}/${d.value.getDate()}/${d.value.getFullYear()}`;
}

function template_set_time(id, k=key) {
  return time_str(data[k].data[id].value);
}

function template_set_duration(id, k=key) {
  return data[k].data[id].value.toStr();
}

function template_set_string(id, k=key) {
  return data[k].data[id].value;
}

// function clean_position(value, id, k=key) {
//   let prev = data[k].data[id].value;
//   clean_number(value, id, k);
//   update_rdi(id, prev);
// }

function clean_number(value, id, k=key) {
  let d = data[k].data[id];
  d.value = clip_number(value, d.precision, d.min, d.max);
}

function clean_string(value, id, k=key) {
  let d = data[k].data[id];
  d.value = value.trim();
}

function clean_date(value, id, k=key) {
  let v = value.split("-");
  let d = data[k].data[id];
  d.value.setYear(v[0]);
  d.value.setMonth(v[1]-1);
  d.value.setDate(v[2]);
}

function clean_time(value, id, k=key) {
  let v = value.split(":");
  // v.map((value) => {if(isNaN(value)){console.error(`${value} is NaN`)};})
  let d = data[k].data[id];
  d.value.setHours(v[0]);
  d.value.setMinutes(v[1]);
}

function clean_duration(value, id, k=key) {
  data[k].data[id].value.set(value);
}

function default_form_getter(id) {
  return document.getElementById(id).value;
}

function form_set_date(id, k=key) {
  let d = data[k].data[id];
  document.getElementById(id).value = `${zero_pad(d.value.getFullYear(), 4)}-${zero_pad(d.value.getMonth() + 1, 2)}-${zero_pad(d.value.getDate(), 2)}`;
}

function form_set_time(id, k=key) {
  let d = data[k].data[id];
  document.getElementById(id).value = `${zero_pad(d.value.getHours(),2)}:${zero_pad(d.value.getMinutes(),2)}`;
}

function form_set_duration(id, k=key) {
  let d = data[k].data[id];
  document.getElementById(id).value = ({h: d.value.h, m: d.value.m, s: d.value.s});
}

function form_set_number(id, k=key) {
  let d = data[k].data[id];
  if (document.getElementById(id))
    document.getElementById(id).value = Number(d.value).toFixed(d.precision);
}

function form_set_str(id, k=key) {
  document.getElementById(id).value = data[k].data[id].value;
}

// returns minutes from a form field as {m}
function duration_minutes_get(id) {
  return {m: document.getElementById(id).value};
}

// sets text form field with {m} from data
function duration_minutes_set(id, k=key) {
  let d = data[k].data[id];
  document.getElementById(id).value = d.value.m;
}

// assumes index.js has been fully loaded
function new_template_key() {
  key = data[key_global].data.template.value;
}

// create empty data object for this template key
// assumes key is already set
data.init = (k=key) => {
  if (!(k in data)) {
    data[k] = {};
    data[k].init = () => {};
    data[k].data = {};
    // data[k].no_change = [];
    data[k].clean = {};
    data[k].update = {};
    data[k].template_set = {};
    data[k].default = {};
    data[k].loaded = false;
  }
}

data.typeof = (id, k=key) => {
  return data[k]?.data[id]?.type;
}

data.value = (id, k=key) => {
  return data[k]?.data[id]?.value;
}

// initialize data with non-zero defaults
function init_defaults(k=key) {
  for (let [id, fn] of Object.entries(data[k].default)) {
    let d = data[k].data[id];
    d.clean.fn(fn(), id, k); // set data to default value
  }
}

// initialize form with data
function init_form(k=key) {
  for (let [id, d] of Object.entries(data[k].data)) {
    switch(d.type) {
      case Type.DATE: // same as time
      case Type.TIME:
        if (d.value.getTime() == default_dt().getTime()) {
          continue;
        }
        break;
      case Type.DURATION:
        if (d.value.isZero()) {
          continue;
        }
        break;
      default:
        if (!d.value) {
          continue;
        }
    }
    d.form.set(id, k);
    // TODO: need to set max and min for calculated values
  }
}

// cleans & sets data from form input
// then sets form input with the cleaned data
function clean(id, k=key) {
  let d = data[k].data[id];
  d.clean.fn(d.form.get(id), id, k);
  if (d.clean.change)
    d.form.set(id, k);
}

export {
  key,
  key_global,
  data,
  Type,
  Defaults,
  new_template_key,
  init_defaults,
  init_form,
  clean,
};