import {key_global, data, Defaults} from "../script.js"

data[key_global].data = {
  date: Defaults.date(),
  referring: Defaults.string(),
  provider: Defaults.string(),
  template: Defaults.string(),
};