import { data, key } from "../data.js";
import * as form from "../form.js";
import { SCORE_LABEL, time_24_to_12 } from "../util.js";
import { clip_index, clip_count, clip_minutes, clip_percent } from "../clip.js";

const update_ahi = () => form.update_index(ahi, tst, a_cc, a_oc, a_mc, h_c);
const update_cai = () => form.update_index(a_ci, tst, a_cc);

// position duration %
let POS = {
  "supine": 0,
  "prone": 0,
  "left": 0,
  "right": 0,
};

// initialization function
data[key].init = () => {
  form.update_scored_at();
}

data[key].data = {
  "scored_at": 4, // %
}

// ids that have no onchange callback fn; can still trigger update w/o clean
data[key].no_change = [
  "start", // don't clean time fields
  "end",   // don't clean time fields
  "r_lat", // clean happens after update
];

// form getters
data[key].clean = {
  "start":         () => time_24_to_12(start.value),      // start time, ex: "10:00 PM"
  "end":           () => time_24_to_12(end.value),        // end time, ex: "1:00 AM"
  "trt":           () => clip_minutes(trt.value),         // total recording time (minutes)
  "tst":           () => clip_minutes(tst.value),         // total sleep time (minutes)
  "eff":           () => clip_percent(eff.value),         // sleep efficiency (%)
  "lat":           () => clip_minutes(lat.value),         //sleep latency (minutes)
  "waso":          () => clip_minutes(waso.value),        // wake after sleep onset (minutes)
  "r_lat":         () => clip_minutes(r_lat.value),       // REM latency - less wake (minutes)
  "n1":            () => clip_percent(n1.value),          // N1  (% TST)
  "n2":            () => clip_percent(n2.value),          // N2  (% TST)
  "n3":            () => clip_percent(n3.value),          // N3  (% TST)
  "rem":           () => clip_percent(rem.value),         // REM (% TST)
  "ahi":           () => clip_index(ahi.value),           // apnea + hypopnea index (events/hour)
  "rdi":           () => clip_index(rdi.value),           // (events/hour)
  "a_cc":          () => clip_count(a_cc.value),          // central apnea count
  "a_oc":          () => clip_count(a_oc.value),          // obstructive apnea count
  "a_mc":          () => clip_count(a_mc.value),          // mixed apnea count
  "h_c":           () => clip_count(h_c.value),           // total hypopnea count
  "rera":          () => clip_count(rera.value),          // RERA count
  "arem_ahi":      () => clip_index(arem_ahi.value),      // non-REM AHI (events/hour)
  "rem_ahi":       () => clip_index(rem_ahi.value),       // REM AHI (events/hour)
  "a_ci":          () => clip_index(a_ci.value),          // central apnea index (events/hr)
  "supine":        () => clip_percent(supine.value),      // (% TST)
  "prone":         () => clip_percent(prone.value),       // (% TST)
  "left":          () => clip_percent(left.value),        // (% TST)
  "right":         () => clip_percent(right.value),       // (% TST)
  "rdi_s":         () => clip_index(rdi_s.value),
  "rdi_p":         () => clip_index(rdi_p.value),
  "rdi_l":         () => clip_index(rdi_l.value),
  "rdi_r":         () => clip_index(rdi_r.value),
  "arousals":      () => clip_count(arousals.value),      // total arousals
  "arousals_sai":  () => clip_index(arousals_sai.value),  // spontaneous arousal index (events/hour)
  "arousals_rai":  () => clip_index(arousals_rai.value),  // respiratory arousal index (events/hour)
  "limb":          () => clip_count(limb.value),          // total limb movement count
  "limb_ai":       () => clip_index(limb_ai.value),       // limb movement with arousal index (events/hour)
  "limb_plmi":     () => clip_index(limb_plmi.value),     // limb movement plm index (events/hour)
  "ox_w_avg":      () => clip_percent(ox_w_avg.value),    // oxygen saturation: wake average (%)
  "ox_tst_avg":    () => clip_percent(ox_tst_avg.value),  // oxygen saturation: sleep average (%)
  "ox_tst_min":    () => clip_percent(ox_tst_min.value),  //oxygen saturation: sleep minimum (%)
  "od_duration":   () => clip_minutes(od_duration.value), // time spent <= 88% oxygen saturation (minutes)
  "pulse_min":     () => clip_index(pulse_min.value),     // minimum heart rate (bpm)
  "pulse_avg":     () => clip_index(pulse_avg.value),     // average heart rate (bpm)
  "pulse_max":     () => clip_index(pulse_max.value),     // maximum heart rate (bpm)
};

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
    r_lat.value = data[key].clean.r_lat();
  },
  "a_cc": () => {
    update_ahi();
    update_cai();
  },
  "a_oc": update_ahi,
  "a_mc": update_ahi,
  "h_c": update_ahi,
  "ahi": () => {
    rdi.value = ahi.value;
    rdi.dispatchEvent(new Event('change'));
  },
  "supine": () => {
    form.update_rdi(POS, supine)
    form.update_sum(sum_pos, supine, prone, left, right);
  },
  "prone": () => {
    form.update_rdi(POS, prone);
    form.update_sum(sum_pos, supine, prone, left, right);
  },
  "left": () => {
    form.update_rdi(POS, left);
    form.update_sum(sum_pos, supine, prone, left, right);
  },
  "right": () => {
    form.update_rdi(POS, right);
    form.update_sum(sum_pos, supine, prone, left, right);
  },
  "n1": () => form.update_sum(sum_phase, n1, n2, n3, rem),
  "n2": () => form.update_sum(sum_phase, n1, n2, n3, rem),
  "n3": () => form.update_sum(sum_phase, n1, n2, n3, rem),
  "rem": () => {
    form.update_sum(sum_phase, n1, n2, n3, rem);
    form.update_rem(rem, 'requires_rem');
  },
  "scored_at": () => {
    data[key].data.scored_at = clip_percent(scored_at.value,0,3,4);
    form.update_scored_at();
  }
};

// template setters - format for setting into the template
// only need to specify functions that should override the clean function (ie more complicated set functions that print additional material not in the form)
data[key].template_set = {
  // REM latency - less wake (minutes)
  "r_lat": () => (rem.value != 0) ? clip_minutes(r_lat.value) + " minutes" : "N/A",
  // non-rem ahi (events/hour)
  "arem_ahi": () => (rem.value != 0) ? clip_index(arem_ahi.value) : clip_index(ahi.value),
  // rem ahi (events/hour)
  "rem_ahi": () => (rem.value != 0) ? `${clip_index(rem_ahi.value)}/hr` : "N/A",
  "rdi_positions": () => form.rdi_position_str(POS, rdi_s, rdi_p, rdi_l, rdi_r),
  "scored_at_label": () => SCORE_LABEL[data[key].data.scored_at],
};