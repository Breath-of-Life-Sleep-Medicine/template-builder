import {key_global, data, Defaults, load_form} from "../script.js"

console.log("index.js");

data[key_global].data = {
  date: Defaults.date(),
  referring: Defaults.string(),
  provider: Defaults.string(),
  template: Defaults.string(),
};

data[key_global].update = {
  template: () => {load_form();}
}

console.log(data);