/* ── Premium toast – drop-in replacement for react-toastify ─────── */
const listeners = new Set();

export const _subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const emit = (type, message, opts = {}) => {
  const id = `${Date.now()}-${Math.random()}`;
  listeners.forEach(fn => fn({ id, type, message, duration: opts.duration ?? 4000 }));
};

export const toast = {
  success: (msg, opts) => emit("success", msg, opts ?? {}),
  error:   (msg, opts) => emit("error",   msg, opts ?? {}),
  warning: (msg, opts) => emit("warning", msg, opts ?? {}),
  info:    (msg, opts) => emit("info",    msg, opts ?? {}),
};
