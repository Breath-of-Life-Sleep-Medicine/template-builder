// custom input type input-duration
import { zero_pad } from "../util.js";
import { clip_count } from "../clip.js";

class InputDurationElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.build();
  }

  build() {
    let cls_elem = new Set(this.classList);
    let cls_find = ["h", "m", "s"];
    let cls_found = new Set();
    let strs = [];
    let high_set = null;
    let last_set = null;
    for (let cls of cls_find) {
      if (cls_elem.has(cls)) {
        cls_found.add(cls);
        last_set = cls;
        if (high_set) {
          strs.push(`<input type="text" inputmode="numeric" part="${cls}" min="0" max="59" maxlength="2" placeholder="--">`);
        } else {
          strs.push(`<input type="text" inputmode="numeric" part="${cls}" min="0" maxlength="3" placeholder="---">`);
          high_set = cls;
        }
      }
    }
    if (!high_set) {
      strs = [
        `<input type="text" inputmode="numeric" part="h" min="0" maxlength="3" placeholder="---">`,
        `<input type="text" inputmode="numeric" part="m" min="0" max="59" maxlength="2" placeholder="--">`,
        `<input type="text" inputmode="numeric" part="s" min="0" max="59" maxlength="2" placeholder="--">`,
      ];
    }
    strs = strs.join(`\n<span>:</span>\n`);
    this.shadowRoot.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
      <link href="style.css" rel="stylesheet">
      <div class="duration-container">
        ${strs}
      </div>
    `;
    
    for (let cls of cls_found) {
      this[cls] = this.shadowRoot.querySelector(`[part="${cls}"]`);
    }
    for (let cls of cls_found) {
      this[cls].addEventListener("change", () => {
        if (cls !== high_set) {
          this[cls].value = zero_pad(clip_count(parseInt(this[cls].value) || 0, 0, 0, 59), 2);
        } else {
          this[cls].value = clip_count(parseInt(this[cls].value) || 0);
        }
        if (cls === last_set) {
          this.dispatchEvent(new Event("change"));
        }
      });
    }
  }

  get value() {
    let ret = {};
    let classes = ["h", "m", "s"];
    for (let cls of classes) {
      ret[cls] = this[cls] ? parseInt(this[cls].value) || 0 : null;
    }
    return ret;
  }

  set value({h=null,m=null,s=null}) {
    let high_set = false;
    Object.entries({h, m, s}).map(([cls, val]) => {
      if (cls in this) {
        if (high_set) {
          this[cls].value = zero_pad(val, 2);
        } else {
          this[cls].value = val;
          high_set = true;
        }
      }
    });
  }
}

customElements.define('input-duration', InputDurationElement);