import { clip_count } from "./clip.js";
import { zero_pad } from "./util.js";

class Duration {
  // - h: hours
  // - m: minutes
  // - s: seconds
  // for h, m, s:
  // - initialize/set to non-null value (ex: 0) to track
  // - initialize/set to null to untrack
  // example: new Duration({h:0, m:0}) will only track hours and minutes, not seconds
  constructor ({h=null, m=null, s=null, precision=0}={}) {
    this.precision = precision;
    let input = Object.entries({h, m, s});
    for (let [k,v] of input) {
      this[k] = v;
      if (v === null)
        continue;
      this.lo = k;
    }
  }
  set({h=null, m=null, s=null}={}) {
    let input = Object.entries({h, m, s});
    // find lo
    for (let [k,v] of input.toReversed()) {
      if (v === null)
        continue;
      this.lo = k;
      break;
    }
    let high_set = false;
    let precision = 0;
    for (let [k,v] of input) {
      if (k === this.lo) {
        precision = this.precision;
      }
      if (v === null) {
        this[k] = null;
      } else if (high_set) {
        this[k] = clip_count(v,precision,0,59);
      } else {
        this[k] = clip_count(v,precision,0);
        high_set = true;
      }
    }
  }
  set_dt(start_dt, end_dt) {
    let d = end_dt - start_dt;
    if (this.h !== null) {
      this.h = Math.floor(d/1000/60/60);
    }
    if (this.m !== null) {
      this.m = Math.floor(d/1000/60 - this.h*60);
    }
    if (this.s !== null) {
      this.s = Math.floor(d/1000 - this.m*60 - this.h*60*60);
    }
  }
  toStr() {
    let str = [];
    if (this.h > 0 || (this.m === null && this.s === null)) {
      str.push(`${this.h} hour${(this.h!=1)?"s":""}`);
    }
    if (this.m > 0 || this.s === null) {
      str.push(`${this.m} minute${(this.m!=1)?"s":""}`);
    }
    if (this.s !== null) {
      str.push(`${this.s} second${(this.s!=1)?"s":""}`);
    }
    return str.join(" ");
  }
  toStrShort() {
    return [this.h, this.m, this.s].filter((v)=>v!==null).map((v) => zero_pad(v,2)).join(":");
  }
}

// start is a dt
// end is a dt
// return duration in hours & minutes
function get_duration(start_dt, end_dt) {
  let d,h,m;
  d = end_dt - start_dt;
  h = Math.floor(d/1000/60/60);
  m = Math.floor(d/1000/60 - h*60);
  return {h, m};
}

// {h:4, m:0} -> 4 hours 0 minutes
// {h:0, m:0} -> 0 minutes
// {h:1, m:1} -> 1 hour 1 minute
function duration_str({h, m, s}) {
  let str = [];
  if (h > 0 || (m === undefined && s === undefined)) {
    str.push(`${h} hour${(h!=1)?"s":""}`);
  }
  if (m > 0 || s === undefined) {
    str.push(`${m} minute${(m!=1)?"s":""}`);
  }
  if (s !== undefined) {
    str.push(`${s} second${(s!=1)?"s":""}`);
  }
  return str.join(" ");
}

// converts {h, m} object into ...h:mm format string
// converts {m, s} object into ...m:ss format string
// converts {h, m, s} object into ...h:mm:ss format string
function duration_short_str(v1, v2, v3=null) {
  return (v3 === null) ? `${v1}:${zero_pad(v2,2)}` : `${v1}:${zero_pad(v2,2)}:${zero_pad(v3,2)}`;
}

export {
  Duration,
  get_duration,
  duration_str,
  duration_short_str,
};