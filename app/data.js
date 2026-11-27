// StatAtlas data: headline national statistics for 26 countries, all for 2023
// unless a note says otherwise. Figures are rounded from the sources listed
// in SOURCES below; see the Sources page in the site for the full method note.
//   population: millions of people (World Bank WDI, SP.POP.TOTL)
//   gdp: billions of current US dollars (World Bank WDI, NY.GDP.MKTP.CD)
//   gdpPerCapita: current US dollars (World Bank WDI, NY.GDP.PCAP.CD)
//   gdpGrowth: annual % growth of GDP (World Bank WDI, NY.GDP.MKTP.KD.ZG)
//   unemployment: % of total labour force, ILO modelled estimate
//     (World Bank WDI, SL.UEM.TOTL.ZS)
//   inflation: consumer prices, annual % (World Bank WDI, FP.CPI.TOTL.ZG)
//   lifeExpectancy: years at birth (World Bank WDI, SP.DYN.LE00.IN)

export const YEAR = 2023;

export const INDICATORS = [
  { key: 'population', label: 'Population', unit: 'million', decimals: 1, higherBetter: null, blurb: 'People living in the country, mid-year estimate.' },
  { key: 'gdp', label: 'GDP', unit: 'US$ bn', decimals: 0, higherBetter: null, blurb: 'Gross domestic product in current US dollars.' },
  { key: 'gdpPerCapita', label: 'GDP per capita', unit: 'US$', decimals: 0, higherBetter: null, blurb: 'GDP divided by population, current US dollars.' },
  { key: 'gdpGrowth', label: 'GDP growth', unit: '% / year', decimals: 1, higherBetter: null, blurb: 'Annual percentage growth of real GDP.' },
  { key: 'unemployment', label: 'Unemployment', unit: '% of labour force', decimals: 1, higherBetter: false, blurb: 'Share of the labour force without work but available for and seeking employment (ILO modelled estimate).' },
  { key: 'inflation', label: 'Inflation', unit: '% / year', decimals: 1, higherBetter: false, blurb: 'Annual change in consumer prices.' },
  { key: 'lifeExpectancy', label: 'Life expectancy', unit: 'years', decimals: 1, higherBetter: true, blurb: 'Years a newborn would live if current mortality patterns held.' },
  { key: 'medianAge', label: 'Median age', unit: 'years', decimals: 1, higherBetter: null, blurb: 'The age that splits the population in half: half younger, half older.' },
];

export const COUNTRIES = [
  { code: 'US', name: 'United States', region: 'North America', population: 334.9, gdp: 27721, gdpPerCapita: 82770, gdpGrowth: 2.9, unemployment: 3.6, inflation: 4.1, lifeExpectancy: 78.4, medianAge: 38.5 },
  { code: 'CN', name: 'China', region: 'Asia', population: 1411.8, gdp: 17795, gdpPerCapita: 12600, gdpGrowth: 5.3, unemployment: 4.7, inflation: 0.2, lifeExpectancy: 78.0, medianAge: 39.0 },
  { code: 'IN', name: 'India', region: 'Asia', population: 1428.6, gdp: 3568, gdpPerCapita: 2500, gdpGrowth: 8.2, unemployment: 4.8, inflation: 5.4, lifeExpectancy: 72.0, medianAge: 28.7 },
  { code: 'DE', name: 'Germany', region: 'Europe', population: 84.7, gdp: 4526, gdpPerCapita: 53500, gdpGrowth: -0.3, unemployment: 3.0, inflation: 5.9, lifeExpectancy: 80.5, medianAge: 46.8 },
  { code: 'JP', name: 'Japan', region: 'Asia', population: 124.4, gdp: 4204, gdpPerCapita: 33800, gdpGrowth: 1.7, unemployment: 2.6, inflation: 3.3, lifeExpectancy: 84.0, medianAge: 49.0 },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', population: 68.4, gdp: 3380, gdpPerCapita: 49400, gdpGrowth: 0.3, unemployment: 4.0, inflation: 7.3, lifeExpectancy: 81.2, medianAge: 40.6 },
  { code: 'FR', name: 'France', region: 'Europe', population: 68.4, gdp: 3050, gdpPerCapita: 44900, gdpGrowth: 1.1, unemployment: 7.3, inflation: 4.9, lifeExpectancy: 82.8, medianAge: 42.3 },
  { code: 'IT', name: 'Italy', region: 'Europe', population: 58.9, gdp: 2300, gdpPerCapita: 39000, gdpGrowth: 0.7, unemployment: 7.7, inflation: 5.9, lifeExpectancy: 83.7, medianAge: 48.4 },
  { code: 'BR', name: 'Brazil', region: 'South America', population: 216.4, gdp: 2170, gdpPerCapita: 10000, gdpGrowth: 3.2, unemployment: 8.0, inflation: 4.6, lifeExpectancy: 75.8, medianAge: 34.0 },
  { code: 'CA', name: 'Canada', region: 'North America', population: 39.9, gdp: 2140, gdpPerCapita: 53400, gdpGrowth: 1.1, unemployment: 5.4, inflation: 3.9, lifeExpectancy: 81.6, medianAge: 41.5 },
  { code: 'RU', name: 'Russia', region: 'Europe', population: 144.2, gdp: 2020, gdpPerCapita: 14000, gdpGrowth: 3.6, unemployment: 3.2, inflation: 5.9, lifeExpectancy: 73.3, medianAge: 40.7 },
  { code: 'KR', name: 'South Korea', region: 'Asia', population: 51.7, gdp: 1710, gdpPerCapita: 33100, gdpGrowth: 1.4, unemployment: 2.7, inflation: 3.6, lifeExpectancy: 83.4, medianAge: 44.5 },
  { code: 'AU', name: 'Australia', region: 'Oceania', population: 26.5, gdp: 1720, gdpPerCapita: 64700, gdpGrowth: 2.1, unemployment: 3.7, inflation: 5.6, lifeExpectancy: 83.3, medianAge: 37.9 },
  { code: 'ES', name: 'Spain', region: 'Europe', population: 48.3, gdp: 1620, gdpPerCapita: 33100, gdpGrowth: 2.7, unemployment: 12.2, inflation: 3.5, lifeExpectancy: 84.0, medianAge: 45.1 },
  { code: 'MX', name: 'Mexico', region: 'North America', population: 129.7, gdp: 1790, gdpPerCapita: 13900, gdpGrowth: 3.3, unemployment: 2.8, inflation: 5.5, lifeExpectancy: 75.4, medianAge: 29.8 },
  { code: 'ID', name: 'Indonesia', region: 'Asia', population: 277.5, gdp: 1370, gdpPerCapita: 4900, gdpGrowth: 5.0, unemployment: 3.5, inflation: 3.7, lifeExpectancy: 71.1, medianAge: 30.5 },
  { code: 'NL', name: 'Netherlands', region: 'Europe', population: 17.9, gdp: 1120, gdpPerCapita: 62500, gdpGrowth: 0.1, unemployment: 3.6, inflation: 4.1, lifeExpectancy: 81.9, medianAge: 42.8 },
  { code: 'SA', name: 'Saudi Arabia', region: 'Asia', population: 33.7, gdp: 1070, gdpPerCapita: 30400, gdpGrowth: -0.8, unemployment: 4.9, inflation: 2.3, lifeExpectancy: 78.7, medianAge: 30.9 },
  { code: 'TR', name: 'Türkiye', region: 'Asia', population: 85.3, gdp: 1110, gdpPerCapita: 13100, gdpGrowth: 5.1, unemployment: 9.4, inflation: 53.9, lifeExpectancy: 77.2, medianAge: 34.0 },
  { code: 'CH', name: 'Switzerland', region: 'Europe', population: 8.8, gdp: 885, gdpPerCapita: 100000, gdpGrowth: 0.7, unemployment: 4.1, inflation: 2.3, lifeExpectancy: 84.1, medianAge: 43.4 },
  { code: 'PL', name: 'Poland', region: 'Europe', population: 37.7, gdp: 810, gdpPerCapita: 21800, gdpGrowth: 0.2, unemployment: 2.8, inflation: 11.4, lifeExpectancy: 78.5, medianAge: 42.1 },
  { code: 'AR', name: 'Argentina', region: 'South America', population: 45.8, gdp: 641, gdpPerCapita: 13700, gdpGrowth: -1.6, unemployment: 6.1, inflation: 133.5, lifeExpectancy: 77.5, medianAge: 32.9 },
  { code: 'SE', name: 'Sweden', region: 'Europe', population: 10.5, gdp: 593, gdpPerCapita: 56300, gdpGrowth: -0.2, unemployment: 7.7, inflation: 5.9, lifeExpectancy: 83.1, medianAge: 40.8 },
  { code: 'ZA', name: 'South Africa', region: 'Africa', population: 60.4, gdp: 378, gdpPerCapita: 6300, gdpGrowth: 0.7, unemployment: 28.0, inflation: 6.0, lifeExpectancy: 66.1, medianAge: 28.0 },
  { code: 'NG', name: 'Nigeria', region: 'Africa', population: 223.8, gdp: 363, gdpPerCapita: 1600, gdpGrowth: 2.9, unemployment: 5.4, inflation: 24.7, lifeExpectancy: 54.5, medianAge: 17.8 },
  { code: 'EG', name: 'Egypt', region: 'Africa', population: 112.7, gdp: 396, gdpPerCapita: 3500, gdpGrowth: 3.8, unemployment: 7.2, inflation: 33.9, lifeExpectancy: 70.2, medianAge: 24.7 },
];

export const WORLD = {
  population: 8090, // millions, World Bank WDI 2023
  gdp: 105440, // US$ bn, World Bank WDI 2023
  lifeExpectancy: 73.3, // years, World Bank WDI 2023
};

export const SOURCES = [
  { indicator: 'Population, GDP, GDP per capita, GDP growth, life expectancy', source: 'World Bank, World Development Indicators (WDI)', year: 2023, note: 'Current US$ for money figures; population is the mid-year estimate.' },
  { indicator: 'Unemployment', source: 'International Labour Organization (ILO), modelled estimates, via World Bank WDI', year: 2023, note: 'Share of the total labour force.' },
  { indicator: 'Inflation', source: 'World Bank, World Development Indicators (consumer prices, annual %)', year: 2023, note: 'Inflation as measured by the consumer price index.' },
  { indicator: 'Median age', source: 'United Nations, World Population Prospects 2024', year: 2023, note: 'Median age of the population, mid-year estimate.' },
  { indicator: 'World totals', source: 'World Bank, World Development Indicators', year: 2023, note: 'World population 8.09 billion; world GDP US$105.4 trillion; world life expectancy 73.3 years.' },
];

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === (code || '').toUpperCase()) || null;
}

export function rankOf(country, key) {
  const sorted = [...COUNTRIES].sort((a, b) => b[key] - a[key]);
  return sorted.findIndex((c) => c.code === country.code) + 1;
}

export function formatValue(value, indicator) {
  if (value === null || value === undefined) return '—';
  const n = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: indicator.decimals,
    maximumFractionDigits: indicator.decimals,
  });
  return indicator.key === 'gdpGrowth' ? `${value > 0 ? '+' : ''}${n}%` : n;
}
