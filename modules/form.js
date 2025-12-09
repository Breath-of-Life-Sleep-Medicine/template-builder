import { data, key } from "./data.js";
import { clip_percent } from "./clip.js";
import { SCORE_LABEL } from "./util.js";


// store into result the percentage of a to b
function update_percentage(a, b, result) {
  result.value = 100 * a.value / b.value;
  result.dispatchEvent(new Event("calculated"));
}

// set the textContent of all elements with class cls_str to txt_str
function set_class_text(cls_str, txt_str) {
  let elems = document.getElementsByClassName(cls_str);
  for (let elem of elems) {
    elem.textContent = txt_str;
  }
}

// sum is static html text to store the sum
// ids are data ids that contain the values to sum
function update_sum(sum, ...ids) {
  let v = ids.reduce((acc, id) => acc + Number(id.value), 0.0);
  sum.textContent = v.toFixed(ids[0].precision);
}

// calculate index (ex: central apnea index = central apnea count / total sleep time)
function update_index(result, dur_min, ...ids) {
  let val = (id) => data[key]?.data[id]?.value ?? 0;
  let sum = ids.reduce((acc, id) => acc + Number(val(id.id)), 0.0);
  result.value = 60 * sum / Number(data[key]?.data[dur_min.id]?.value?.m ?? 0); // convert dur from minutes to hours
  result.dispatchEvent(new Event("calculated"));
}

// calculate end time from start time & total record time (minutes)
// end is form input; start & trt are data
function update_end(end, {start, trt}=data[key].data) {
  end.value = new Date(start.value.getTime() + trt.value.m*60*1000).toTimeString().slice(0,5);
  end.dispatchEvent(new Event("calculated"));
}

// show/hide positional rdi based on which positions are set
// id: id of element that just changed (supine, prone, left, or right)
//     note: the class for toggling visibility are id + _visibility (ex: "supine_visibility")
function update_rdi (id, {supine, prone, left, right}=data[key].data) {
  let duration = {supine, prone, left, right};
  let elems = document.getElementsByClassName(id + "_visibility");
  for (let elem of elems) {
    elem.hidden = !Boolean(Number(duration[id].value));
  }
  // if none of RDI are active hide div & label, else don't hide them
  rdi_pos_div.hidden = rdi_pos_label.hidden = !((Number(duration.supine.value) | Number(duration.prone.value) | Number(duration.left.value) | Number(duration.right.value)) !== 0 );
}

// get rdi position string (for the template)
// check = {supine, prone, left, right}
// value = {rdi_s, rdi_p, rdi_l, rdi_r}
function rdi_position_str({supine, prone, left, right, rdi_s, rdi_p, rdi_l, rdi_r}=data[key].data){
  let rdi_positions = [];
  let value = [rdi_l, rdi_r, rdi_s, rdi_p];
  let check = [left, right, supine, prone];
  let label = ["Left Side", "Right Side", "Supine", "Prone"];
  for (let i = 0; i < 4; ++i) {
    if (clip_percent(Number(check[i].value)) != 0) {
      rdi_positions.push(`${label[i]} RDI: ${value[i].value}/hr`);
    }
  }
  return rdi_positions.join(", ");
}

// hide elems if rem is 0, otherwise show them
function update_rem (rem, cls) {
  let elems = document.getElementsByClassName(cls);
  for (let elem of elems) {
    elem.hidden = rem.value == 0;
  }
}

// if rem latency is set to "N/A", then set rem to 0
// rem is not a calculated field
function rem_check(rem, r_lat) {
  let val = r_lat.value.toUpperCase();
  let check = new Set(["N/A", "NA"]);

  if (check.has(val)) {
    rem.value = 0;
    rem.dispatchEvent(new Event('change'));
  }
}

// update from data
function update_scored_at() {
  let v = data[key].data.scored_at.str("scored_at");
  set_class_text("scored_at", `(${v}%, ${SCORE_LABEL[v]})`);
  label_scored_at.textContent = v;
}

export {
  update_percentage,
  update_index,
  update_end,
  update_rdi,
  rdi_position_str,
  update_rem,
  rem_check,
  update_sum,
  set_class_text,
  update_scored_at,
};