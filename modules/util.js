import * as script from "../script.js";

// convert % to label text
const RDI_LABEL = {
  3: "(3%, AASM)",
  4: "(4%, CMS)",
};

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
// POS:      stored positional durations (to be updated)
// pos_elem: position duration input element (%)
//           note: the class for toggling visibility are id + _visibility (ex: "supine_visibility")
function update_rdi (POS, pos_elem) {
  let value = parseFloat(pos_elem.value);
  if ((POS[pos_elem.id] === 0 && value !== 0) || (POS[pos_elem.id] !== 0 && value === 0)) {
    let elems = document.getElementsByClassName(pos_elem.id + "_visibility");
    for (let elem of elems) {
      elem.hidden = !elem.hidden;
    }
  }
  POS[pos_elem.id] = value;
  // if none of RDI are active hide div & label, else don't hide them
  rdi_pos_div.hidden = rdi_pos_label.hidden = !(POS["supine"] | POS["prone"] | POS["left"] | POS["right"] !== 0 );
}

// get rdi position string (for the template)
// POS is the position durations (%)
// supine, prone, left, and right are the positional RDI (evt/hr)
function rdi_position_str(POS, supine, prone, left, right){
  let rdi_positions = [];
  let value = [left.value, right.value, supine.value, prone.value];
  let check = [POS.left, POS.right, POS.supine, POS.prone];
  let label = ["Left Side", "Right Side", "Supine", "Prone"];
  for (let i = 0; i < 4; ++i) {
    if (script.clip_percent(check[i]) != 0) {
      rdi_positions.push(`${label[i]} RDI: ${value[i]}/hr`);
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
  RDI_LABEL,
  update_percentage,
  update_index,
  update_end,
  update_rdi,
  rdi_position_str,
  update_rem,
  rem_check,
};