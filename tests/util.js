import * as script from "/script.js";
import {readFileSync} from "fs";

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

function build_form(data) {
  Object.entries(data).map(([key, value]) => {
    global[key] = {};
    global[key].value = value;
    global[key].dispatchEvent = nop;
  });
}

export {
  find_replace,
  get_file_str,
  get_lines,
  get_paths,
  build_form,
}