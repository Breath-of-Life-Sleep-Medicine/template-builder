// custom input type input-duration
import * as script from "../../script.js";

class InputDurationElement extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
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
    shadowRoot.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
      <link href="style.css" rel="stylesheet">
      <div class="duration-container">
        ${strs}
      </div>
    `;

    const elems = {
      h: this._hourInput,
      m: this._minuteInput,
      s: this._secondInput,
    }
    
    for (let cls of cls_found) {
      elems[cls] = shadowRoot.querySelector(`[part="${cls}"]`);
    }
    for (let cls of cls_found) {
      elems[cls].addEventListener("change", () => {
        if (cls !== high_set) {
          elems[cls].value = script.zero_pad(script.clip_count(parseInt(elems[cls].value) || 0, 0, 0, 59), 2);
        } else {
          elems[cls].value = script.clip_count(parseInt(elems[cls].value) || 0);
        }
        if (cls === last_set) {
          this.dispatchEvent(new Event("change"));
        }
      });
    }
  }

  get value() {
    let h, m, s;
    if (this._hourInput === undefined)
      h = null;
    else
      h = parseInt(this._hourInput.value) || 0;
    if (this._minuteInput === undefined)
      m = null;
    else
      m = parseInt(this._minuteInput.value) || 0;
    if (this._secondInput === undefined)
      s = null;
    else
      s = parseInt(this._secondInput.value) || 0;
    return {h,m,s};
  }

  set value({h=null,m=null,s=null}) {
    if (this._hourInput)
      this._hourInput.value = h;
    if (this._minuteInput)
      this._minuteInput.value = m;
    if (this._secondInput)
      this._secondInput.value = s;
  }
}

customElements.define('input-duration', InputDurationElement);