import * as script from "/script.js";

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

// calculate end time from start time & total record time (minutes)
function update_end (start, end, trt) {
  if (start.value != "" && trt.value != "") {
    end.value = new Date(new Date("2025-01-01 " + start.value).getTime() + trt.value*60*1000).toTimeString().slice(0,5);
    end.dispatchEvent(new Event("change"));
  }
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

// get rdi position string (for the template)
// supine, prone, left, and right are duration in positions (%)
function rdi_position_str(RDI, supine, prone, left, right){
  let rdi_positions = [];
  let check = [left.value, right.value, supine.value, prone.value];
  let value = [RDI.left, RDI.right, RDI.supine, RDI.prone];
  let label = ["Left Side", "Right Side", "Supine", "Prone"];
  for (let i = 0; i < 4; ++i) {
    if (script.clip_percent(check[i]) != 0) {
      rdi_positions.push(`${label[i]} RDI: ${value[i]}`);
    }
  }
  return rdi_positions.join(", ");
}

// hide elems if rem is 0, otherwise show them
function update_rem (rem, cls) {
  // console.log(event);
  let elems = document.getElementsByClassName(cls);
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
  update_end,
  update_rdi,
  rdi_position_str,
  update_rem,
  rem_check,
};