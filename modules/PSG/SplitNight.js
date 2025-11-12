import * as script from "../../script.js";
import * as util from "../util.js";

const update_ahi = () => util.update_index(ahi, tst, a_cc, a_oc, a_mc, h_c);

// position duration %
let POS = {
  "supine": 0,
  "prone": 0,
  "left": 0,
  "right": 0,
};

// initialization function
script.data[script.key].init = () => {
  util.update_scored_at();
}

script.data[script.key].data = {
  "scored_at": 4, // %
}

// ids that have no onchange callback fn; can still trigger update w/o clean
// don't clean time fields: put them in here or move them from clean to template_set
script.data[script.key].no_change = [
  "r_lat", // clean happens after update
];

// form getters
script.data[script.key].clean = {
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

  // titration portion
  "ti_trt":             () => script.clip_minutes(ti_trt.value),             // total recording time (minutes)
  "ti_tst":             () => script.clip_minutes(ti_tst.value),             // total sleep time (minutes)
  "ti_eff":             () => script.clip_percent(ti_eff.value),             // sleep efficiency
  "ti_lat":             () => script.clip_minutes(ti_lat.value),             // sleep latency
  "ti_rem_duration":    () => script.clip_minutes(ti_rem_duration.value),    // REM duration (minutes)
  "ti_rem":             () => script.clip_percent(ti_rem.value),             // REM (% TST)
  "ti_supine_duration": () => script.clip_minutes(ti_supine_duration.value), // supine duration (minutes)
  "ti_supine":          () => script.clip_percent(ti_supine.value),          // supine (% TST)
  "ti_ahi":             () => script.clip_index(ti_ahi.value),               // apnea + hypopnea index (events/hour)
  "ti_cai":             () => script.clip_index(ti_cai.value),               // central apnea index (events/hour)
};

// if rem% == 0, rem latency locks to N/A, rem ahi locks to N/A, non-rem ahi locks to whatever AHI is
script.data[script.key].update = {
  // "start": update_end,
  "trt": () => {
    util.update_percentage(tst, trt, eff);
    // update_end();
  },
  "tst": () => {
    util.update_percentage(tst, trt, eff);
    update_ahi();
  },
  "r_lat": () => {
    util.rem_check(rem, r_lat);
    r_lat.value = script.data[script.key].clean.r_lat();
  },
  "a_cc": update_ahi,
  "a_oc": update_ahi,
  "a_mc": update_ahi,
  "h_c": update_ahi,
  "ahi": () => {
    rdi.value = ahi.value;
    rdi.dispatchEvent(new Event('change'));
  },
  "supine": () => {
    util.update_rdi(POS, supine)
    util.update_sum(sum_pos, supine, prone, left, right);
  },
  "prone": () => {
    util.update_rdi(POS, prone);
    util.update_sum(sum_pos, supine, prone, left, right);
  },
  "left": () => {
    util.update_rdi(POS, left);
    util.update_sum(sum_pos, supine, prone, left, right);
  },
  "right": () => {
    util.update_rdi(POS, right);
    util.update_sum(sum_pos, supine, prone, left, right);
  },
  "n1": () => util.update_sum(sum_phase, n1, n2, n3, rem),
  "n2": () => util.update_sum(sum_phase, n1, n2, n3, rem),
  "n3": () => util.update_sum(sum_phase, n1, n2, n3, rem),
  "rem": () => {
    util.update_sum(sum_phase, n1, n2, n3, rem);
    util.update_rem(rem, 'requires_rem');
  },
  "scored_at": () => {
    script.data[script.key].data.scored_at = script.clip_percent(scored_at.value,0,3,4);
    util.update_scored_at();
  },

  // titration portion
  "ti_start": () => util.update_end(ti_start, ti_end, ti_trt),
  "ti_trt": () => {
    util.update_end(ti_start, ti_end, ti_trt);
    util.update_percentage(ti_tst, ti_trt, ti_eff);
  },
  "ti_tst": () => {
    util.update_percentage(ti_tst, ti_trt, ti_eff);
    util.update_percentage(ti_supine_duration, ti_tst, ti_supine);
    util.update_percentage(ti_rem_duration, ti_tst, ti_rem);
  },
  "ti_rem_duration": () => util.update_percentage(ti_rem_duration, ti_tst, ti_rem),
  "ti_supine_duration": () => util.update_percentage(ti_supine_duration, ti_tst, ti_supine),
};

// template setters - format for setting into the template
// only need to specify functions that should override the clean function (ie more complicated set functions that print additional material not in the form)
script.data[script.key].template_set = {
  "start": () => script.time_24_to_12(start.value), // start time, ex: "10:00 PM"
  // "end": () => script.time_24_to_12(end.value), // end time, ex: "1:00 AM"
  // REM latency - less wake (minutes)
  "r_lat": () => (rem.value != 0) ? script.clip_minutes(r_lat.value) + " minutes" : "N/A",
  // non-rem ahi (events/hour)
  "arem_ahi": () => (rem.value != 0) ? script.clip_index(arem_ahi.value) : script.clip_index(ahi.value),
  // rem ahi (events/hour)
  "rem_ahi": () => (rem.value != 0) ? `${script.clip_index(rem_ahi.value)}/hr` : "N/A",
  // rdi - supine, prone, left, & right (events/hour)
  "rdi_positions": () => util.rdi_position_str(POS, rdi_s, rdi_p, rdi_l, rdi_r),
  "scored_at_label": () => util.SCORE_LABEL[script.data[script.key].data.scored_at],

  // titration portion
  "ti_start": () => script.time_24_to_12(ti_start.value), // start time
  "ti_end":   () => script.time_24_to_12(ti_end.value),   // end time
};