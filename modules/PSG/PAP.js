import { data, key, Defaults } from "../data.js";
import * as form from "../form.js";
import { SCORE_LABEL } from "../util.js";

// initialization function
data[key].init = () => {
  form.update_scored_at();
}

data[key].data = {
  // oxygen desaturation (%) that hypopneas are scored at
  scored_at:    Defaults.percent({value:4, precision:0, min:3, max:4}),
  start:        Defaults.time(),    // start time, ex: "10:00 PM"
  end:          Defaults.time(),    // end time, ex: "1:00 AM"; calculate: start + trt
  trt:          Defaults.minutes(), // total recording time (minutes)
  tst:          Defaults.minutes(), // total sleep time (minutes)
  eff:          Defaults.percent(), // sleep efficiency (%); calculate: 100*tst/trt
  lat:          Defaults.minutes(), // sleep latency (minutes)
  waso:         Defaults.minutes(), // wake after sleep onset (minutes)
  r_lat:        Defaults.minutes(), // REM latency - less wake (minutes)
  n1:           Defaults.percent(), // N1  (% TST)
  n2:           Defaults.percent(), // N2  (% TST)
  n3:           Defaults.percent(), // N3  (% TST)
  rem:          Defaults.percent(), // REM (% TST)
  ahi:          Defaults.index(),   // apnea + hypopnea index (events/hour)
  rdi:          Defaults.index(),   // (events/hour)
  a_cc:         Defaults.count(),   // central apnea count
  a_oc:         Defaults.count(),   // obstructive apnea count
  a_mc:         Defaults.count(),   // mixed apnea count
  h_c:          Defaults.count(),   // total hypopnea count
  rera:         Defaults.count(),   // RERA count
  arem_ahi:     Defaults.index(),   // non-REM AHI (events/hour)
  a_ci:         Defaults.index(),   // central apnea index (events/hr)
  rem_ahi:      Defaults.index(),   // REM AHI (events/hour)
  supine:       Defaults.percent(), // (% TST)
  prone:        Defaults.percent(), // (% TST)
  left:         Defaults.percent(), // (% TST)
  right:        Defaults.percent(), // (% TST)
  rdi_s:        Defaults.index(),   // RDI while supine (events/hour)
  rdi_p:        Defaults.index(),   // RDI while prone (events/hour)
  rdi_l:        Defaults.index(),   // RDI while left (events/hour)
  rdi_r:        Defaults.index(),   // RDI while right (events/hour)
  arousals:     Defaults.count(),   // total arousals
  arousals_sai: Defaults.index(),   // spontaneous arousal index (events/hour)
  arousals_rai: Defaults.index(),   // respiratory arousal index (events/hour)
  limb:         Defaults.count(),   // total limb movement count
  limb_ai:      Defaults.index(),   // limb movement with arousal index (events/hour)
  limb_plmi:    Defaults.index(),   // limb movement plm index (events/hour)
  ox_w_avg:     Defaults.percent(), // oxygen saturation: wake average (%)
  ox_tst_avg:   Defaults.percent(), // oxygen saturation: sleep average (%)
  ox_tst_min:   Defaults.percent(), // oxygen saturation: sleep minimum (%)
  od_duration:  Defaults.minutes(), // time spent <= 88% oxygen saturation (minutes)
  pulse_min:    Defaults.pulse(),   // minimum heart rate (bpm)
  pulse_avg:    Defaults.pulse(),   // average heart rate (bpm)
  pulse_max:    Defaults.pulse(),   // maximum heart rate (bpm)
  ...data[key].data, // only set things that aren't already set
};

const DATA = data[key].data; // create alias after the object is assigned
const update_ahi = () => form.update_index(ahi, tst, a_cc, a_oc, a_mc, h_c);
const update_cai = () => form.update_index(a_ci, tst, a_cc);
const update_sum_pos = () => form.update_sum(sum_pos, DATA.supine, DATA.prone, DATA.left, DATA.right);
const update_sum_phase = () => form.update_sum(sum_phase, DATA.n1, DATA.n2, DATA.n3, DATA.rem);

DATA.scored_at.clean.change = false;
DATA.r_lat.clean.on = false;
DATA.r_lat.template.set = () => {
  let d = data[key].data;
  (d.rem.value != 0) ? d.r_lat.str() : "N/A"
}

// if rem% == 0, rem latency locks to N/A, rem ahi locks to N/A, non-rem ahi locks to whatever AHI is
data[key].update = {
  "start": () => form.update_end(end),
  "trt": () => {
    form.update_percentage(tst, trt, eff);
    form.update_end(end);
  },
  "tst": () => {
    form.update_percentage(tst, trt, eff);
    update_ahi();
    update_cai();
  },
  "r_lat": () => {
    form.rem_check(rem, r_lat);
    clean("r_lat");
  },
  "a_cc": () => {
    update_ahi();
    update_cai();
  },
  "a_oc": update_ahi,
  "a_mc": update_ahi,
  "h_c": update_ahi,
  "ahi": () => {
    rdi.value = DATA.ahi.value;
    rdi.dispatchEvent(new Event('change'));
  },
  "supine": () => {
      form.update_rdi("supine");
      update_sum_pos();
    },
    "prone": () => {
      form.update_rdi("prone");
      update_sum_pos();
    },
    "left": () => {
      form.update_rdi("left");
      update_sum_pos();
    },
    "right": () => {
      form.update_rdi("right");
      update_sum_pos();
    },
    "n1": update_sum_phase,
    "n2": update_sum_phase,
    "n3": update_sum_phase,
    "rem": () => {
      update_sum_phase();
      form.update_rem(rem, 'requires_rem');
    },
    "scored_at": form.update_scored_at,
};

// non-default template setters
data[key].template_set = {
  r_lat: () => (DATA.rem.value != 0) ? DATA.r_lat.value.toStr() : "N/A",
  arem_ahi: () => (DATA.rem.value != 0) ? DATA.arem_ahi.template.set("arem_ahi") : DATA.ahi.template.set("ahi"),
  rem_ahi: () => (DATA.rem.value != 0) ? `${DATA.rem_ahi.template.set("rem_ahi")}/hr` : "N/A",
  rdi_positions: () => form.rdi_position_str(),
  scored_at_label: () => SCORE_LABEL[DATA.scored_at.str("scored_at")],
}