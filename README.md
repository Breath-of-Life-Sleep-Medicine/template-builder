# Run

To run locally, you can use an vscode extension like Live Preview (Microsoft), which lets you run on localhost.

# To add a new template

1. Add
    - `.html` file to *forms* directory
    - `.txt` file to *templates* directory
    - `.js` file to *modules* directory
        All these files need to have the *exact same middle path*, everything between their parent directory (forms, templates, modules) and their extension (.html, .txt, .js). This includes the names of subdirectories (of forms, templates, and modules).
        example: `./templates/HST/MediByte.txt`, `./forms/HST/MediByte.html`, and `./modules/HST/MediByte.js`
1. `index.html`: add your template as an option to the template select element (`id="template"`).
    - **value**: middle pathname (ex: `HST/MediByte`)
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

## .html file

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

## .txt file

When the user clicks *copy to clipboard*, `script.js` does a find/replace on this template, then copies the modified version to the clipboard.

Example snippet

```txt
1. ANALYSIS DURATION: ${duration} minutes
```

Place keywords to replace inside `${}`.

## .js file

Example snippet

```js
// import using relative links b/c root is different for local & deployed
import { data, key, Defaults } from "../data.js";

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