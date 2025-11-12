import {key_global, data, Defaults, load_form} from "../script.js"

data[key_global].init = () => {
  data[key_global].data.provider.value = provider.value;
  data[key_global].data.template.value = template.value;
};

data[key_global].data = {
  date: Defaults.date(),
  referring: Defaults.string(),
  provider: Defaults.string(),
  template: Defaults.string(),
};

data[key_global].update = {
  template: () => {load_form();}
}