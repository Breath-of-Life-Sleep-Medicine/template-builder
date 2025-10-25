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

When the user clicks *copy to clipboard*, this template gets slightly modified, then copied.

Example snippet

```txt
1. ANALYSIS DURATION: ${duration} minutes
```

Place keywords to replace inside `${}`.

## .js file

```js
script.data[script.key] = {};

// ids to not clean on change
// - clean function will not run when item is changed in the form
// - if update function is set, the update function will still run (just not the clean function)
script.data[script.key].no_change = [
];

// clean functions
// - automatically runs on item when it is changed in the form
// - automatically runs on item when it is extracted from the form (unless template_set is specified)
script.data[script.key].clean = {
  "duration": () => script.clip_minutes(duration.value),
}

// update functions
// - automatically runs on item when it is changed in the form (runs after clean function)
// - does NOT run when item is extracted
script.data[script.key].update = {
}

// template set functions
// - run only when moving data into the template
// - if clean and template_set are BOTH set for an id, then this runs INSTEAD of the clean function
script.data[script.key].template_set = {
}
```