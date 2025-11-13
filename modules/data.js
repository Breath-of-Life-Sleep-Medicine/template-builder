import { Duration } from "./duration.js";
import { time_str, zero_pad } from "./util.js";
import { clip_number } from "./clip.js";

let key = null;           // key for active template data
let key_global = "index"; // key for global data
let data = {};

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
    data[k].no_change = [];
    data[k].clean = {};
    data[k].update = {};
    data[k].template_set = {};
  }
}

data.typeof = (id, k=key) => {
  return data[k]?.data[id]?.type;
}

data.value = (id, k=key) => {
  return data[k]?.data[id]?.value;
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

export {
  key,
  key_global,
  data,
  Type,
  Defaults,
  new_template_key,
};