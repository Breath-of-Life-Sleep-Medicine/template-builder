import * as script from "/script.js";
import { data, key, key_global, Type } from "/modules/data.js";
import { readFileSync } from "fs";

import * as _ from "/modules/input/duration.js"; // define input-duration

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
function build_form(form) {
  Object.entries(form).map(([k, d]) =>{
    k = eval(k);
    Object.entries(d).map(([id, value]) => {
      // set global (mock form input)
      // global[id] = {id: id, value: value, textContent: value, checked: value, dispatchEvent: nop};

      // create form
      if (!(id in global))
      {
        let is_duration = data[k]?.data[id]?.type === Type.DURATION;
        if (is_duration) {
          global[id] = document.createElement("input-duration");
        } else {
          global[id] = document.createElement("input");
        }
        global[id].id          = id;
        global[id].className   = value.class;
        if (value.class) {
          global[id].classList.add(...value.class?.split(" "));
          // console.log("CLASS:", value.class, global[id].className, ...global[id].classList);
        }
        if (is_duration) {
          global[id].build();
        }
        document.body.appendChild(global[id]);
      }

      // set form
      global[id].value       = value.value;
      global[id].textContent = value.textContent;
      global[id].checked     = value.checked;

      // set data from form
      data[k]?.data[id]?.clean?.fn(data[k]?.data[id]?.form?.get(id), id, k);

      // debug
      // console.log(id, data[k]?.data[id]?.value);
    });

    // setup event listeners - happen after form is setup
    add_listeners(k);
  });

  script.initialize(); // this will also set the form from data potentially

  Object.entries(form).map(([k, d]) =>{
    Object.entries(d).map(([id, value]) => {
      global[id].dispatchEvent(new Event("change"));
    });
  });

}

function update_calculated({changed, calculated=[]}, k = key) {
  data[k].update[changed]();
  for (let id of calculated) {
    data[k].data[id]?.clean?.fn(global[id].value, id, k);
  }
}

function add_listeners(k) {
  let ids = new Set(Object.keys(data[k].data));
  script.add_onchange_listeners(ids,k);
  const update = new Set(Object.keys(data[k].update));
  ids = update.difference(ids);
  script.add_onchange_listeners(ids,k,true);
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