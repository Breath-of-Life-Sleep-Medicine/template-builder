import * as script from "/script.js";

console.log("Diagnostic.js");

const update_ahi = () => update_index(ahi, tst, a_cc, a_oc, a_mc, h_c);

// current values
let RDI = {
  "supine": 0,
  "prone": 0,
  "left": 0,
  "right": 0,
};

script.data[script.key] = {};

// ids that have no onchange callback fn; can still trigger update w/o clean
script.data[script.key].no_change = [
  "start", // don't clean time fields
  "end",   // don't clean time fields
  "r_lat", // clean happens after update
];

// different clean vs template_set callbacks

// example: rem latency
// - needs a simple cleaning function (valid number)
// - needs a special template print function (valid number + " minutes" OR "N/A")
//   - template print function checks value of rem for whether it should be N/A (rem of 0 means N/A)

// form getters
script.data[script.key].clean = {
  "start":         () => script.time_24_to_12(start.value),      // start time, ex: "10:00 PM"
  "end":           () => script.time_24_to_12(end.value),        // end time, ex: "1:00 AM"
  "trt":           () => script.clip_minutes(trt.value),         // total recording time (minutes)
  "tst":           () => script.clip_minutes(tst.value),         // total sleep time (minutes)
  "eff":           () => script.clip_percent(eff.value),         // sleep efficiency (%)
  "lat":           () => script.clip_minutes(lat.value),         //sleep latency (minutes)
  "waso":          () => script.clip_minutes(waso.value),        // wake after sleep onset (minutes)
  "r_lat":         () => script.clip_minutes(r_lat.value),       // REM latency - less wake (minutes)
  "n1":            () => script.clip_percent(n1.value),          // N1  (% TST)
  "n2":            () => script.clip_percent(n2.value),          // N2  (% TST)
  "n3":            () => script.clip_percent(n3.value),          // N3  (% TST)
  "rem":           () => script.clip_percent(rem.value),         // REM (% TST)
  "ahi":           () => script.clip_index(ahi.value),           // apnea + hypopnea index (events/hour)
  "rdi":           () => script.clip_index(rdi.value),           // (events/hour)
  "a_cc":          () => script.clip_count(a_cc.value),          // central apnea count
  "a_oc":          () => script.clip_count(a_oc.value),          // obstructive apnea count
  "a_mc":          () => script.clip_count(a_mc.value),          // mixed apnea count
  "h_c":           () => script.clip_count(h_c.value),           // total hypopnea count
  "rera":          () => script.clip_count(rera.value),          // RERA count
  "arem_ahi":      () => script.clip_index(arem_ahi.value),      // non-REM AHI (events/hour)
  "rem_ahi":       () => script.clip_index(rem_ahi.value),       // REM AHI (events/hour)
  "supine":        () => script.clip_percent(supine.value),      // (% TST)
  "prone":         () => script.clip_percent(prone.value),       // (% TST)
  "left":          () => script.clip_percent(left.value),        // (% TST)
  "right":         () => script.clip_percent(right.value),       // (% TST)
  "rdi_s":         () => script.clip_index(rdi_s.value),
  "rdi_p":         () => script.clip_index(rdi_p.value),
  "rdi_l":         () => script.clip_index(rdi_l.value),
  "rdi_r":         () => script.clip_index(rdi_r.value),
  "arousals":      () => script.clip_count(arousals.value),      // total arousals
  "arousals_sai":  () => script.clip_index(arousals_sai.value),  // spontaneous arousal index (events/hour)
  "arousals_rai":  () => script.clip_index(arousals_rai.value),  // respiratory arousal index (events/hour)
  "limb":          () => script.clip_count(limb.value),          // total limb movement count
  "limb_ai":       () => script.clip_index(limb_ai.value),       // limb movement with arousal index (events/hour)
  "limb_plmi":     () => script.clip_index(limb_plmi.value),     // limb movement plm index (events/hour)
  "ox_w_avg":      () => script.clip_percent(ox_w_avg.value),    // oxygen saturation: wake average (%)
  "ox_tst_avg":    () => script.clip_percent(ox_tst_avg.value),  // oxygen saturation: sleep average (%)
  "ox_tst_min":    () => script.clip_percent(ox_tst_min.value),  //oxygen saturation: sleep minimum (%)
  "od_duration":   () => script.clip_minutes(od_duration.value), // time spent <= 88% oxygen saturation (minutes)
  "pulse_min":     () => script.clip_index(pulse_min.value),     // minimum heart rate (bpm)
  "pulse_avg":     () => script.clip_index(pulse_avg.value),     // average heart rate (bpm)
  "pulse_max":     () => script.clip_index(pulse_max.value),     // maximum heart rate (bpm)
};

// if rem% == 0, rem latency locks to N/A, rem ahi locks to N/A, non-rem ahi locks to whatever AHI is
script.data[script.key].update = {
  "start": update_end,
  "trt": () => {
    update_percentage(tst, trt, eff);
    update_end();
  },
  "tst": () => {
    update_percentage(tst, trt, eff);
    update_ahi();
  },
  "r_lat": () => {
    rem_check();
    r_lat.value = script.data[script.key].clean.r_lat();
  },
  "rem": () => update_rem('requires_rem'),
  "a_cc": update_ahi,
  "a_oc": update_ahi,
  "a_mc": update_ahi,
  "h_c": update_ahi,
  "ahi": () => {
    rdi.value = ahi.value;
    rdi.dispatchEvent(new Event('change'));
  },
  "supine": () => update_rdi(supine),
  "prone": () => update_rdi(prone),
  "left": () => update_rdi(left),
  "right": () => update_rdi(right),
};

// template setters - format for setting into the template
// only need to specify functions that should override the clean function (ie more complicated set functions that print additional material not in the form)
script.data[script.key].template_set = {
  // REM latency - less wake (minutes)
  "r_lat": () => (rem.value != 0) ? script.clip_minutes(r_lat.value) + " minutes" : "N/A",
  // non-rem ahi (events/hour)
  "arem_ahi": () => (rem.value != 0) ? script.clip_index(arem_ahi.value) : script.clip_index(ahi.value),
  // rem ahi (events/hour)
  "rem_ahi": () => (rem.value != 0) ? `${script.clip_index(rem_ahi.value)}/hr` : "N/A",
  "rdi_positions": rdi_position_str,
};

function rdi_position_str(){
  let rdi_positions = [];
  let check = [left.value, right.value, supine.value, prone.value];
  let value = [rdi_l.value, rdi_r.value, rdi_s.value, rdi_p.value];
  let label = ["Left Side", "Right Side", "Supine", "Prone"];
  for (let i = 0; i < 4; ++i) {
    if (script.clip_percent(check[i]) != 0) {
      rdi_positions.push(`${label[i]} RDI: ${value[i]}`);
    }
  }
  return rdi_positions.join(", ");
}

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
  result.value = sum / Number(dur_min.value) * 60; // convert dur from minutes to hours
  result.dispatchEvent(new Event("change"));
}

// calculate end time from start time & total record time
function update_end () {
  if (start.value != "" && trt.value != "") {
    end.value = new Date(new Date("2025-01-01 " + start.value).getTime() + trt.value*60*1000).toTimeString().slice(0,5);
    end.dispatchEvent(new Event("change"));
  }
}

// show/hide positional rdi based on which positions are set
// pos: position duration input element (%)
function update_rdi (pos) {
  let value = parseFloat(pos.value);
  if ((RDI[pos.id] === 0 && value !== 0) || (RDI[pos.id] !== 0 && value === 0)) {
    let elems = document.getElementsByClassName(pos.id + "_visibility");
    for (let elem of elems) {
      elem.hidden = !elem.hidden;
    }
  }
  RDI[pos.id] = value;
  // if none of RDI are active hide div & label, else don't hide them
  rdi_pos_div.hidden = rdi_pos_label.hidden = !(RDI["supine"] | RDI["prone"] | RDI["left"] | RDI["right"] !== 0 );
}

// hide elems if rem is 0, otherwise show them
function update_rem (cls) {
  let elems = document.getElementsByClassName(cls);
  for (let elem of elems) {
    elem.hidden = rem.value == 0;
  }
}

// if rem latency is set to "N/A", then set rem to 0
function rem_check() {
  let val = r_lat.value.toUpperCase();
  let check = new Set(["N/A", "NA"]);

  if (check.has(val)) {
    rem.value = 0;
    rem.dispatchEvent(new Event('change'));
  }
}