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
let Defaults = {
  number: {
    count: ({value=0, min=0, precision=0, clean=clean_number, form:{get:form_get=default_form_getter, set:form_set=form_set_number}={}, template:{set:temp_set=template_set_number}={}}={}) => ({value, min, precision, type:Type.COUNT, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),

    index: ({value=0, min=0, precision=1, unit="evt/hr", clean=clean_number, form:{get:form_get=default_form_getter, set:form_set=form_set_number}={}, template:{set:temp_set=template_set_number}={}}={}) => ({value, min, precision, unit, type:Type.INDEX, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),

    percent: ({value=0, min=0, max=100, precision=1, unit="%", clean=clean_number, form:{get:form_get=default_form_getter, set:form_set=form_set_number}={}, template:{set:temp_set=template_set_number}={}}={}) => ({value, min, max, precision, unit, type:Type.PERCENT, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),

    pulse: ({value=0, min=0, precision=1, unit="bpm", clean=clean_number, form:{get:form_get=default_form_getter, set:form_set=form_set_number}={}, template:{set:temp_set=template_set_number}={}}={}) => ({value, min, precision, unit, type:Type.PULSE, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),
  },

  date: ({value = new Date(1970,1,1), clean=clean_date, form:{get:form_get=default_form_getter, set:form_set=form_set_date}={}, template:{set:temp_set=template_set_date}={}}={}) => ({value, type:Type.DATE, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),

  time: ({value = new Date(1970,1,1), clean=clean_time, form:{get:form_get=default_form_getter, set:form_set=form_set_time}={}, template: {set:temp_set=template_set_time}={}}={}) => ({value, type:Type.TIME, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),

  duration: ({h=null, m=null, s=null, precision=0, clean=clean_duration, form:{get:form_get=default_form_getter, set:form_set=form_set_duration}={}, template: {set:temp_set=template_set_duration}={}}={}) => ({value: new Duration({h, m, s, precision}), type:Type.DURATION, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),

  string: ({value="", clean=clean_string, form:{get:form_get=default_form_getter, set:form_set=form_set_str}={}, template: {set:temp_set=template_set_string}={}}={}) => ({value, type:Type.STRING, clean, form: {get: form_get, set: form_set}, template: {set: temp_set}}),
};

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
  document.getElementById(id).value = Number(d.value).toFixed(d.precision);
}

function form_set_str(id, k=key) {
  document.getElementById(id).value = data[k].data[id].value;
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

export {
  key,
  key_global,
  data,
  Type,
  Defaults,
  new_template_key,
};