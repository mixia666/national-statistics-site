// StatAtlas charts: small dependency-free canvas bar charts.
// One job: draw a labelled horizontal bar chart into a <canvas>.
// Colours come from the site palette so the chart matches the page.

const INK = '#1c2430';
const MUTED = '#5d6b7a';
const TEAL = '#0e7c6b';
const AMBER = '#d9930d';
const TRACK = '#e8e2d6';

/** Draw horizontal bars. rows: [{label, value, highlight?}], options: {unit, decimals, height}. */
export function drawBarChart(canvas, rows, options = {}) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const rowHeight = options.rowHeight || 34;
  const labelWidth = options.labelWidth || 132;
  const valueWidth = options.valueWidth || 86;
  const height = rows.length * rowHeight + 8;
  canvas.style.height = `${height}px`;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1e-9);
  const barArea = width - labelWidth - valueWidth - 8;
  ctx.font = '13px Georgia, "Times New Roman", serif';
  ctx.textBaseline = 'middle';
  rows.forEach((row, i) => {
    const y = i * rowHeight + 18;
    ctx.fillStyle = row.highlight ? INK : MUTED;
    ctx.textAlign = 'right';
    ctx.fillText(row.label, labelWidth - 10, y, labelWidth - 12);
    const barWidth = Math.max(2, (Math.abs(row.value) / max) * barArea);
    const x0 = labelWidth;
    ctx.fillStyle = TRACK;
    ctx.fillRect(x0, y - 8, barArea, 16);
    ctx.fillStyle = row.highlight ? AMBER : TEAL;
    if (row.value >= 0) {
      ctx.fillRect(x0, y - 8, barWidth, 16);
    } else {
      ctx.fillRect(x0 + barArea - barWidth, y - 8, barWidth, 16);
    }
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    const text = formatChartValue(row.value, options);
    ctx.fillText(text, x0 + barArea + 8, y, valueWidth);
  });
}

function formatChartValue(value, options) {
  const decimals = options.decimals ?? 1;
  const n = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (options.suffix === '%') return `${value > 0 ? '+' : ''}${n}%`;
  if (options.prefix === '$') return `$${n}`;
  return n;
}

/** Redraw every chart on the page (call after resize). */
export function redrawCharts() {
  document.querySelectorAll('canvas[data-chart]').forEach((canvas) => {
    const draw = canvas._statAtlasDraw;
    if (typeof draw === 'function') draw();
  });
}
