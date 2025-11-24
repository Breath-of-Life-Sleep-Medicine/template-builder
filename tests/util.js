import * as script from "/script.js";
import { readFileSync } from "fs";
import { data, key, key_global } from "../modules/data";
import { Type } from "../modules/data";

// function that does nothing :)
const nop = (...args) => {};

// call find_replace given path to a template file
function find_replace(path) {
  return script.find_replace(get_file_str(path));
}

// convert file content to string
function get_file_str(path) {
  return readFileSync(path, 'utf-8');
}

// get array of lines of a string
function get_lines(str) {
  return str.split(/\r?\n/);
}

// locations for different files
function get_paths(path) {
  return {
    template: "templates/"+path+".txt",
    expected: "./tests/expected/"+path+".txt",
  };
}

// builds form and also sets the value in data
function build_form(form, k=key) {
  Object.entries(form).map(([id, value]) => {
    // set global (mock form input)
    global[id] = {id: id, value: value, textContent: value, checked: value, dispatchEvent: nop};
    // set data (minutes are special)
    if (data[k]?.data[id]?.type === Type.DURATION && typeof(value) !== "object") {
      // minutes are Duration in data, but single string input in form (Duration requires an object)
      data[k]?.data[id]?.clean?.fn({m: value}, id, k);
    } else {
      data[k]?.data[id]?.clean?.fn(value, id, k);
    }
  });
}

function update_calculated({changed, calculated=[]}, k = key) {
  data[k].update[changed]();
  for (let id of calculated) {
    data[k].data[id]?.clean?.fn(global[id].value, id, k);
  }
}

function init_data() {
  data.init(key_global);
  data.init(key);
}

export {
  nop,
  find_replace,
  get_file_str,
  get_lines,
  get_paths,
  build_form,
  init_data,
  update_calculated,
};