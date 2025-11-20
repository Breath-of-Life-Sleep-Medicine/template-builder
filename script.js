import { clip_count } from "./modules/clip.js";
import { decimal_places } from "./modules/util.js";
import { data, key, key_global, new_template_key, init_defaults, init_form } from "./modules/data.js";

let path_base;

// document ready function (short version)
$(function(){
  // URL/index.html to URL
  path_base = document.location.pathname.split('/');
  path_base.pop();
  path_base = path_base.join('/');

  load_script(key_global, load_form); // initialize data for main form
  // once index script is loaded, load sub-form & initialize its data

  // event listeners
  formID.addEventListener("submit", submit_copy);

  // mutation observer - detect changes to the DOM
  const config = {attributes: false, childList: true, subtree: false};
  const observer = new MutationObserver(initialize);
  observer.observe(form_container, config);
  // to stop observing
  //observer.disconnect();
});

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
  const data_ids = new Set(Object.keys(data[k].data));
  let ids= new Set(Object.keys(data[k].template_set));
  let map = new Map;
  Array.from(ids).map((id)=>map.set(id, data[k].template_set[id]()));
  ids = data_ids.difference(ids);
  Array.from(ids).map((id)=>map.set(id, data[k].data[id].template.set(id, k)));
  // console.log(map); // DEBUG
  return Object.fromEntries(map);

  // return Object.fromEntries(Object.keys(data[k].data).map((id)=>[id, data[k].data[id].template.set(id, k)]));
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
  init_form();
}

function save(data) {
  sessionStorage.setItem("data", JSON.stringify(data));
}

function load() {
  return JSON.parse(sessionStorage.getItem("data"));
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
        let d = data[k].data[id];
        if (!update_only && d.clean.on) {
          d.clean.fn(d.form.get(id), id, k);
          d.form.set(id, k);
        }
        if (id in data[k].update) {
          data[k].update[id]();
        }
      });
    }
  }
}

function load_script(k=key, callback=null) {
  const on_load = () => {
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
    init_defaults(k);
    if (callback !== null) {
      callback();
    }
  };
  if (data[k]?.loaded) {
    on_load();
    return;
  }
  data.init(k); // create empty data object if necessary
  const script = document.createElement('script');
  script.src = path_base + "/modules/"+k+".js";
  script.type = "module";
  script.onload = () => {
    on_load();
    data[k].loaded = true;
  };
  document.body.appendChild(script);
}

// onchange callbacks are generated from {clean - no_change}, or {update - clean}
function load_form() {
  new_template_key();
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

export {
  submit_copy,
  load_form,
  // for testing
  find_replace,
};
