// store into result the percentage of a to b
function update_percentage(a, b, result) {
  result.value = (100 * a.value / b.value); //.toFixed(1);
  result.dispatchEvent(new Event("change"));
}

// calculate index (ex: central apnea index = central apnea count / total sleep time)
function update_index(result, dur_min, ...evts) {
  let sum = 0;
  for (let evt of evts) {
    sum += Number(evt.value);
  }
  result.value = 60 * sum / Number(dur_min.value); // convert dur from minutes to hours
  result.dispatchEvent(new Event("change"));
}

// show/hide positional rdi based on which positions are set
// rdi: object to update
// pos: position duration input element (%)
//      note: the class for toggling visibility are id + _visibility (ex: "supine_visibility")
function update_rdi (rdi, pos) {
  let value = parseFloat(pos.value);
  if ((rdi[pos.id] === 0 && value !== 0) || (rdi[pos.id] !== 0 && value === 0)) {
    let elems = document.getElementsByClassName(pos.id + "_visibility");
    for (let elem of elems) {
      elem.hidden = !elem.hidden;
    }
  }
  rdi[pos.id] = value;
  // if none of RDI are active hide div & label, else don't hide them
  rdi_pos_div.hidden = rdi_pos_label.hidden = !(rdi["supine"] | rdi["prone"] | rdi["left"] | rdi["right"] !== 0 );
}

// hide elems if rem is 0, otherwise show them
function update_rem (rem, cls) {
  // console.log(event);
  elems = document.getElementsByClassName(cls);
  for (let elem of elems) {
    elem.hidden = rem.value == 0;
  }
}

// if rem latency is set to "N/A", then set rem to 0
function rem_check(rem, r_lat) {
  let val = r_lat.value.toUpperCase();
  let check = new Set(["N/A", "NA"]);

  if (check.has(val)) {
    rem.value = 0;
    rem.dispatchEvent(new Event('change'));
  }
}

export {
  update_percentage,
  update_index,
  update_rdi,
  update_rem,
  rem_check,
};