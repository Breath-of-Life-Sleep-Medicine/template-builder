# Run

To run locally, you can use an vscode extension like Live Preview (Microsoft), which lets you run on localhost.

# template file structure

- `{template-name}`
    - `form.html`
    - `script.html`
    - `template.txt`

# To add a new template

1. Move your template into the templates directory. (ex: `templates/HST/MediByte`)
1. `index.html`: add your template as an option to the template select element (`id="template"`).
    - **value**: path to your template from inside the templates directory (ex: `HST/MediByte`)
    - **inner text**: display text (ex: `MediByte`)
    example
        ```html
        <!-- form ... -->
        <select id="template" placeholder="" aria-label="Template" class="form-control">
            <!-- other options ... -->
            <option value="HST/MediByte">MediByte</option>
        </select>
        <!-- form ... -->
        ```

## form.html

Create form inputs for the user to interact with.

This file data will get read and stuck in this div: `<div id="form_container"></div>` (`index.html`)
- except `script` tags

Example snippet

```html
<!-- duration -->
<div class="input-group">
  <div class="form-floating">
    <input type="text" inputmode="numeric" id="duration" class="form-control" placeholder="">
    <label for="duration">Total recording time</label>
  </div>
  <span class="input-group-text">min</span>
</div>
```

## template.txt

When the user clicks *copy to clipboard*, `script.js` does a find/replace on this template, then copies the modified version to the clipboard.

Example snippet

```txt
1. ANALYSIS DURATION: ${duration} minutes
```

Place keywords to replace inside `${}`.

## script.js

Example snippet

```js
// import using relative links b/c root is different for local & deployed
import { data, key, Defaults } from "../../../modules/data.js";

// initialization function
// - a function that runs as soon as this script is loaded
// - ex: set default template values
data[key].init = () => {
};

// data objects
// - contain value, type, clean functions, form getters and setters, template setters,
//   and most settings relevant to data
data[key].data = {
  duration: Defaults.minutes();
};

// update functions
// - automatically runs on item when it is changed in the form (runs after clean function)
// - ex: sum two inputs into another input when their values change
data[key].update = {
};

// non-default template setter functions
// - runs only when moving data into the template
// - for each id, if this is set, this setter function will run INSTEAD of the default template setter
data[key].template_set = {
};

// functions that return the default data value
data[key].default = {
};
```