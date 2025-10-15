# Run

to run locally, you can use an vscode extension like Live Preview (lets you run it on localhost)

# Add a new template

- for each template, you need to add 1 form (html), and 1 template (txt)
  - middle pathname needs to be same for both
      - ex: `./templates/HST/MediByte.txt` and `./forms/HST/MediByte.html`
      - not counting `templates` and `forms` directories, or `.txt` and `.html` extensions
- inside form (html)
    - define `get_map()`
        - links keywords in template to fields in the form
        - used by `find_replace()` in script.js
    - handle template's form fields and any calculations
- inside the template (txt)
    - use `${}` to distinguish keywords (ex: `AHI: ${ahi}.`). these will be replaced by `get_map()` as defined in the form.
- add template name to index.html (input id=`template`)

If all goes well, you should be able to click on the templates drop down, select your template, have the form load, and be able to copy your template.
