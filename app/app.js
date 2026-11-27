// StatAtlas app: a hash-routed single-page site.
// Routes: #/ (home), #/country/<CODE> (country page),
// #/rankings?metric=<key> (sortable table of all countries),
// #/compare?a=<CODE>&b=<CODE>&c=<CODE> (side-by-side comparison), #/sources.
// All data is local (app/data.js); nothing is fetched from the network.

import { COUNTRIES, INDICATORS, SOURCES, WORLD, YEAR, countryByCode, formatValue, rankOf } from './data.js';
import { drawBarChart } from './charts.js';

const view = document.getElementById('view');

function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function indicatorByKey(key) {
  return INDICATORS.find((i) => i.key === key) || INDICATORS[1];
}

function topCountries(key, n) {
  return [...COUNTRIES].sort((a, b) => b[key] - a[key]).slice(0, n);
}

function statCard(country, indicator) {
  const value = formatValue(country[indicator.key], indicator);
  const rank = rankOf(country, indicator.key);
  return `<div class="card">
    <div class="card-label">${esc(indicator.label)}</div>
    <div class="card-value">${esc(value)} <span class="card-unit">${esc(indicator.unit)}</span></div>
    <div class="card-sub">Rank #${rank} of ${COUNTRIES.length} · ${YEAR}</div>
    <div class="card-blurb">${esc(indicator.blurb)}</div>
  </div>`;
}

function countryLink(code) {
  return `<a href="#/country/${code}">${esc(countryByCode(code).name)}</a>`;
}

function searchBox() {
  return `<div class="search-wrap">
    <label for="country-search">Find a country</label>
    <input id="country-search" type="search" placeholder="Type a country name — try Japan, Brazil, Nigeria…" autocomplete="off">
    <div id="search-results" class="search-results" aria-live="polite"></div>
  </div>`;
}

function renderHome() {
  const topGdp = topCountries('gdp', 10);
  const topLife = topCountries('lifeExpectancy', 5);
  const fastest = topCountries('gdpGrowth', 5);
  const rows = topGdp.map((c) => ({ label: c.name, value: c.gdp, highlight: c.code === 'US' }));
  view.innerHTML = `
  <section class="hero">
    <p class="kicker">National statistics · ${YEAR} · World Bank data</p>
    <h1>Every country&rsquo;s numbers,<br>in one place.</h1>
    <p class="lede">Population, GDP, jobs, prices and how long people live — for 26 countries,
    each figure with its source and year. Search a country, open its page, or rank them all.</p>
    ${searchBox()}
  </section>

  <section class="world-strip" aria-label="World totals">
    <div><strong>8.09 bn</strong><span>people on Earth, ${YEAR}</span></div>
    <div><strong>$105.4 tn</strong><span>world GDP, ${YEAR}</span></div>
    <div><strong>73.3 years</strong><span>world life expectancy, ${YEAR}</span></div>
    <div><strong>26</strong><span>countries covered here</span></div>
  </section>

  <section>
    <div class="section-head">
      <h2>The world&rsquo;s largest economies</h2>
      <a class="more" href="#/rankings?metric=gdp">Rank all countries &rarr;</a>
    </div>
    <p class="section-note">GDP in current US dollars, ${YEAR}. Source: World Bank, World Development Indicators.</p>
    <canvas id="gdp-chart" data-chart="gdp" role="img" aria-label="Bar chart of the ten largest economies by GDP"></canvas>
    <p class="chart-note">The United States is the largest economy at $27.7 trillion; China follows at $17.8 trillion. India grew fastest of the top ten, at +8.2%.</p>
  </section>

  <section class="two-col">
    <div>
      <h2>Longest lives</h2>
      <ol class="rank-list">
        ${topLife.map((c, i) => `<li><span class="rank-no">${i + 1}</span> ${countryLink(c.code)} <b>${c.lifeExpectancy.toFixed(1)} years</b></li>`).join('')}
      </ol>
      <p class="section-note">Life expectancy at birth, ${YEAR}. Switzerland and Japan top the list at over 84 years.</p>
    </div>
    <div>
      <h2>Fastest growing</h2>
      <ol class="rank-list">
        ${fastest.map((c, i) => `<li><span class="rank-no">${i + 1}</span> ${countryLink(c.code)} <b>+${c.gdpGrowth.toFixed(1)}%</b></li>`).join('')}
      </ol>
      <p class="section-note">Real GDP growth, ${YEAR}. India leads the 26 countries at +8.2%.</p>
    </div>
  </section>

  <section>
    <div class="section-head"><h2>Browse by region</h2></div>
    <div class="region-grid">
      ${['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'].map((region) => `
        <div class="region">
          <h3>${region}</h3>
          <ul>${COUNTRIES.filter((c) => c.region === region).map((c) => `<li>${countryLink(c.code)}</li>`).join('')}</ul>
        </div>`).join('')}
    </div>
  </section>`;
  drawGdpChart(rows);
  wireSearch();
}

function drawGdpChart(rows) {
  const canvas = document.getElementById('gdp-chart');
  if (!canvas) return;
  const draw = () => drawBarChart(canvas, rows, { prefix: '$', decimals: 0 });
  canvas._statAtlasDraw = draw;
  draw();
}

function renderCountry(code) {
  const country = countryByCode(code);
  if (!country) {
    view.innerHTML = `<section class="hero"><h1>Country not found</h1>
      <p class="lede">We cover 26 countries. <a href="#/">Back to the home page</a> or
      <a href="#/rankings">browse the rankings</a>.</p></section>`;
    return;
  }
  const peers = [...COUNTRIES].sort((a, b) => b.gdpPerCapita - a.gdpPerCapita);
  const capRank = rankOf(country, 'gdpPerCapita');
  const capRows = [
    ...peers.slice(0, 3).map((c) => ({ label: c.name, value: c.gdpPerCapita, highlight: c.code === country.code })),
    ...(capRank > 3 ? [{ label: country.name, value: country.gdpPerCapita, highlight: true }] : []),
    { label: 'World average', value: Math.round(WORLD.gdp * 1000 / WORLD.population), highlight: false },
  ].filter((r, i, arr) => arr.findIndex((x) => x.label === r.label) === i);
  const others = COUNTRIES.filter((c) => c.region === country.region && c.code !== country.code).slice(0, 6);
  view.innerHTML = `
  <section class="country-head">
    <p class="kicker"><a href="#/">All countries</a> &nbsp;·&nbsp; ${esc(country.region)} &nbsp;·&nbsp; ${YEAR}</p>
    <h1>${esc(country.name)}</h1>
    <p class="lede">Key statistics for ${esc(country.name)} in ${YEAR}, with each figure&rsquo;s source on the
    <a href="#/sources">Sources page</a>. Ranked against the ${COUNTRIES.length} countries on this site.</p>
  </section>
  <section class="card-grid">${INDICATORS.map((ind) => statCard(country, ind)).join('')}</section>
  <section>
    <div class="section-head"><h2>GDP per capita in context</h2></div>
    <p class="section-note">Current US dollars, ${YEAR}. ${esc(country.name)} ranks #${capRank} of ${COUNTRIES.length} on this site.</p>
    <canvas id="cap-chart" data-chart="cap" role="img" aria-label="Bar chart comparing GDP per capita"></canvas>
  </section>
  <section>
    <p><a class="chip" href="#/compare?a=${country.code}">Compare ${esc(country.name)} with other countries &rarr;</a></p>
    <h2>Reading the numbers</h2>
    <ul class="notes">
      <li><strong>Population ${country.population.toLocaleString('en-US')} million</strong> — about ${(country.population / WORLD.population * 100).toFixed(1)}% of the world&rsquo;s people.</li>
      <li><strong>GDP $${country.gdp.toLocaleString('en-US')} billion</strong> — about ${(country.gdp / WORLD.gdp * 100).toFixed(1)}% of world GDP.</li>
      <li><strong>Life expectancy ${country.lifeExpectancy.toFixed(1)} years</strong> — the world average is ${WORLD.lifeExpectancy} years.</li>
      <li><strong>Inflation ${country.inflation.toFixed(1)}%</strong> and <strong>unemployment ${country.unemployment.toFixed(1)}%</strong> are the 2023 annual figures; both move fast, so check the source for the latest release.</li>
    </ul>
  </section>
  ${others.length ? `<section><h2>Also in ${esc(country.region)}</h2>
    <p class="chip-row">${others.map((c) => `<a class="chip" href="#/country/${c.code}">${esc(c.name)}</a>`).join('')}</p></section>` : ''}`;
  const canvas = document.getElementById('cap-chart');
  if (canvas) {
    const draw = () => drawBarChart(canvas, capRows, { prefix: '$', decimals: 0 });
    canvas._statAtlasDraw = draw;
    draw();
  }
}

function renderCompare(params) {
  const metric = indicatorByKey(params.get('metric') || 'gdp');
  const wanted = ['a', 'b', 'c'].map((k) => params.get(k)).filter(Boolean);
  const picked = wanted.map((code) => countryByCode(code)).filter(Boolean);
  while (picked.length < 3) picked.push(null);
  const chosen = picked.filter(Boolean);
  const optionList = (selected) => `<option value="">— pick a country —</option>` +
    COUNTRIES.map((c) => `<option value="${c.code}" ${selected === c.code ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  view.innerHTML = `
  <section class="hero slim">
    <p class="kicker">Compare · ${YEAR}</p>
    <h1>Compare countries side by side</h1>
    <p class="lede">Pick up to three countries and see every indicator next to each other.
    The best value in each row is highlighted; for unemployment and inflation, lower is better.</p>
  </section>
  <section class="compare-pickers">
    ${['a', 'b', 'c'].map((k, i) => `
      <label>Country ${i + 1}
        <select id="pick-${k}" data-slot="${k}">${optionList(picked[i] ? picked[i].code : '')}</select>
      </label>`).join('')}
  </section>
  ${chosen.length === 0 ? `<p class="section-note">Pick a country above to start comparing. Try the United States, China and India.</p>` : `
  <div class="metric-picker" role="group" aria-label="Choose an indicator for the chart">
    ${INDICATORS.map((ind) => {
      const qs = new URLSearchParams(params);
      qs.set('metric', ind.key);
      return `<a class="chip ${ind.key === metric.key ? 'active' : ''}" href="#/compare?${qs.toString()}">${esc(ind.label)}</a>`;
    }).join('')}
  </div>
  <canvas id="compare-chart" data-chart="compare" role="img" aria-label="Bar chart comparing the chosen countries"></canvas>
  <div class="table-wrap">
  <table class="rank-table compare-table">
    <thead><tr><th>Indicator</th>${chosen.map((c) => `<th><a href="#/country/${c.code}">${esc(c.name)}</a></th>`).join('')}</tr></thead>
    <tbody>
      ${INDICATORS.map((ind) => {
        const values = chosen.map((c) => c[ind.key]);
        const best = ind.higherBetter === false ? Math.min(...values) : ind.higherBetter === true ? Math.max(...values) : null;
        return `<tr><td>${esc(ind.label)} <span class="unit">(${esc(ind.unit)})</span></td>${chosen.map((c) => `<td class="${best !== null && c[ind.key] === best ? 'best' : ''}">${esc(formatValue(c[ind.key], ind))}</td>`).join('')}</tr>`;
      }).join('')}
      <tr><td>Region</td>${chosen.map((c) => `<td>${esc(c.region)}</td>`).join('')}</tr>
    </tbody>
  </table>
  </div>
  <p class="section-note">Best value in each row is highlighted. Figures for ${YEAR}; sources on the <a href="#/sources">Sources page</a>.</p>`}
  <p class="section-note">Or start from a country page: every country page links here with that country pre-picked.</p>`;
  document.querySelectorAll('.compare-pickers select').forEach((sel) => {
    sel.addEventListener('change', () => {
      const next = new URLSearchParams(params);
      const slot = sel.dataset.slot;
      if (sel.value) next.set(slot, sel.value); else next.delete(slot);
      window.location.hash = `#/compare?${next.toString()}`;
    });
  });
  const canvas = document.getElementById('compare-chart');
  if (canvas && chosen.length) {
    const rows = chosen.map((c) => ({ label: c.name, value: c[metric.key], highlight: false }));
    const draw = () => drawBarChart(canvas, rows, { decimals: metric.decimals, suffix: metric.key === 'gdpGrowth' ? '%' : undefined, prefix: metric.key === 'gdp' || metric.key === 'gdpPerCapita' ? '$' : undefined });
    canvas._statAtlasDraw = draw;
    draw();
  }
}

function renderRankings(metricKey) {
  const metric = indicatorByKey(metricKey);
  const sorted = [...COUNTRIES].sort((a, b) => b[metric.key] - a[metric.key]);
  view.innerHTML = `
  <section class="hero slim">
    <p class="kicker">Rankings · ${YEAR}</p>
    <h1>Rank every country</h1>
    <p class="lede">All ${COUNTRIES.length} countries, sorted by the indicator you pick. Click a column
    heading to sort by it; click a country to open its page.</p>
  </section>
  <div class="metric-picker" role="group" aria-label="Choose an indicator">
    ${INDICATORS.map((ind) => `<a class="chip ${ind.key === metric.key ? 'active' : ''}" href="#/rankings?metric=${ind.key}">${esc(ind.label)}</a>`).join('')}
  </div>
  <p class="section-note">${esc(metric.blurb)} Figures for ${YEAR}; source: World Bank WDI (unemployment: ILO modelled estimate). Full sources on the <a href="#/sources">Sources page</a>.</p>
  <div class="table-wrap">
  <table class="rank-table">
    <thead><tr>
      <th>#</th><th>Country</th><th>Region</th>
      ${INDICATORS.map((ind) => `<th class="${ind.key === metric.key ? 'sorted' : ''}"><a href="#/rankings?metric=${ind.key}">${esc(ind.label)}</a></th>`).join('')}
    </tr></thead>
    <tbody>
      ${sorted.map((c, i) => `<tr>
        <td>${i + 1}</td>
        <td><a href="#/country/${c.code}">${esc(c.name)}</a></td>
        <td>${esc(c.region)}</td>
        ${INDICATORS.map((ind) => `<td class="${ind.key === metric.key ? 'sorted' : ''}">${esc(formatValue(c[ind.key], ind))}</td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table>
  </div>`;
}

function renderSources() {
  view.innerHTML = `
  <section class="hero slim">
    <p class="kicker">Method &amp; sources</p>
    <h1>Where every number comes from</h1>
    <p class="lede">Every figure on this site is a published statistic for ${YEAR}. Nothing here is
    estimated by us, and nothing is fetched live: the figures are stored in the site&rsquo;s own files,
    so the page works offline and the numbers you see are the numbers we checked.</p>
  </section>
  <section>
    <h2>Sources by indicator</h2>
    <table class="source-table">
      <thead><tr><th>Indicator</th><th>Source</th><th>Year</th><th>Note</th></tr></thead>
      <tbody>
        ${SOURCES.map((s) => `<tr><td>${esc(s.indicator)}</td><td>${esc(s.source)}</td><td>${s.year}</td><td>${esc(s.note)}</td></tr>`).join('')}
      </tbody>
    </table>
  </section>
  <section>
    <h2>How to read the figures</h2>
    <ul class="notes">
      <li>Money figures are in current US dollars, so they include price changes and exchange-rate moves; they are not adjusted for purchasing power.</li>
      <li>GDP per capita divides total GDP by population; it is an average, not what a typical person earns.</li>
      <li>Unemployment is the ILO modelled estimate, which lets countries be compared on the same definition.</li>
      <li>Figures are rounded for readability. For exact values and newer releases, see the World Bank&rsquo;s World Development Indicators.</li>
      <li>Coverage: the 26 largest economies and major countries by region. A country missing here is missing because we have not added it yet, not because its data does not exist.</li>
    </ul>
  </section>`;
}

function wireSearch() {
  const input = document.getElementById('country-search');
  const results = document.getElementById('search-results');
  if (!input || !results) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.innerHTML = ''; return; }
    const hits = COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q).slice(0, 8);
    results.innerHTML = hits.length
      ? hits.map((c) => `<a href="#/country/${c.code}">${esc(c.name)} <span>· ${esc(c.region)} · GDP $${c.gdp.toLocaleString('en-US')}bn</span></a>`).join('')
      : `<p class="no-hit">No country matches &ldquo;${esc(input.value.trim())}&rdquo; yet — we cover 26 countries so far.</p>`;
  });
}

function route() {
  const hash = window.location.hash || '#/';
  const [path, query] = hash.slice(2).split('?');
  const params = new URLSearchParams(query || '');
  window.scrollTo(0, 0);
  if (path === '' || path === '/') renderHome();
  else if (path.startsWith('country/')) renderCountry(path.split('/')[1]);
  else if (path === 'rankings') renderRankings(params.get('metric') || 'gdp');
  else if (path === 'compare') renderCompare(params);
  else if (path === 'sources') renderSources();
  else renderHome();
  document.querySelectorAll('nav a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('current', href === `#/${path.split('/')[0]}` || (path === '' && href === '#/'));
  });
}

window.addEventListener('hashchange', route);
window.addEventListener('resize', () => {
  document.querySelectorAll('canvas[data-chart]').forEach((canvas) => {
    if (typeof canvas._statAtlasDraw === 'function') canvas._statAtlasDraw();
  });
});
route();
