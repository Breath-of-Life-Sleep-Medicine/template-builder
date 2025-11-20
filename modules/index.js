import { load_form } from "../script.js"
import { data, key_global, Defaults } from "./data.js";

data[key_global].init = () => {
  provider.value = data[key_global].data.provider.value;
  template.value = data[key_global].data.template.value;
  provider.dispatchEvent(new Event("change"));
  template.dispatchEvent(new Event("change"));
};

data[key_global].data = {
  date: Defaults.date(),
  referring: Defaults.string(),
  provider: Defaults.string({value: "Lisa Williams FNP"}),
  template: Defaults.string({value: "PSG/SplitNight"}),
};

data[key_global].update = {
  template: load_form,
}