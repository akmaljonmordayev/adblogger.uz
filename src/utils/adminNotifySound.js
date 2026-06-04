/**
 * Admin panel notification sounds — Web Audio API (no external files needed)
 * Each event type has a distinct sound signature.
 */

let ctx = null;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, startAt, duration, volume = 0.35, type = "sine") {
  const c = ac();
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.01);
}

/**
 * new_application — yangi ariza
 * Ascending 3-note chime: C5 → E5 → G5  (urgent, clear)
 */
export function soundNewApplication() {
  try {
    const now = ac().currentTime;
    tone(523, now,        0.32, 0.4);   // C5
    tone(659, now + 0.13, 0.32, 0.4);   // E5
    tone(784, now + 0.26, 0.40, 0.4);   // G5
  } catch { /* AudioContext blocked */ }
}

/**
 * new_user — yangi foydalanuvchi ro'yxatdan o'tdi
 * Double ping: high-high
 */
export function soundNewUser() {
  try {
    const now = ac().currentTime;
    tone(1047, now,        0.22, 0.3);  // C6
    tone(1047, now + 0.18, 0.22, 0.2); // C6 echo
  } catch { }
}

/**
 * new_ad — yangi e'lon qo'shildi
 * Two-tone rising notification
 */
export function soundNewAd() {
  try {
    const now = ac().currentTime;
    tone(660, now,        0.28, 0.35, "triangle");  // E5
    tone(880, now + 0.14, 0.35, 0.35, "triangle");  // A5
  } catch { }
}

/**
 * new_contact — yangi xabar keldi
 * Soft single upward sweep
 */
export function soundNewContact() {
  try {
    const c   = ac();
    const now = c.currentTime;
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.18);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.start(now);
    osc.stop(now + 0.46);
  } catch { }
}
