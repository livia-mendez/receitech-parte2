// src/utils/tempo.js
function formatTempo(t) {
  if (!t) return '—';

  // aceita string ou número
  const n = parseInt(t, 10);
  if (isNaN(n)) return t;

  if (n < 60) return `${n} min`;

  const h = Math.floor(n / 60);
  const m = n % 60;

  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

module.exports = { formatTempo };
