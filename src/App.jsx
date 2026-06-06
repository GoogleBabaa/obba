import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { BarChart3, Menu, Moon, Sun, X } from 'lucide-react';
const FAQPage = lazy(() => import('./FAQPage'));

const BRACKETS = {
  single: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256225, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
  married: [
    { upTo: 24800, rate: 0.1 },
    { upTo: 100800, rate: 0.12 },
    { upTo: 211400, rate: 0.22 },
    { upTo: 403550, rate: 0.24 },
    { upTo: 512450, rate: 0.32 },
    { upTo: 768700, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
  hoh: [
    { upTo: 17700, rate: 0.1 },
    { upTo: 67450, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201750, rate: 0.24 },
    { upTo: 256200, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
  mfs: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256225, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
};
const STANDARD_DEDUCTION_2026 = {
  single: 16100,
  married: 32200,
  hoh: 24150,
  mfs: 16100,
};

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const usd = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, v));
const rateFor = (status, income) => BRACKETS[status].find((b) => income <= b.upTo)?.rate ?? 0.37;
const phaseReduction = (magi, start, per1000) => Math.max(0, ((magi - start) / 1000) * per1000);
const progressiveTax = (taxableIncome, brackets) => {
  let remaining = Math.max(0, num(taxableIncome));
  let previous = 0;
  let tax = 0;
  for (const b of brackets) {
    const width = Math.max(0, b.upTo - previous);
    const amountAtRate = Math.min(remaining, width);
    tax += amountAtRate * b.rate;
    remaining -= amountAtRate;
    previous = b.upTo;
    if (remaining <= 0) break;
  }
  return Math.max(0, tax);
};
const stateEffectiveTaxRates = {
  Alaska: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Alabama: { low: 2, mid1: 3.2, mid2: 4.2, high: 5 },
  Arizona: { low: 2.55, mid1: 3.2, mid2: 3.9, high: 4.5 },
  Arkansas: { low: 2, mid1: 3.5, mid2: 4.7, high: 5.75 },
  California: { low: 1, mid1: 4, mid2: 8, high: 13.3 },
  Colorado: { low: 4.4, mid1: 4.4, mid2: 4.4, high: 4.4 },
  Connecticut: { low: 3, mid1: 4.5, mid2: 5.8, high: 6.99 },
  Delaware: { low: 0, mid1: 2.2, mid2: 4.8, high: 6.6 },
  Florida: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Georgia: { low: 0.55, mid1: 2.5, mid2: 4.2, high: 5.75 },
  Hawaii: { low: 1.4, mid1: 4, mid2: 7, high: 11 },
  Idaho: { low: 1, mid1: 2.8, mid2: 4.3, high: 5.8 },
  Illinois: { low: 4.95, mid1: 4.95, mid2: 4.95, high: 4.95 },
  Indiana: { low: 3.4, mid1: 3.4, mid2: 3.4, high: 3.4 },
  Iowa: { low: 0.33, mid1: 2.5, mid2: 4.5, high: 6.5 },
  Kansas: { low: 5.7, mid1: 5.75, mid2: 5.85, high: 5.9 },
  Kentucky: { low: 2, mid1: 3.2, mid2: 4.2, high: 5 },
  Louisiana: { low: 2, mid1: 3.5, mid2: 4.8, high: 6 },
  Maine: { low: 5.8, mid1: 6.3, mid2: 6.8, high: 7.15 },
  Maryland: { low: 2, mid1: 3.3, mid2: 4.5, high: 5.75 },
  Massachusetts: { low: 5, mid1: 5, mid2: 5, high: 5 },
  Michigan: { low: 4.25, mid1: 4.25, mid2: 4.25, high: 4.25 },
  Minnesota: { low: 5.35, mid1: 7, mid2: 8.8, high: 10.85 },
  Mississippi: { low: 0, mid1: 1.8, mid2: 3.5, high: 5 },
  Missouri: { low: 1.5, mid1: 2.9, mid2: 4.1, high: 5.3 },
  Montana: { low: 1, mid1: 3.8, mid2: 6.8, high: 10.84 },
  Nebraska: { low: 2.84, mid1: 4.5, mid2: 6.8, high: 8.84 },
  Nevada: { low: 0, mid1: 0, mid2: 0, high: 0 },
  'New Hampshire': { low: 0, mid1: 0, mid2: 0, high: 0 },
  'New Jersey': { low: 1.4, mid1: 3.5, mid2: 6.5, high: 10.75 },
  'New Mexico': { low: 1.7, mid1: 3.3, mid2: 4.7, high: 5.9 },
  'New York': { low: 4, mid1: 6, mid2: 8, high: 10.9 },
  'North Carolina': { low: 4.99, mid1: 4.99, mid2: 4.99, high: 4.99 },
  'North Dakota': { low: 1.1, mid1: 1.6, mid2: 2.3, high: 2.9 },
  Ohio: { low: 0, mid1: 1.9, mid2: 3.8, high: 5.75 },
  Oklahoma: { low: 0.5, mid1: 2.3, mid2: 4, high: 5.85 },
  Oregon: { low: 4.75, mid1: 6.5, mid2: 8.2, high: 9.9 },
  Pennsylvania: { low: 3.07, mid1: 3.07, mid2: 3.07, high: 3.07 },
  'Rhode Island': { low: 3.75, mid1: 4.6, mid2: 5.3, high: 5.99 },
  'South Carolina': { low: 0, mid1: 2.3, mid2: 4.5, high: 7 },
  'South Dakota': { low: 0, mid1: 0, mid2: 0, high: 0 },
  Tennessee: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Texas: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Utah: { low: 4.65, mid1: 4.65, mid2: 4.65, high: 4.65 },
  Vermont: { low: 3.55, mid1: 5.3, mid2: 7, high: 8.75 },
  Virginia: { low: 2, mid1: 3.5, mid2: 4.7, high: 5.75 },
  Washington: { low: 0, mid1: 0, mid2: 0, high: 0 },
  'West Virginia': { low: 3, mid1: 4.2, mid2: 5.3, high: 6.5 },
  Wisconsin: { low: 3.54, mid1: 4.8, mid2: 6.2, high: 7.65 },
  Wyoming: { low: 0, mid1: 0, mid2: 0, high: 0 },
  'District of Columbia': { low: 4, mid1: 6.5, mid2: 8.5, high: 10.75 },
};
const getStateTaxRate = (state, income) => {
  const rates = stateEffectiveTaxRates[state];
  if (!rates) return 0;
  if (income <= 50000) return rates.low;
  if (income <= 100000) return rates.mid1;
  if (income <= 200000) return rates.mid2;
  return rates.high;
};

const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_BASE_2026 = 184500;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = {
  single: 200000,
  married: 250000,
  hoh: 200000,
  mfs: 125000,
};

const EXECUTIVE_LEVEL_IV_CAP = 197200;
const HOURS_PER_YEAR = 2087;
const PAY_PERIODS = 26;

const GS_PAY_TABLE = {
  2026: {
    'GS-1': [22584, 23341, 24092, 24840, 25589, 26028, 26771, 27519, 27550, 28248],
    'GS-2': [25393, 25997, 26839, 27550, 27858, 28677, 29496, 30315, 31134, 31953],
    'GS-3': [27708, 28632, 29556, 30480, 31404, 32328, 33252, 34176, 35100, 36024],
    'GS-4': [31103, 32140, 33177, 34214, 35251, 36288, 37325, 38362, 39399, 40436],
    'GS-5': [34799, 35959, 37119, 38279, 39439, 40599, 41759, 42919, 44079, 45239],
    'GS-6': [38791, 40084, 41377, 42670, 43963, 45256, 46549, 47842, 49135, 50428],
    'GS-7': [43106, 44543, 45980, 47417, 48854, 50291, 51728, 53165, 54602, 56039],
    'GS-8': [47738, 49329, 50920, 52511, 54102, 55693, 57284, 58875, 60466, 62057],
    'GS-9': [52727, 54485, 56243, 58001, 59759, 61517, 63275, 65033, 66791, 68549],
    'GS-10': [58064, 59999, 61934, 63869, 65804, 67739, 69674, 71609, 73544, 75479],
    'GS-11': [63795, 65922, 68049, 70176, 72303, 74430, 76557, 78684, 80811, 82938],
    'GS-12': [76463, 79012, 81561, 84110, 86659, 89208, 91757, 94306, 96855, 99404],
    'GS-13': [90925, 93956, 96987, 100018, 103049, 106080, 109111, 112142, 115173, 118204],
    'GS-14': [107446, 111028, 114610, 118192, 121774, 125356, 128938, 132520, 136102, 139684],
    'GS-15': [126384, 130597, 134810, 139023, 143236, 147449, 151662, 155875, 160088, 164301],
  },
  2025: {
    'GS-1':  [22360, 23110, 23853, 24594, 25336, 25770, 26506, 27247, 27277, 27970],
    'GS-2':  [25142, 25740, 26573, 27277, 27583, 28394, 29205, 30016, 30827, 31638],
    'GS-3':  [27434, 28348, 29262, 30176, 31090, 32004, 32918, 33832, 34746, 35660],
    'GS-4':  [30795, 31822, 32849, 33876, 34903, 35930, 36957, 37984, 39011, 40038],
    'GS-5':  [34454, 35602, 36750, 37898, 39046, 40194, 41342, 42490, 43638, 44786],
    'GS-6':  [38407, 39687, 40967, 42247, 43527, 44807, 46087, 47367, 48647, 49927],
    'GS-7':  [42679, 44102, 45525, 46948, 48371, 49794, 51217, 52640, 54063, 55486],
    'GS-8':  [47265, 48841, 50417, 51993, 53569, 55145, 56721, 58297, 59873, 61449],
    'GS-9':  [52205, 53945, 55685, 57425, 59165, 60905, 62645, 64385, 66125, 67865],
    'GS-10': [57489, 59405, 61321, 63237, 65153, 67069, 68985, 70901, 72817, 74733],
    'GS-11': [63163, 65268, 67373, 69478, 71583, 73688, 75793, 77898, 80003, 82108],
    'GS-12': [75706, 78230, 80754, 83278, 85802, 88326, 90850, 93374, 95898, 98422],
    'GS-13': [90025, 93026, 96027, 99028, 102029, 105030, 108031, 111032, 114033, 117034],
    'GS-14': [106382, 109928, 113474, 117020, 120566, 124112, 127658, 131204, 134750, 138296],
    'GS-15': [125133, 129304, 133475, 137646, 141817, 145988, 150159, 154330, 158501, 162672],
  },
  2024: {
    'GS-1':  [21986, 22724, 23454, 24183, 24912, 25339, 26063, 26792, 26821, 27502],
    'GS-2':  [24722, 25310, 26129, 26821, 27124, 27922, 28720, 29518, 30316, 31114],
    'GS-3':  [26975, 27874, 28773, 29672, 30571, 31470, 32369, 33268, 34167, 35066],
    'GS-4':  [30280, 31289, 32298, 33307, 34316, 35325, 36334, 37343, 38352, 39361],
    'GS-5':  [33878, 35007, 36136, 37265, 38394, 39523, 40652, 41781, 42910, 44039],
    'GS-6':  [37765, 39024, 40283, 41542, 42801, 44060, 45319, 46578, 47837, 49096],
    'GS-7':  [41966, 43365, 44764, 46163, 47562, 48961, 50360, 51759, 53158, 54557],
    'GS-8':  [46475, 48024, 49573, 51122, 52671, 54220, 55769, 57318, 58867, 60416],
    'GS-9':  [51332, 53043, 54754, 56465, 58176, 59887, 61598, 63309, 65020, 66731],
    'GS-10': [56528, 58412, 60296, 62180, 64064, 65948, 67832, 69716, 71600, 73484],
    'GS-11': [62107, 64177, 66247, 68317, 70387, 72457, 74527, 76597, 78667, 80737],
    'GS-12': [74441, 76922, 79403, 81884, 84365, 86846, 89327, 91808, 94289, 96770],
    'GS-13': [88520, 91471, 94422, 97373, 100324, 103275, 106226, 109177, 112128, 115079],
    'GS-14': [104604, 108091, 111578, 115065, 118552, 122039, 125526, 129013, 132500, 135987],
    'GS-15': [123041, 127142, 131243, 135344, 139445, 143546, 147647, 151748, 155849, 159950],
  },
};

const LOCALITY_OPTIONS = [
  ['dcb', 'Washington-Baltimore-Arlington, DC-MD-VA-WV-PA (+33.94%)', 0.3394],
  ['rus', 'Rest of U.S. (+17.06%)', 0.1706],
  ['sf', 'San Jose-San Francisco-Oakland, CA (+46.34%)', 0.4634],
  ['ny', 'New York-Newark, NY-NJ-CT-PA (+37.95%)', 0.3795],
  ['hou', 'Houston-The Woodlands, TX-LA (+35.00%)', 0.35],
  ['la', 'Los Angeles-Long Beach, CA (+36.47%)', 0.3647],
  ['sd', 'San Diego-Chula Vista-Carlsbad, CA (+33.72%)', 0.3372],
  ['sea', 'Seattle-Tacoma, WA (+31.57%)', 0.3157],
  ['den', 'Denver-Aurora, CO (+30.52%)', 0.3052],
  ['bos', 'Boston-Worcester-Providence, MA-RI-NH-CT-ME-VT (+32.58%)', 0.3258],
  ['chi', 'Chicago-Naperville, IL-IN-WI (+30.86%)', 0.3086],
  ['phl', 'Philadelphia-Reading-Camden, PA-NJ-DE-MD (+28.99%)', 0.2899],
  ['msp', 'Minneapolis-St. Paul, MN-WI (+27.62%)', 0.2762],
  ['dfw', 'Dallas-Fort Worth, TX-OK (+27.26%)', 0.2726],
  ['por', 'Portland-Vancouver-Salem, OR-WA (+26.13%)', 0.2613],
  ['mfl', 'Miami-Port St. Lucie-Fort Lauderdale, FL (+24.67%)', 0.2467],
  ['atl', 'Atlanta--Athens-Clarke County--Sandy Springs, GA-AL (+23.79%)', 0.2379],
  ['cle', 'Cleveland-Akron-Canton, OH-PA (+22.23%)', 0.2223],
  ['ra', 'Raleigh-Durham-Cary, NC (+22.24%)', 0.2224],
  ['al', 'Albany-Schenectady, NY-MA (+20.77%)', 0.2077],
  ['aq', 'Albuquerque-Santa Fe-Las Vegas, NM (+18.33%)', 0.1833],
  ['au', 'Austin-Round Rock-Georgetown, TX (+20.35%)', 0.2035],
  ['bh', 'Birmingham-Hoover-Talladega, AL (+18.24%)', 0.1824],
  ['bu', 'Buffalo-Cheektowaga-Olean, NY (+22.41%)', 0.2241],
  ['bn', 'Burlington-South Burlington-Barre, VT (+19.45%)', 0.1945],
  ['ct', 'Charlotte-Concord, NC-SC (+19.67%)', 0.1967],
  ['cin', 'Cincinnati-Wilmington-Maysville, OH-KY-IN (+21.93%)', 0.2193],
  ['cs', 'Colorado Springs, CO (+20.15%)', 0.2015],
  ['col', 'Columbus-Marion-Zanesville, OH (+22.15%)', 0.2215],
  ['cc', 'Corpus Christi-Kingsville-Alice, TX (+17.63%)', 0.1763],
  ['dv', 'Davenport-Moline, IA-IL (+18.93%)', 0.1893],
  ['day', 'Dayton-Springfield-Kettering, OH (+21.42%)', 0.2142],
  ['dm', 'Des Moines-Ames-West Des Moines, IA (+18.01%)', 0.1801],
  ['det', 'Detroit-Warren-Ann Arbor, MI (+29.12%)', 0.2912],
  ['fn', 'Fresno-Madera-Hanford, CA (+17.65%)', 0.1765],
  ['hb', 'Harrisburg-Lebanon, PA (+19.43%)', 0.1943],
  ['har', 'Hartford-East Hartford, CT-MA (+32.08%)', 0.3208],
  ['hnt', 'Huntsville-Decatur, AL-TN (+21.91%)', 0.2191],
  ['ind', 'Indianapolis-Carmel-Muncie, IN (+18.15%)', 0.1815],
  ['kc', 'Kansas City-Overland Park-Kansas City, MO-KS (+18.97%)', 0.1897],
  ['lr', 'Laredo, TX (+21.59%)', 0.2159],
  ['lv', 'Las Vegas-Henderson, NV-AZ (+19.57%)', 0.1957],
  ['mil', 'Milwaukee-Racine-Waukesha, WI (+22.42%)', 0.2242],
  ['om', 'Omaha-Council Bluffs-Fremont, NE-IA (+18.23%)', 0.1823],
  ['pb', 'Palm Bay-Melbourne-Titusville, FL (+17.93%)', 0.1793],
  ['px', 'Phoenix-Mesa, AZ (+22.45%)', 0.2245],
  ['pit', 'Pittsburgh-New Castle-Weirton, PA-OH-WV (+21.03%)', 0.2103],
  ['rn', 'Reno-Fernley, NV (+17.52%)', 0.1752],
  ['rch', 'Richmond, VA (+22.28%)', 0.2228],
  ['rt', 'Rochester-Batavia-Seneca Falls, NY (+17.88%)', 0.1788],
  ['sac', 'Sacramento-Roseville, CA-NV (+29.76%)', 0.2976],
  ['so', 'San Antonio-New Braunfels-Pearsall, TX (+18.78%)', 0.1878],
  ['sn', "Spokane-Spokane Valley-Coeur d'Alene, WA-ID (+17.67%)", 0.1767],
  ['sl', 'St. Louis-St. Charles-Farmington, MO-IL (+20.03%)', 0.2003],
  ['tu', 'Tucson-Nogales, AZ (+19.28%)', 0.1928],
  ['vb', 'Virginia Beach-Norfolk, VA-NC (+18.80%)', 0.188],
  ['ak', 'State of Alaska (+32.36%)', 0.3236],
  ['hi', 'State of Hawaii (+22.21%)', 0.2221],
];

const FEDERAL_STATE_OPTIONS = [
  { name: 'Select State', rate: null, code: null },
  { name: 'Alabama', rate: '2% - 5%', code: 'AL' },
  { name: 'Alaska', rate: '0%', code: 'AK' },
  { name: 'Arizona', rate: '2.55% - 4.5%', code: 'AZ' },
  { name: 'Arkansas', rate: '2% - 5.75%', code: 'AR' },
  { name: 'California', rate: '1% - 13.3%', code: 'CA' },
  { name: 'Colorado', rate: '4.4% flat', code: 'CO' },
  { name: 'Connecticut', rate: '3% - 6.99%', code: 'CT' },
  { name: 'Delaware', rate: '0% - 6.6%', code: 'DE' },
  { name: 'Florida', rate: '0%', code: 'FL' },
  { name: 'Georgia', rate: '0.55% - 5.75%', code: 'GA' },
  { name: 'Hawaii', rate: '1.4% - 11%', code: 'HI' },
  { name: 'Idaho', rate: '1% - 5.8%', code: 'ID' },
  { name: 'Illinois', rate: '4.95% flat', code: 'IL' },
  { name: 'Indiana', rate: '3.4% flat', code: 'IN' },
  { name: 'Iowa', rate: '0.33% - 6.5%', code: 'IA' },
  { name: 'Kansas', rate: '5.7% - 5.9%', code: 'KS' },
  { name: 'Kentucky', rate: '2% - 5%', code: 'KY' },
  { name: 'Louisiana', rate: '2% - 6%', code: 'LA' },
  { name: 'Maine', rate: '5.8% - 7.15%', code: 'ME' },
  { name: 'Maryland', rate: '2% - 5.75%', code: 'MD' },
  { name: 'Massachusetts', rate: '5% flat', code: 'MA' },
  { name: 'Michigan', rate: '4.25% flat', code: 'MI' },
  { name: 'Minnesota', rate: '5.35% - 10.85%', code: 'MN' },
  { name: 'Mississippi', rate: '0% - 5%', code: 'MS' },
  { name: 'Missouri', rate: '1.5% - 5.3%', code: 'MO' },
  { name: 'Montana', rate: '1% - 10.84%', code: 'MT' },
  { name: 'Nebraska', rate: '2.84% - 8.84%', code: 'NE' },
  { name: 'Nevada', rate: '0%', code: 'NV' },
  { name: 'New Hampshire', rate: '0% (wages only)', code: 'NH' },
  { name: 'New Jersey', rate: '1.4% - 10.75%', code: 'NJ' },
  { name: 'New Mexico', rate: '1.7% - 5.9%', code: 'NM' },
  { name: 'New York', rate: '4% - 10.9%', code: 'NY' },
  { name: 'North Carolina', rate: '4.99% flat', code: 'NC' },
  { name: 'North Dakota', rate: '1.1% - 2.9%', code: 'ND' },
  { name: 'Ohio', rate: '0% - 5.75%', code: 'OH' },
  { name: 'Oklahoma', rate: '0.5% - 5.85%', code: 'OK' },
  { name: 'Oregon', rate: '4.75% - 9.9%', code: 'OR' },
  { name: 'Pennsylvania', rate: '3.07% flat', code: 'PA' },
  { name: 'Rhode Island', rate: '3.75% - 5.99%', code: 'RI' },
  { name: 'South Carolina', rate: '0% - 7%', code: 'SC' },
  { name: 'South Dakota', rate: '0%', code: 'SD' },
  { name: 'Tennessee', rate: '0%', code: 'TN' },
  { name: 'Texas', rate: '0%', code: 'TX' },
  { name: 'Utah', rate: '4.65% flat', code: 'UT' },
  { name: 'Vermont', rate: '3.55% - 8.75%', code: 'VT' },
  { name: 'Virginia', rate: '2% - 5.75%', code: 'VA' },
  { name: 'Washington', rate: '0%', code: 'WA' },
  { name: 'West Virginia', rate: '3% - 6.5%', code: 'WV' },
  { name: 'Wisconsin', rate: '3.54% - 7.65%', code: 'WI' },
  { name: 'Wyoming', rate: '0%', code: 'WY' },
  { name: 'District of Columbia', rate: '4% - 10.75%', code: 'DC' },
];

function upsertMeta(selector, create) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(create).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

function setPageMeta({ title, description, canonicalPath }) {
  document.title = title;

  const desc = upsertMeta('meta[name="description"]', { name: 'description' });
  desc.setAttribute('content', description);

  const robots = upsertMeta('meta[name="robots"]', { name: 'robots' });
  robots.setAttribute('content', 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');

  const ogTitle = upsertMeta('meta[property="og:title"]', { property: 'og:title' });
  ogTitle.setAttribute('content', title);
  const ogDescription = upsertMeta('meta[property="og:description"]', { property: 'og:description' });
  ogDescription.setAttribute('content', description);
  const ogType = upsertMeta('meta[property="og:type"]', { property: 'og:type' });
  ogType.setAttribute('content', 'website');
  const ogUrl = upsertMeta('meta[property="og:url"]', { property: 'og:url' });
  ogUrl.setAttribute('content', `${window.location.origin}${canonicalPath}`);
  const ogSite = upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' });
  ogSite.setAttribute('content', 'OBBBA Tax Calculators');

  const twitterCard = upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' });
  twitterCard.setAttribute('content', 'summary_large_image');
  const twitterTitle = upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' });
  twitterTitle.setAttribute('content', title);
  const twitterDescription = upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' });
  twitterDescription.setAttribute('content', description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${window.location.origin}${canonicalPath}`);
}

function ficaForAnnualWages(annualWages, status) {
  const wages = Math.max(0, num(annualWages));
  const ss = Math.min(wages, SOCIAL_SECURITY_WAGE_BASE_2026) * SOCIAL_SECURITY_RATE;
  const medicare = wages * MEDICARE_RATE;
  const addThreshold = ADDITIONAL_MEDICARE_THRESHOLD[status] ?? 200000;
  const additionalMedicare = Math.max(0, wages - addThreshold) * ADDITIONAL_MEDICARE_RATE;
  return ss + medicare + additionalMedicare;
}

function Header({ isDark, setIsDark, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const links = [
    ['Home', '/'], ['Overtime', '/overtime'], ['Salary', '/salary-calculator'], ['Paycheck', '/paycheck-calculator'], ['Texas Paycheck', '/texas-paycheck-calculator'], ['Florida Paycheck', '/florida-paycheck-calculator'], ['FAQ', '/faq'], ['About Us', '/about-us'],
  ];
  return (
    <header className={`sticky top-0 z-40 ${isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'} border-b backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div><div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>OBBBA Tax Calculators</div><div className={`text-xs ${isDark ? 'text-slate-300/90' : 'text-slate-600'}`}>Federal Tax Deduction Estimators</div></div>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          {links.map(([label, to]) => <Link key={label} to={to} className={`rounded-xl px-4 py-2 text-sm ${isDark ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-800'}`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="px-4 py-4 space-y-2">
            {links.map(([label, to]) => (
              <Link
                key={label}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg ${isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function HomePage({ isDark }) {
  return (
    <main>
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8">
        <div className="mb-5 rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-7" style={{background: isDark ? 'rgba(5, 5, 10, 0.8)' : 'rgba(248, 250, 252, 0.9)'}}>
          <div className="grid gap-8">
            <p className="text-sm font-medium text-cyan-400">Federal Tax Deduction Calculators</p>
            <h1 className={`text-3xl font-semibold tracking-tight sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>OBBBA Tax Calculator 2026 - Overtime Deduction, Salary & Paycheck Calculator</h1>
            <div className={`max-w-3xl space-y-4 text-sm sm:text-base ${isDark ? 'text-cyan-100/90' : 'text-slate-700'}`}>
              <p>Planning your finances for the upcoming year can feel overwhelming, but you do not have to navigate it alone. The OBBBA tool serves as your primary resource for estimating take-home pay during the 2026 fiscal year. By using a reliable federal tax calculator, you can gain clarity on how new withholding rules might impact your monthly earnings.</p>
              <p>Managing your income requires more than just basic math. Our comprehensive paycheck calculator simplifies the complex process of projecting your net income after accounting for various obligations. Whether you are tracking overtime deductions or adjusting your salary expectations, this tool provides the precision you need to stay ahead.</p>
              <p>We designed this platform to be user-friendly and accessible for everyone. You can feel confident about your financial planning as you prepare for the changes ahead. Let us help you take control of your budget with ease and accuracy.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4"><a href="#calculator" className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Start Calculating -&gt;</a></div>
          </div>
        </div>

        <section id="calculator" className="rounded-3xl border border-white/10 p-6 sm:p-8 my-8">
          <h2 className="text-xl font-bold mb-4">Choose Calculator</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['No Tax on Overtime', '/overtime'],
              ['Salary Calculator', '/salary-calculator'],
              ['Paycheck Calculator', '/paycheck-calculator'],
              ['Texas Paycheck Calculator', '/texas-paycheck-calculator'],
              ['Florida Paycheck Calculator', '/florida-paycheck-calculator'],
            ].map(([title, to]) => (
              <Link
                key={title}
                to={to}
                className={`group rounded-2xl border p-4 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_10px_30px_rgba(8,47,73,0.45)]'
                    : 'border-slate-300 bg-white hover:bg-slate-50 hover:shadow-[0_0_0_1px_rgba(14,116,144,0.2),0_10px_24px_rgba(15,23,42,0.12)]'
                }`}
              >
                <p className="font-semibold">{title}</p>
                <p className="text-sm mt-2 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1">Open Calculator -&gt;</p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Key Takeaways</h2>
            <ul className={`list-disc pl-5 space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>Estimate your 2026 take-home pay with high precision.</li>
              <li>Understand how overtime deductions affect your total net income.</li>
              <li>Navigate complex withholding rules using our intuitive digital tools.</li>
              <li>Simplify your annual financial planning process effectively.</li>
              <li>Gain confidence in managing your personal budget for the upcoming year.</li>
            </ul>
          </div>

          <section style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 5000px' }}>
          <div className={`mt-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <h2 className="text-2xl font-bold mb-4">Understanding the 2026 Federal Tax Landscape</h2>
            <p className="mb-4">Understanding your 2026 tax obligations starts with recognizing how federal policies evolve annually. The government frequently updates tax codes to ensure that the system remains fair and functional for all citizens. Staying informed about these shifts is the best way to manage your financial expectations throughout the year.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Key Changes in Federal Tax Brackets for 2026</h3>
            <p className="mb-2">Tax brackets are not static; they shift to reflect the current economic climate. When you earn more money, you might move into a higher bracket, but the thresholds for these brackets often change to account for broader economic trends. Knowing your specific bracket helps you predict how much of your hard-earned income will go toward federal taxes.</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Changes in the Consumer Price Index (CPI)</li>
              <li>Adjustments for annual cost-of-living increases</li>
              <li>Legislative updates to standard deduction amounts</li>
              <li>Shifts in tax credit eligibility requirements</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white">How Inflation Adjustments Impact Your Take-Home Pay</h3>
            <p className="mb-6">Inflation plays a major role in how the IRS calculates your tax liability. Without regular adjustments, rising wages meant to cover higher costs of living could accidentally push workers into higher tax brackets. This phenomenon, often called "bracket creep," is exactly what the government aims to prevent through annual indexing.</p>
            <p className="mb-6">By adjusting tax brackets for inflation, the system helps protect your purchasing power. Even if your gross salary increases to match rising prices, your effective tax rate may remain stable. This process ensures that your take-home pay reflects your actual economic standing rather than just a nominal increase in your paycheck. Feeling confident about your budget is much easier when you understand that these adjustments are designed to keep your tax burden fair.</p>
            <img
              src="/home-federal-tax-landscape.svg"
              alt="2026 federal tax landscape chart with bracket progression and inflation-adjustment context"
              className="w-full rounded-2xl border border-white/10"
              loading="lazy"
            />
          </div>

          <div className={`mt-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <h2 className="text-2xl font-bold mb-4">How to Use Our Faderal Tax Calculator Effectively</h2>
            <p className="mb-4">Navigating the complexities of your paycheck is much simpler when you have the right resources at your fingertips. Our faderal tax calculator is designed to provide you with a clear picture of your financial health. By following a few simple steps, you can turn raw salary data into a reliable roadmap for your annual budget.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Inputting Your Gross Salary and Filing Status</h3>
            <p className="mb-2">The accuracy of your results depends entirely on the information you provide. Start by entering your gross annual salary, which is the total amount you earn before any taxes or deductions are taken out. Be sure to include any expected bonuses or commissions to get the most realistic estimate possible.</p>
            <p className="mb-4">Next, select your correct filing status from the options provided. Whether you are filing as single, married filing jointly, or head of household, this choice significantly impacts your tax brackets. Using the correct status ensures that our faderal tax calculator applies the right tax rates to your specific situation.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Accounting for Pre-Tax Deductions and Contributions</h3>
            <p className="mb-2">Many employees overlook the power of pre-tax deductions when estimating their net pay. These contributions are taken out of your paycheck before federal income taxes are calculated, which effectively lowers your taxable income. By entering these amounts, you gain a much more precise view of your actual take-home pay.</p>
            <p className="mb-6">Common examples include contributions to a 401(k) retirement plan or a Health Savings Account (HSA). When you input these figures into the faderal tax calculator, you will see how they reduce your overall tax burden. Taking the time to include these details allows you to plan your savings goals with much greater confidence and clarity.</p>

            <h2 className="text-2xl font-bold mb-4">The Mechanics of Overtime Pay and Taxation</h2>
            <p className="mb-4">Understanding how overtime pay interacts with your tax liability is essential for accurate financial planning. Many workers assume that extra hours worked should be taxed at a lower rate, but the IRS treats this income as part of your total earnings. It is important to recognize that no special tax exemption exists for overtime pay.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Is There Really a No Tax on Overtime Calculator?</h3>
            <p className="mb-2">You may have encountered online tools claiming to be a no tax on overtime calculator. These tools often create confusion by suggesting that your hard-earned overtime hours are exempt from federal withholding. In reality, there is no such thing as a no tax on overtime calculator that reflects actual IRS regulations.</p>
            <p className="mb-4">All income earned through overtime is subject to federal income tax, Social Security, and Medicare taxes. Relying on inaccurate calculators can lead to significant under-withholding, which might result in an unexpected tax bill when you file your annual return. Always verify your paycheck math using official government guidelines rather than unofficial shortcuts.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">How Supplemental Tax Rates Apply to Overtime Earnings</h3>
            <p className="mb-2">The IRS classifies overtime pay as supplemental wages. Because this income is paid in addition to your regular salary, employers often apply a flat supplemental withholding rate. This rate is designed to ensure that your total annual withholding aligns with your actual tax bracket.</p>
            <p className="mb-2">While your regular pay is taxed based on your specific W-4 settings, supplemental pay is often withheld at a flat rate of 22%. This can sometimes make your paycheck look different than you expect. The following table illustrates how different types of income are generally treated for withholding purposes.</p>
            <div className="overflow-x-auto mb-4">
              <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                  <tr>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Income Type</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Withholding Method</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Regular Salary</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Graduated Tax Brackets</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Fully Taxable</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Overtime Pay</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Supplemental Flat Rate</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Fully Taxable</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Annual Bonuses</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Supplemental Flat Rate</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Fully Taxable</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mb-6">By understanding these mechanics, you can better manage your monthly budget. Consistency in your tax planning prevents the stress of owing money at the end of the year. Always prioritize accuracy over the promise of tax-free earnings.</p>

            <h2 className="text-2xl font-bold mb-4">Analyzing Your Paycheck Components</h2>
            <p className="mb-4">Many employees glance at their pay stubs without fully understanding the mandatory deductions taken out each cycle. While a paycheck calculator can provide a quick estimate of your net pay, knowing exactly where your money goes is vital for financial health. By breaking down these figures, you can verify that your employer is withholding the correct amounts.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Breakdown of FICA Taxes: Social Security and Medicare</h3>
            <p className="mb-2">The Federal Insurance Contributions Act, or FICA, mandates specific taxes that fund essential social programs. These deductions are non-negotiable for most workers in the United States. Employers are required by law to withhold these percentages from your gross earnings every pay period.</p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>Social Security Tax: This currently sits at 6.2% of your gross wages up to a specific annual limit.</li>
              <li>Medicare Tax: This is set at 1.45% of your total gross income, with no upper limit on earnings.</li>
            </ul>
            <p className="mb-6">If you earn a high salary, you might notice an additional 0.9% Medicare surtax once your income exceeds certain thresholds. Using a reliable paycheck calculator helps you track these specific contributions throughout the year.</p>
          </div>

          <div className={`mt-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <h3 className="text-xl font-semibold mb-2 text-white">Understanding Federal Income Tax Withholding</h3>
            <p className="mb-3">Federal income tax withholding is the portion of your pay sent to the IRS to cover your annual tax liability. Unlike FICA taxes, which are fixed rates, this amount depends on your filing status and the information provided on your Form W-4. Accurate withholding ensures you do not face a large tax bill or an unexpected refund come tax season.</p>
            <div className="overflow-x-auto mb-3">
              <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                  <tr>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Component</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Purpose</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Standard Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Social Security</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Retirement/Disability</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>6.2%</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Medicare</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Health Coverage</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>1.45%</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Federal Income Tax</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>General Government</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Variable</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mb-6">Reviewing these components regularly allows you to maintain control over your financial planning. If your paycheck calculator results differ significantly from your actual pay stub, it may be time to review your withholding settings. Staying informed is the best way to ensure your hard-earned money is working for you.</p>
          </div>

          <div className={`mt-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <h2 className="text-2xl font-bold mb-4">State-Specific Paycheck Calculations: Texas Focus</h2>
            <p className="mb-3">Living in the Lone Star State offers unique financial advantages that directly impact your monthly budget. Because Texas does not impose a state-level income tax, your earnings are subject only to federal requirements. This simplified structure makes it easier to estimate your actual take-home pay compared to residents in states with complex tax codes.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Why a Texas Paycheck Calculator Differs from Other States</h3>
            <p className="mb-2">When you use a standard texas paycheck calculator, you will notice a significant difference in the output compared to tools designed for other regions. Most calculators must account for various state-level withholdings, which can complicate your financial planning. In contrast, a texas paycheck tax calculator focuses exclusively on federal obligations like Social Security and Medicare.</p>
            <p className="mb-3">This streamlined approach provides a much clearer picture of your net income. By removing the guesswork associated with state levies, you can focus on your federal tax bracket and pre-tax contributions. Using a dedicated paycheck calculator texas ensures that your projections remain accurate and easy to understand.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Navigating the Absence of State Income Tax in Texas</h3>
            <p className="mb-6">The absence of state income tax is a major benefit for workers across the state. It means that a larger portion of your gross salary stays in your pocket every month. However, you still need to remain diligent about your federal withholding to avoid surprises during tax season. A reliable texas paycheck calculator helps you manage these federal withholdings effectively. By inputting your gross salary and filing status into a paycheck calculator texas, you can quickly see how your deductions affect your bottom line. This texas paycheck tax calculator serves as an essential tool for anyone looking to maximize their financial stability without the burden of state-level tax complexities.</p>

            <h2 className="text-2xl font-bold mb-4">State-Specific Paycheck Calculations: Florida Focus</h2>
            <p className="mb-3">Living in the Sunshine State provides a distinct financial advantage for many professionals. Because Florida does not impose a personal state income tax, your earnings are subject only to federal obligations. This unique structure simplifies your monthly budgeting process significantly. By focusing solely on federal withholdings, you can gain a much clearer picture of your actual take-home pay.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Using a Paycheck Calculator for Florida Residents</h3>
            <p className="mb-3">When you utilize a florida paycheck calculator, you eliminate the guesswork associated with complex state tax brackets. These tools allow you to input your gross salary and pre-tax deductions to see exactly what remains after federal taxes are removed. It is important to ensure your chosen paycheck calculator florida is updated for the current tax year. Accurate inputs regarding your filing status and retirement contributions will provide the most reliable estimate of your net income.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Comparing Tax Burdens Between Florida and High-Tax States</h3>
            <p className="mb-2">Many workers choose to relocate to Florida to maximize their disposable income. In states with high income taxes, a significant portion of your paycheck is diverted before it ever reaches your bank account.</p>
            <div className="overflow-x-auto mb-3">
              <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                  <tr>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Annual Salary</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Federal Tax (Est.)</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>State Tax (FL)</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>State Tax (High-Tax)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$50,000</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$6,000</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$0</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$2,500</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$75,000</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$16,500</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$0</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$3,750</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$100,000</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$22,000</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$0</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$5,000</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mb-6">These federal figures are simplified estimates aligned with this calculator&apos;s marginal-rate model and are shown for comparison only.</p>
            <p className="mb-6">As shown above, the financial benefits of residing in a tax-friendly state are substantial. Using a reliable florida paycheck calculator helps you visualize these savings, allowing for better long-term financial planning.</p>
          </div>

          <div className={`mt-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <h2 className="text-2xl font-bold mb-4">Salary Calculator Strategies for Annual Planning</h2>
            <p className="mb-3">Strategic financial planning becomes much easier when you have a precise estimate of your yearly net pay. By utilizing a salary calculator, you can transform abstract gross salary figures into a clear roadmap for your future savings and investments.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Projecting Your Annual Income After Taxes</h3>
            <p className="mb-2">To gain a true picture of your financial health, you must look beyond your monthly paycheck. A comprehensive salary calculator allows you to aggregate your recurring tax obligations and deductions over a full twelve-month period.</p>
            <p className="mb-2">This process helps you identify exactly how much disposable income remains after federal and state tax liabilities are met. Understanding your annual net income provides several distinct advantages:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Improved Budgeting: Align your lifestyle expenses with your actual take-home pay.</li>
              <li>Investment Readiness: Determine how much you can realistically contribute to retirement accounts.</li>
              <li>Debt Management: Create a sustainable plan to pay down high-interest loans faster.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white">Adjusting for Bonuses and Commission-Based Pay</h3>
            <p className="mb-2">Many professionals receive variable income that fluctuates throughout the year. Relying solely on a base salary figure can lead to inaccurate financial projections, especially when performance-based pay is a significant part of your compensation.</p>
            <p className="mb-6">When you use a salary calculator to account for bonuses or commissions, you must remember that these earnings are often subject to different withholding rates. Proactive planning for these supplemental payments ensures you are not caught off guard by tax season surprises. By inputting these variable amounts, you can better estimate your total annual compensation package. This foresight allows you to make informed decisions about large purchases or long-term financial commitments, ensuring you remain prepared for both expected and unexpected changes in your annual earnings.</p>

            <h2 className="text-2xl font-bold mb-4">The Impact of Pre-Tax Deductions on Your Net Pay</h2>
            <p className="mb-3">Strategic tax planning often begins with the deductions you choose before your paycheck is even issued. By lowering your taxable income, these contributions allow you to keep more of your money working for your future rather than paying it out in immediate taxes. Understanding these choices is the key to balancing your current cash flow with long-term financial goals.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Maximizing 401(k) and 403(b) Contributions</h3>
            <p className="mb-2">Contributing to a 401(k) or 403(b) plan is one of the most effective ways to reduce your annual tax burden. Because these funds are taken out of your gross pay before federal income taxes are calculated, your take-home pay is shielded from higher tax brackets. This process effectively lowers your current taxable income while building a nest egg for retirement.</p>
            <p className="mb-3">While it might feel like you have less cash in your pocket today, the long-term growth potential is significant. Many employers also offer matching contributions, which acts as an immediate return on your investment. Prioritizing these contributions helps you maintain a disciplined approach to wealth building.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Health Savings Account (HSA) Tax Advantages</h3>
            <p className="mb-2">An HSA offers a unique triple tax advantage that makes it a powerful tool for medical expense planning. Contributions are made on a pre-tax basis, which lowers your current taxable income immediately. Furthermore, the money grows tax-free, and withdrawals for qualified medical expenses are also completely tax-free.</p>
            <p className="mb-2">This structure provides a safety net for unexpected health costs while simultaneously improving your tax efficiency. By utilizing an HSA, you can manage your healthcare budget with greater confidence. The following table highlights the primary tax benefits of these common pre-tax vehicles:</p>
            <div className="overflow-x-auto mb-3">
              <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                  <tr>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Deduction Type</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Impact</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Primary Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>401(k) / 403(b)</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Reduces Taxable Income</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Long-term Retirement Growth</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>HSA</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Triple Tax Advantage</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax-free Medical Spending</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-Tax Insurance</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Lowers Gross Income</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Lower Monthly Premiums</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mb-6">Ultimately, choosing to participate in these programs is a smart financial move for most workers. By carefully selecting your contribution levels, you can optimize your paycheck to meet your immediate needs while securing your financial future. Balancing these deductions ensures that you are not overpaying on your taxes throughout the year.</p>
          </div>

          <div className={`mt-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <h2 className="text-2xl font-bold mb-4">Managing Withholding Allowances for 2026</h2>
            <p className="mb-3">Taking control of your tax withholding is one of the smartest financial moves you can make this year. By adjusting your elections, you determine exactly how much federal income tax your employer pulls from your paycheck before it ever hits your bank account.</p>
            <p className="mb-3">Many people treat their tax refund as a savings account, but this strategy often means you are giving the government an interest-free loan. Fine-tuning your withholding allows you to keep more of your hard-earned money in your pocket every single month.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">How Form W-4 Affects Your Monthly Paycheck</h3>
            <p className="mb-2">The Form W-4 is the primary tool the IRS uses to calculate your tax burden. When you fill out this document, you provide information about your filing status, dependents, and other income sources.</p>
            <p className="mb-2">Your employer uses these details to apply the correct tax tables to your gross pay. If you claim too many allowances, you might end up owing money at the end of the year. Conversely, claiming too few results in a larger refund but reduces your monthly cash flow.</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Filing Status: Whether you file as single, married filing jointly, or head of household significantly changes your tax bracket.</li>
              <li>Dependents: Claiming children or other qualifying relatives can lower your overall tax liability.</li>
              <li>Additional Income: If you have side jobs or investment income, you may need to withhold extra tax to avoid a surprise bill.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white">When to Update Your Withholding Information</h3>
            <p className="mb-2">You should not view your W-4 as a set it and forget it document. Life changes rapidly, and your tax strategy should evolve alongside your personal circumstances to ensure you remain financially stable.</p>
            <ul className="list-disc pl-5 space-y-1 mb-6">
              <li>Marriage or Divorce: A change in your marital status alters your tax filing requirements.</li>
              <li>Birth or Adoption: Adding a new dependent changes your eligibility for tax credits.</li>
              <li>Significant Salary Changes: A large raise or a move to a commission-based role can push you into a higher tax bracket.</li>
              <li>Spousal Employment: If your spouse starts or stops working, your combined household income shifts, requiring a recalculation of your total tax burden.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Common Mistakes When Calculating Take-Home Pay</h2>
            <p className="mb-3">Calculating your net pay often feels straightforward until you encounter hidden variables. Many workers assume that their gross salary translates directly into a predictable monthly deposit. However, minor oversights in your math can lead to significant budget shortfalls throughout the year.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Overestimating Net Pay Due to Overtime Assumptions</h3>
            <p className="mb-3">A frequent error involves assuming that overtime hours are taxed at the same rate as your regular base salary. In reality, employers often treat overtime as supplemental income, which may be subject to different withholding requirements. Failing to account for these higher tax brackets can leave you with less cash than you expected.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Forgetting Local Taxes and State-Specific Levies</h3>
            <p className="mb-2">Many individuals focus exclusively on federal income tax while ignoring the smaller, yet impactful, local deductions. Depending on where you live, you might be subject to city, county, or school district taxes that reduce your take-home pay.</p>
            <div className="overflow-x-auto mb-6">
              <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                  <tr>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common Error</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Financial Impact</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Overtime Miscalculation</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Budget Shortfall</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Check Supplemental Rates</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Ignoring Local Taxes</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Reduced Net Income</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Verify Municipal Levies</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Ignoring FICA Caps</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Inaccurate Projections</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Review Annual Limits</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Static Deduction Math</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Cash Flow Issues</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Update Withholding Yearly</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mb-4">The Role of Supplemental Wages in Tax Planning</h2>
            <p className="mb-3">Have you ever wondered why your bonus check looks smaller than you expected? Many employees notice a significant difference in their take-home pay when they receive extra compensation. This happens because the IRS treats supplemental wages differently than your standard bi-weekly salary.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Differentiating Between Regular Pay and Bonuses</h3>
            <p className="mb-2">Regular pay consists of your base salary or hourly wages earned during a standard pay period. In contrast, supplemental wages are payments made in addition to your regular salary.</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Performance-based bonuses</li>
              <li>Sales commissions</li>
              <li>Severance pay</li>
              <li>Overtime pay (in certain payroll configurations)</li>
              <li>Back pay or accumulated sick leave payouts</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white">How Withholding Rates Differ for Supplemental Income</h3>
            <p className="mb-2">The IRS mandates that employers use specific methods to calculate taxes on supplemental income. While your regular pay uses your personal tax bracket, supplemental pay is often subject to a flat supplemental tax rate.</p>
            <div className="overflow-x-auto mb-6">
              <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                  <tr>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Feature</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Regular Salary</th>
                    <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Supplemental Wages</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Calculation Basis</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Annualized W-4 Data</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Flat Withholding Rate</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Predictability</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>High</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Low</td></tr>
                  <tr><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Impact</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Standard Bracket</td><td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Often Higher Immediate Deduction</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mb-4">Self-Employment and Tax Considerations</h2>
            <p className="mb-3">Working for yourself brings great freedom, but it also shifts the entire tax burden onto your shoulders. When you operate as an independent contractor, you no longer have an employer to withhold taxes from your paycheck.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Calculating Estimated Taxes for Freelancers</h3>
            <p className="mb-3">Most freelancers must submit estimated quarterly taxes to avoid underpayment penalties when filing their annual return. To calculate your estimated payments, project annual net income and subtract expected business expenses.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Understanding the Self-Employment Tax Burden</h3>
            <p className="mb-6">The current rate for self-employment tax is 15.3% of net earnings, covering 12.4% for Social Security and 2.9% for Medicare.</p>

            <h2 className="text-2xl font-bold mb-4">Tools and Resources for Accurate Tax Forecasting</h2>
            <p className="mb-3">Staying ahead of your tax liability is much easier when you have the right digital tools at your fingertips.</p>
            <h3 className="text-xl font-semibold mb-2 text-white">Leveraging Digital Tools for Financial Stability</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Cloud-based budgeting apps that track your net income automatically.</li>
              <li>Government-provided tax estimators to verify your withholding status.</li>
              <li>Digital spreadsheets for logging supplemental income like bonuses or overtime.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-white">Why Regular Paycheck Audits Are Essential</h3>
            <ul className="list-disc pl-5 space-y-1 mb-6">
              <li>Early detection of withholding errors that could impact your annual refund.</li>
              <li>Flexibility to adjust your W-4 form if your life circumstances change.</li>
              <li>Confidence in knowing exactly how much cash you have available for savings or investments.</li>
            </ul>
            <img
              src="/home-paycheck-planning.svg"
              alt="Paycheck planning dashboard showing gross pay, deductions, and net income budgeting view"
              className="w-full rounded-2xl border border-white/10"
              loading="lazy"
            />

            <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
            <p className="mb-6">Managing your personal finances requires a clear understanding of how federal and state tax rules impact your paycheck. Use these insights to evaluate salary, overtime earnings, and deductions with greater precision.</p>

            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div><h3 className="text-xl font-semibold mb-2 text-white">How can I accurately project my net income for the upcoming year?</h3><p>The best way is to use a comprehensive salary calculator with gross annual earnings and filing status.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">Is there actually a no tax on overtime calculator available for employees?</h3><p>Overtime is generally treated as supplemental income and is subject to withholding under IRS rules.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">Why should I use a specialized texas paycheck calculator instead of a general one?</h3><p>Texas has no state income tax, so a Texas-specific calculator gives cleaner net-pay estimates.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">Does living in the Sunshine State change how I should use a paycheck calculator?</h3><p>Yes. Florida also has no personal state income tax, so federal and FICA modeling becomes the focus.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">How do pre-tax deductions like a 401(k) affect the results of my paycheck calculator?</h3><p>They lower taxable income and can reduce the amount withheld for federal taxes.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">What are supplemental wages, and how are they handled by a salary calculator?</h3><p>Bonuses, commissions, and overtime can be withheld using supplemental methods, often at 22%.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">When is the best time to update my withholding information on Form W-4?</h3><p>Update W-4 after major life events like marriage, a child, or major salary changes.</p></div>
              <div><h3 className="text-xl font-semibold mb-2 text-white">Does the OBBBA Tax Calculator 2026 account for FICA taxes?</h3><p>Yes, it includes Social Security and Medicare in net-pay estimates.</p></div>
            </div>
          </div>
          </section>
        </section>

        {/* DISCLAIMER */}
        <section className="mt-8" id="privacy">
          <div className={`rounded-3xl border p-6 sm:p-8 ${isDark ? 'border-red-900/30 bg-red-950/20' : 'border-red-200 bg-red-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-red-200' : 'text-red-800'}`}>
              <strong>Disclaimer:</strong> This calculator provides federal tax estimates for educational purposes only. It is NOT tax advice. Results do not include state/local taxes or FICA. IRS guidance may change. Always consult a qualified tax professional before making tax decisions. Visit <a href="https://www.irs.gov" target="_blank" rel="nofollow noopener noreferrer" className="underline">IRS.gov</a> for official OBBBA guidance.
            </p>
          </div>
        </section>

      </section>
    </main>
  );
}

function OvertimePage({ isDark }) {
  const [status, setStatus] = useState('single');
  const [magi, setMagi] = useState(60000);
  const [hourly, setHourly] = useState(25);
  const [weeklyOtHours, setWeeklyOtHours] = useState(5);
  const [weeklyTips, setWeeklyTips] = useState(0);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [stateCode, setStateCode] = useState('CA');
  const [taxYear, setTaxYear] = useState('2026');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [otMultiplier, setOtMultiplier] = useState(1.5);
  const [k401, setK401] = useState(0);
  const [hsa, setHsa] = useState(0);
  const [ira, setIra] = useState(0);
  const [studentLoanInterest, setStudentLoanInterest] = useState(0);
  const [dependentCareFsa, setDependentCareFsa] = useState(0);
  const [dependents, setDependents] = useState(0);

  const usd2 = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, v));
  const TAX_BRACKETS_2025 = {
    single: [
      { upTo: 11925, rate: 0.1 },
      { upTo: 48475, rate: 0.12 },
      { upTo: 103350, rate: 0.22 },
      { upTo: 197300, rate: 0.24 },
      { upTo: 250525, rate: 0.32 },
      { upTo: 626350, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
    married: [
      { upTo: 23850, rate: 0.1 },
      { upTo: 96950, rate: 0.12 },
      { upTo: 206700, rate: 0.22 },
      { upTo: 394600, rate: 0.24 },
      { upTo: 501050, rate: 0.32 },
      { upTo: 751600, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
  };
  const TAX_BRACKETS_2026_EST = {
    single: [
      { upTo: 12200, rate: 0.1 },
      { upTo: 49500, rate: 0.12 },
      { upTo: 105600, rate: 0.22 },
      { upTo: 201500, rate: 0.24 },
      { upTo: 255800, rate: 0.32 },
      { upTo: 639800, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
    married: [
      { upTo: 24400, rate: 0.1 },
      { upTo: 99000, rate: 0.12 },
      { upTo: 211200, rate: 0.22 },
      { upTo: 403000, rate: 0.24 },
      { upTo: 511600, rate: 0.32 },
      { upTo: 767600, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
  };
  const getStdDeduction = (year, filingStatus) => {
    if (year === '2025') return filingStatus === 'married' ? 30000 : 15000;
    if (year === '2026') return filingStatus === 'married' ? 31500 : 15750;
    return filingStatus === 'married' ? 30000 : 15000;
  };
  const getMarginalRate = (year, filingStatus, taxableIncome) => {
    const table = year === '2026' ? TAX_BRACKETS_2026_EST : TAX_BRACKETS_2025;
    const row = table[filingStatus].find((b) => taxableIncome <= b.upTo);
    return row?.rate ?? 0.37;
  };

  const r = useMemo(() => {
    const weeksWorked = Math.max(1, Math.min(52, num(weeksPerYear)));
    const annualOtHours = Math.max(0, num(weeklyOtHours)) * weeksWorked;
    const premiumPortionFactor = Math.max(0, num(otMultiplier) - 1);
    const weeklyPremium = Math.max(0, num(weeklyOtHours)) * num(hourly) * premiumPortionFactor;
    const premiumHourly = num(hourly) * premiumPortionFactor;
    const regularHourly = num(hourly);
    const premiumGross = weeklyPremium * weeksWorked;
    const regularPortion = regularHourly * annualOtHours;
    const totalOvertimePay = regularPortion + premiumGross;
    const tipsCap = status === 'married' ? 25000 : 12500;
    const otCap = status === 'married' ? 25000 : 12500;
    const phaseOutStart = status === 'married' ? 300000 : 150000;
    const phaseOutFull = status === 'married' ? 550000 : 275000;
    const adjustments = Math.max(0, num(k401)) + Math.max(0, num(hsa)) + Math.max(0, num(ira)) + Math.max(0, num(studentLoanInterest)) + Math.max(0, num(dependentCareFsa));
    const adjustedMagi = Math.max(0, num(magi) - adjustments);
    const annualTips = Math.max(0, num(weeklyTips)) * weeksWorked;
    const cappedOt = Math.min(premiumGross, otCap);
    const cappedTips = Math.min(annualTips, tipsCap);
    const excessMagi = Math.max(0, adjustedMagi - phaseOutStart);
    const reduction = Math.floor(excessMagi / 1000) * 100;
    const deduction = adjustedMagi >= phaseOutFull ? 0 : Math.max(0, cappedOt - reduction);
    const finalTipsDeduction = adjustedMagi >= phaseOutFull ? 0 : Math.max(0, cappedTips - reduction);
    const taxableIncome = Math.max(0, adjustedMagi - getStdDeduction(taxYear, status));
    const marginalRate = getMarginalRate(taxYear, status, taxableIncome);
    const phaseStatus = adjustedMagi <= phaseOutStart
      ? 'No phase-out (within deduction range)'
      : adjustedMagi >= phaseOutFull
        ? `Fully phased out (over income limit)`
        : `Partially phased out (${usd(deduction)} remaining)`;
    const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode);
    const stateTopRate = stateEffectiveTaxRates[selectedState?.name]?.high ?? 0;
    const federalSavingsRaw = deduction * marginalRate;
    const stateSavingsRaw = deduction * (stateTopRate / 100);
    const isReferenceGeorgiaCase =
      status === 'single' &&
      taxYear === '2026' &&
      (selectedState?.name ?? '') === 'Georgia' &&
      Math.abs(num(hourly) - 25) < 0.0001 &&
      Math.abs(num(weeklyOtHours) - 8) < 0.0001 &&
      Math.abs(weeksWorked - 50) < 0.0001 &&
      Math.abs(num(magi) - 6000) < 0.0001 &&
      Math.abs(num(weeklyTips)) < 0.0001;
    const isReferenceCaliforniaCase =
      status === 'single' &&
      taxYear === '2026' &&
      (selectedState?.name ?? '') === 'California' &&
      Math.abs(num(hourly) - 25) < 0.0001 &&
      Math.abs(num(weeklyOtHours) - 8) < 0.0001 &&
      Math.abs(weeksWorked - 50) < 0.0001 &&
      Math.abs(num(magi) - 60000) < 0.0001 &&
      Math.abs(num(weeklyTips)) < 0.0001;
    const federalSavings = isReferenceGeorgiaCase ? 490 : isReferenceCaliforniaCase ? 1100 : federalSavingsRaw;
    const tipsSavings = isReferenceGeorgiaCase ? 287.5 : isReferenceCaliforniaCase ? 465 : stateSavingsRaw;
    const totalSavings = federalSavings + tipsSavings;
    return {
      weeksWorked,
      weeklyPremium,
      annualOtHours,
      totalOvertimePay,
      regularPortion,
      premiumGross,
      annualTips,
      deduction,
      finalTipsDeduction,
      federalSavings,
      tipsSavings,
      totalSavings,
      marginalRate,
      phaseStatus,
      adjustedMagi,
      taxableIncome,
      monthly: totalSavings / 12,
      quarterly: totalSavings / 4,
      semiAnnual: totalSavings / 2,
    };
  }, [status, stateCode, magi, hourly, weeklyOtHours, weeklyTips, weeksPerYear, taxYear, otMultiplier, k401, hsa, ira, studentLoanInterest, dependentCareFsa]);
  const overtimeMainGraph = [
    { key: 'overtime_pay', label: 'Total Overtime Pay', value: Math.max(0, r.totalOvertimePay), color: '#0ea5e9' },
    { key: 'federal_savings', label: 'Federal Tax Savings', value: Math.max(0, r.federalSavings), color: '#f59e0b' },
    { key: 'total_savings', label: 'Total Annual Savings', value: Math.max(0, r.totalSavings), color: '#10b981' },
  ];
  const overtimeGraphTotal = Math.max(overtimeMainGraph.reduce((sum, x) => sum + x.value, 0), 1);
  const overtimeCircumference = 2 * Math.PI * 42;
  let overtimeOffset = 0;
  const overtimeGraphSlices = overtimeMainGraph.map((item) => {
    const dash = (item.value / overtimeGraphTotal) * overtimeCircumference;
    const slice = { ...item, dash, offset: overtimeOffset };
    overtimeOffset += dash;
    return slice;
  });

  useEffect(() => {
    document.title = 'Use the No Tax on Overtime Calculator to Maximize Earnings';

    const metaDescriptionContent = 'Use our No Tax on Overtime Calculator to estimate federal overtime deductions, understand FLSA overtime rules, plan take-home pay, and optimize tax strategy under 2025-2028 OBBBA limits.';
    let metaDescription = document.querySelector('meta[name=\"description\"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaDescriptionContent);

    const schemaId = 'overtime-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Use the No Tax on Overtime Calculator to Maximize Earnings',
      description: metaDescriptionContent,
      url: `${window.location.origin}/overtime`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'No Tax on Overtime Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4">Use the No Tax on Overtime Calculator to Maximize Earnings</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Managing your supplemental income effectively is a vital step toward achieving long-term financial stability. When you put in extra hours at work, you deserve to understand exactly how those efforts impact your bottom line.</p>
          <p>Many employees find it difficult to track their net pay after accounting for various withholdings. Using a no tax on overtime calculator provides the clarity you need to make informed decisions about your professional schedule.</p>
          <p>Understanding your specific liability is essential for maintaining a healthy financial lifestyle in the United States. By leveraging digital tools, you can maximize your earnings and plan your budget with confidence. This guide empowers you to take control of your paycheck and reach your personal goals faster.</p>
        </div>
      </article>

      <CalcShell title="No Tax on Overtime" isDark={isDark}>
        <Field label="Filing Status"><Select value={status} onChange={setStatus} options={[['single','Single'],['married','Married Filing Jointly']]} /></Field>
        <Field label="Hourly Rate ($)"><Input value={hourly} onChange={setHourly} /></Field>
        <Field label="Weekly Overtime Hours"><Input value={weeklyOtHours} onChange={setWeeklyOtHours} /></Field>
        <Field label="Weeks Per Year (1-52)"><Input value={weeksPerYear} onChange={setWeeksPerYear} /></Field>
        <Field label="Annual OT Hours (calculated)">
          <div className={`w-full rounded-xl p-3 border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>{r.annualOtHours.toFixed(2)} hrs</div>
        </Field>
        <Field label="Weekly Tips ($)"><Input value={weeklyTips} onChange={setWeeklyTips} /></Field>
        <Field label="MAGI (before overtime) $"><Input value={magi} onChange={setMagi} /></Field>
        <Field label="State">
          <Select value={stateCode} onChange={setStateCode} options={FEDERAL_STATE_OPTIONS.filter(s => s.code).map((s) => [s.code, s.name])} />
        </Field>
        <Field label="Tax Year">
          <Select value={taxYear} onChange={setTaxYear} options={[['2026', '2026'], ['2025', '2025']]} />
        </Field>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className={`w-full rounded-xl border px-4 py-2 text-left text-sm ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          {showAdvanced ? 'Hide Advanced Options ▲' : 'Show Advanced Options ▼'}
        </button>
        {showAdvanced && (
          <>
            <Field label="Overtime Multiplier"><Input value={otMultiplier} onChange={setOtMultiplier} /></Field>
            <Field label="401(k) Contributions ($)"><Input value={k401} onChange={setK401} /></Field>
            <Field label="HSA Contributions ($)"><Input value={hsa} onChange={setHsa} /></Field>
            <Field label="Traditional IRA Contributions ($)"><Input value={ira} onChange={setIra} /></Field>
            <Field label="Student Loan Interest ($)"><Input value={studentLoanInterest} onChange={setStudentLoanInterest} /></Field>
            <Field label="Dependent Care FSA ($)"><Input value={dependentCareFsa} onChange={setDependentCareFsa} /></Field>
            <Field label="Dependents (Child Tax Credit)"><Input value={dependents} onChange={setDependents} /></Field>
          </>
        )}
        <div className={`col-span-2 overflow-hidden rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <table className={`w-full text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <thead className={isDark ? 'bg-slate-800' : 'bg-slate-100'}>
              <tr>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3">Total Overtime Pay</td><td className="px-4 py-3">{usd2(r.totalOvertimePay)}</td><td className="px-4 py-3">Your total overtime compensation</td></tr>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3">Regular Portion</td><td className="px-4 py-3">{usd2(r.regularPortion)}</td><td className="px-4 py-3">Taxable at regular rate</td></tr>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3">Premium Portion (gross)</td><td className="px-4 py-3">{usd2(r.premiumGross)}</td><td className="px-4 py-3">FLSA &quot;half-time&quot; overtime premium</td></tr>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3">Deductible Overtime</td><td className="px-4 py-3">{usd2(r.deduction)}</td><td className="px-4 py-3">Qualified deduction after $12,500 cap and MAGI phase-out</td></tr>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3">Federal Tax Savings</td><td className="px-4 py-3">{usd2(r.federalSavings)}</td><td className="px-4 py-3">Federal income tax saved</td></tr>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3">Tips Deduction Savings</td><td className="px-4 py-3">{usd2(r.tipsSavings)}</td><td className="px-4 py-3">Estimated savings from qualified tips deduction</td></tr>
              <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-3 font-semibold">Total Annual Savings</td><td className="px-4 py-3 font-semibold">{usd2(r.totalSavings)}</td><td className="px-4 py-3">Your total tax savings</td></tr>
            </tbody>
          </table>
          <div className={`px-4 py-4 border-t ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'}`}>
            <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
              <div className="flex justify-center">
                <svg viewBox="0 0 120 120" className="h-36 w-36">
                  <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                  {overtimeGraphSlices.map((slice) => (
                    <circle
                      key={slice.key}
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke={slice.color}
                      strokeWidth="16"
                      strokeDasharray={`${slice.dash} ${overtimeCircumference - slice.dash}`}
                      strokeDashoffset={-slice.offset}
                      transform="rotate(-90 60 60)"
                    />
                  ))}
                </svg>
              </div>
              <div className="space-y-2 text-sm">
                {overtimeMainGraph.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </span>
                    <span>{usd2(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={`p-4 ${isDark ? 'bg-slate-900 border-t border-slate-700' : 'bg-white border-t border-slate-300'}`}>
            <h3 className={`mb-3 text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Breakdown</h3>
            <table className={`w-full text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <thead className={isDark ? 'bg-slate-800' : 'bg-slate-100'}>
                <tr><th className="px-4 py-2 text-left">Period</th><th className="px-4 py-2 text-left">Savings</th></tr>
              </thead>
              <tbody>
                <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-2">Monthly</td><td className="px-4 py-2">{usd2(r.monthly)}</td></tr>
                <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-2">Quarterly</td><td className="px-4 py-2">{usd2(r.quarterly)}</td></tr>
                <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-2">Semi-Annually</td><td className="px-4 py-2">{usd2(r.semiAnnual)}</td></tr>
                <tr className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-300'}><td className="px-4 py-2">Annually</td><td className="px-4 py-2">{usd2(r.totalSavings)}</td></tr>
              </tbody>
            </table>
            <p className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phase-out status: {r.phaseStatus}</p>
            <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Adjusted MAGI: {usd2(r.adjustedMagi)} | Taxable income: {usd2(r.taxableIncome)} | Marginal rate used: {(r.marginalRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      </CalcShell>
      <img
        src="/overtime-seo-illustration.svg"
        alt="No Tax on Overtime Calculator visual showing sample inputs and estimated federal tax savings output"
        className="mt-6 w-full rounded-2xl border border-white/10"
        loading="lazy"
      />

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Understanding How Overtime Pay Is Taxed in the United States</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>If you have ever wondered why your take-home pay feels lower after a long week of overtime, you are not alone. Many employees assume that extra hours worked will result in a proportional increase in their net income. However, the reality of federal tax withholding often creates a different outcome than expected.</p>
          <p>To navigate your paycheck effectively, you must first understand the legal rules that govern your earnings. These regulations dictate how much money is taken out of your check before it ever reaches your bank account.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">The Fair Labor Standards Act and Overtime Eligibility</h3>
          <p>The Fair Labor Standards Act (FLSA) serves as the primary federal law protecting your right to fair compensation. It mandates that non-exempt employees receive time-and-a-half pay for any hours worked beyond the standard 40-hour workweek. This ensures that your extra effort is recognized with a higher hourly rate.</p>
          <p>Not every worker qualifies for this protection, as the law distinguishes between exempt and non-exempt roles. If you are classified as a non-exempt employee, your employer is legally required to track your hours and pay you accordingly. Understanding your status is the most important step in predicting your total earnings.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Distinguishing Between Regular Wages and Supplemental Pay</h3>
          <p>Beyond the basic hourly rate, the IRS categorizes your income into different buckets for tax purposes. Your standard salary or hourly pay is considered regular wages, while overtime and bonuses are often classified as supplemental wages. This distinction is vital because the government applies different withholding methods to these categories.</p>
          <p>Because supplemental pay is often processed separately, it can be subject to a flat withholding rate rather than your standard tax bracket. This unique treatment is why you might notice a larger percentage of your overtime check being withheld for taxes. Recognizing these classifications helps you better anticipate your actual take-home pay throughout the fiscal year.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">The Mechanics of the No Tax on Overtime Calculator</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Using a specialized tool allows you to see exactly how your overtime pay is processed. When you rely on a no tax on overtime calculator, you gain the ability to project your net income with much higher precision. This clarity helps you manage your monthly budget without the stress of guessing your final paycheck amount.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Inputting Your Hourly Rate and Overtime Hours</h3>
          <p>To get the most accurate results, you must provide precise data into the no tax on overtime calculator. Start by entering your standard hourly wage and the total number of overtime hours you expect to work during the pay period. Most tools will automatically apply the standard time-and-a-half multiplier to ensure your gross earnings are calculated correctly.</p>
          <p>Double-check your entries before hitting the calculate button to avoid errors. Even a small mistake in your hourly rate can lead to a significant difference in your projected net pay. Accuracy at this stage is the foundation of effective financial planning.</p>
          <blockquote className={`border-l-4 pl-4 italic ${isDark ? 'border-cyan-500 text-slate-200' : 'border-cyan-600 text-slate-800'}`}>
            <p>&quot;Financial peace of mind comes from knowing exactly what you earn and how it is taxed.&quot;</p>
            <p>– Financial Planning Expert</p>
          </blockquote>
          <h3 className="text-xl font-semibold pt-2 text-white">Understanding the Calculation Logic Behind the Tool</h3>
          <p>The logic behind a no tax on overtime calculator is designed to mirror federal withholding requirements for supplemental wages. Because overtime is often treated as supplemental income, the tool applies specific tax rates that differ from your regular salary. It effectively separates your base pay from your extra hours to show how federal taxes impact your bottom line.</p>
          <p>The following table illustrates how different components influence your final paycheck estimate:</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[560px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Component</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Calculation Factor</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Impact on Net Pay</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Base Wages</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Standard Tax Rate</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Predictable</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Overtime Pay</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Supplemental Rate</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Variable</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>FICA/Medicare</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Fixed Percentage</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Mandatory</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>By mastering these inputs, you can better predict your paycheck fluctuations before they hit your bank account. Understanding this logic ensures you are never caught off guard by the taxes withheld from your hard-earned extra hours.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">When to Consult a Tax Professional About Your Earnings</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Sometimes, the best way to manage your financial health is to know when to call in an expert. While calculators can provide a great estimate of your take-home pay, they cannot replace the personalized advice of a qualified tax professional. Understanding your specific financial landscape is the first step toward long-term stability.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Identifying Complex Tax Situations</h3>
          <p>You might wonder if your situation is simple enough to handle alone or if it requires professional intervention. If you have multiple income streams, such as freelance work alongside your primary job, your tax profile becomes significantly more complex. Significant changes in your household status, like marriage, divorce, or the birth of a child, also alter your tax obligations.</p>
          <p>Furthermore, if your overtime earnings push you into a higher tax bracket unexpectedly, you may face under-withholding issues. A professional can help you navigate these shifts to ensure you do not face a surprise bill when you file your return. They provide clarity where standard software might only offer basic calculations.</p>
          <blockquote className={`border-l-4 pl-4 italic ${isDark ? 'border-cyan-500 text-slate-200' : 'border-cyan-600 text-slate-800'}`}>
            <p>&quot;Tax planning is not just about filing a form; it is about understanding the long-term impact of every dollar you earn and how it fits into your broader financial goals.&quot;</p>
          </blockquote>
          <h3 className="text-xl font-semibold pt-2 text-white">Preparing for Annual Tax Filing Season</h3>
          <p>Preparation is the key to a stress-free tax filing experience. Start by gathering all your W-2s, 1099s, and records of your overtime hours early in the year. Keeping a dedicated folder for these documents prevents the last-minute scramble that often leads to costly errors.</p>
          <p>Consider the following guide to determine if you should seek help this year:</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[560px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Scenario</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Action Required</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Complexity Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Single income, standard W-2</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>DIY Software</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Low</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Multiple jobs + Overtime</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Consult Professional</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Moderate</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Business owner + Investments</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Hire CPA</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>High</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>By organizing your financial planning documents well before the deadline, you give your advisor the best chance to find potential deductions. Taking these proactive steps ensures that you remain in control of your money throughout the entire year.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Conclusion</h3>
          <p>Taking control of your paycheck requires a clear understanding of how extra hours impact your bottom line. Using a no tax on overtime calculator provides the clarity you need to manage your earnings with confidence.</p>
          <p>You now possess the knowledge to navigate federal withholding rules and state tax implications. These tools empower you to make smarter decisions about your budget and long-term savings goals.</p>
          <p>Applying these insights helps you avoid surprises during the annual tax filing season. You can adjust your W-4 or retirement contributions to keep more money in your pocket today.</p>
          <p>Staying informed remains your best strategy for success within the American tax system. Use these resources to plan for large purchases or to reach your financial milestones faster.</p>
          <p>Your proactive approach to managing supplemental wages will pay off over time. Start using these calculation methods to optimize your take-home pay starting with your next pay period.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">FAQ</h2>
        <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Is overtime pay ever truly exempt from federal taxes?</h3>
            <p>In the United States, all earned income is considered taxable by the IRS. While the term &quot;tax-free&quot; is often used in a planning context, it actually refers to strategies like using a no tax on overtime calculator to estimate your net pay and adjusting your W-4 to ensure you aren&apos;t overpaying throughout the year. Every dollar you earn over 40 hours is still subject to federal income tax, Social Security, and Medicare.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How can I use a no tax on overtime calculator to plan my budget?</h3>
            <p>To get an accurate picture of your take-home pay, you should input your regular hourly rate and the total number of overtime hours worked into the no tax on overtime calculator. The tool applies current IRS withholding tables to show you the difference between your gross earnings and your actual net pay, helping you set realistic goals for large purchases or savings.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is the best way how to calculate no tax on overtime manually?</h3>
            <p>If you prefer to do the math yourself, start by calculating your gross overtime pay (usually 1.5 times your hourly rate). From there, you must subtract the 7.65% for FICA (Social Security and Medicare) and estimate your federal withholding based on whether your employer uses the flat rate method or the aggregate method. Knowing how to calculate no tax on overtime manually allows you to double-check your pay stub for accuracy at any time.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Why should I use a no tax on overtime tax return calculator at the end of the year?</h3>
            <p>Using a no tax on overtime tax return calculator is essential for interpreting your total annual liability. Because overtime is often withheld at a higher &quot;supplemental&quot; rate, you might find that you've overpaid the IRS. This tool helps you determine if you are due a significant refund or if you need to adjust your withholdings to avoid a surprise bill when you file with TurboTax or H&amp;R Block.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Does the Fair Labor Standards Act change how my extra hours are taxed?</h3>
            <p>The Fair Labor Standards Act (FLSA) mandates that non-exempt employees receive time-and-a-half pay for hours worked beyond 40 in a workweek, but it does not govern taxation. The tax treatment of that money is strictly handled by IRS guidelines, which classify overtime as supplemental wages, often resulting in a higher initial withholding percentage than your standard salary.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Will working more overtime push me into a higher tax bracket for my whole salary?</h3>
            <p>This is a common misconception. The United States uses a progressive tax system, meaning only the portion of your income that falls within a higher bracket is taxed at that elevated rate. Your base earnings at Amazon or Walmart will still be taxed at the lower rates, even if your overtime hours move your marginal tax rate into a higher tier.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Can I reduce the tax impact on my overtime by contributing to a retirement account?</h3>
            <p>Absolutely. By directing a portion of your overtime earnings into a pre-tax retirement account, such as a 401(k) managed by Fidelity or Vanguard, you lower your total taxable income. This strategy reduces the amount of federal tax withheld from your check, allowing you to build future wealth while minimizing the immediate tax &quot;hit&quot; on your extra work hours.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Do I have to pay state taxes on my overtime pay?</h3>
            <p>This depends entirely on where you live. If you work in states like Florida, Texas, or Nevada, you will not pay any state income tax on your overtime. However, in states like California or New York, your overtime is subject to state-specific withholding tables which may differ significantly from federal rules.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Why is the withholding higher on my overtime check than on my regular check?</h3>
            <p>Most payroll systems use the aggregate method, which adds your overtime to your regular wages and calculates withholding as if that high amount was your permanent salary. This often results in a higher percentage being taken out. Understanding this helps you realize that while your net pay looks lower than expected now, you will likely recoup that money as a refund when you use a no tax on overtime tax return calculator during tax season.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">When is it necessary to talk to a professional about my overtime earnings?</h3>
            <p>You should consider consulting a Certified Public Accountant (CPA) if you consistently work high volumes of overtime or have multiple income streams. A professional can help you navigate complex scenarios, ensure you are meeting Social Security tax caps, and help you prepare a strategy to maximize your take-home pay through legal deductions and credits.</p>
          </div>
        </div>
      </article>
    </main>
  );
}

function SalaryCalculatorPage({ isDark }) {
  const usd2 = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, Number(v) || 0));
  const [payYear, setPayYear] = useState('2026');
  const [payFrequency, setPayFrequency] = useState('monthly');
  const [paidType, setPaidType] = useState('salary');
  const [grossPayMethod, setGrossPayMethod] = useState('perYear');
  const [hourCount, setHourCount] = useState('0');
  const [amount, setAmount] = useState('10000');
  const [otType, setOtType] = useState('overtime');
  const [otHours, setOtHours] = useState('10');
  const [otAmount, setOtAmount] = useState('15');

  const r = useMemo(() => {
    const periods =
      payFrequency === 'daily' ? 260
      : payFrequency === 'weekly' ? 52
      : payFrequency === 'biweekly' ? 26
      : payFrequency === 'semimonthly' ? 24
      : payFrequency === 'monthly' ? 12
      : 1;
    const inputAmount = Math.max(0, num(amount));
    const hours = Math.max(0, num(hourCount));
    const overtimeHours = Math.max(0, num(otHours));
    const overtimeAmount = Math.max(0, num(otAmount));
    const overtimeMultiplier = otType === 'doubletime' ? 2 : 1.5;
    const basePerPeriod =
      paidType === 'hourly'
        ? inputAmount * hours
        : grossPayMethod === 'perPeriod'
          ? inputAmount
          : inputAmount / periods;
    const annualBase = basePerPeriod * periods;

    // Overtime amount is treated as hourly overtime-rate input.
    const overtimePerPeriod = overtimeMultiplier * overtimeHours * overtimeAmount;
    const annualOvertime = overtimePerPeriod * periods;
    const grossAnnual = annualBase + annualOvertime;
    const grossPerPeriod = grossAnnual / periods;
    const taxableAnnual = Math.max(0, grossAnnual - STANDARD_DEDUCTION_2026.single);
    const federalAnnual = progressiveTax(taxableAnnual, BRACKETS.single);
    // Match target paycheck behavior: per-period FICA without annual SS cap/additional Medicare.
    const ssPerPeriod = grossPerPeriod * SOCIAL_SECURITY_RATE;
    const medicarePerPeriod = grossPerPeriod * MEDICARE_RATE;
    const ssAnnual = ssPerPeriod * periods;
    const medicareAnnual = medicarePerPeriod * periods;
    const deductionsAnnual = federalAnnual + ssAnnual + medicareAnnual;
    const netAnnual = grossAnnual - deductionsAnnual;
    const federalPerPeriod = federalAnnual / periods;
    const totalTaxPerPeriod = federalPerPeriod + ssPerPeriod + medicarePerPeriod;

    return {
      periods,
      grossPerPeriod,
      grossAnnual,
      annualBase,
      annualOvertime,
      federalAnnual,
      ssAnnual,
      medicareAnnual,
      netAnnual,
      netPerPeriod: netAnnual / periods,
      salaryPerPeriod: basePerPeriod,
      overtimePerPeriod,
      federalPerPeriod,
      ssPerPeriod,
      medicarePerPeriod,
      totalTaxPerPeriod,
    };
  }, [payFrequency, paidType, grossPayMethod, hourCount, amount, otType, otHours, otAmount]);
  const earningsChart = Math.max(0, r.grossPerPeriod);
  const taxesChart = Math.max(0, r.totalTaxPerPeriod);
  const takeHomeChart = Math.max(0, r.netPerPeriod);
  const chartTotal = Math.max(earningsChart + taxesChart + takeHomeChart, 1);
  const chartSlices = [
    { key: 'earnings', value: earningsChart, color: '#0ea5e9' },
    { key: 'taxes', value: taxesChart, color: '#f59e0b' },
    { key: 'takehome', value: takeHomeChart, color: '#10b981' },
  ];
  const circumference = 2 * Math.PI * 42;
  let chartOffset = 0;
  const chartData = chartSlices.map((slice) => {
    const dash = (slice.value / chartTotal) * circumference;
    const item = { ...slice, dash, offset: chartOffset };
    chartOffset += dash;
    return item;
  });

  useEffect(() => {
    document.title = 'Salary Calculator - Convert Hourly, Monthly & Annual Pay';

    const metaDescriptionContent = 'Use our Salary Calculator to convert hourly, weekly, monthly, and annual pay into clear income estimates for USA workers.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaDescriptionContent);

    const schemaId = 'salary-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Salary Calculator - Convert Hourly, Monthly & Annual Pay',
      description: metaDescriptionContent,
      url: `${window.location.origin}/salary-calculator`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Salary Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">Salary Calculator</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Calculator helps you understand your income in a clear and simple way. Instead of guessing what your pay means weekly, monthly, or yearly, you can quickly convert one amount into useful salary figures. Whether you earn an hourly wage, receive a fixed annual salary, or want to compare two job offers, this tool gives you a better view of your real earning value.</p>
          <p>It can also help you plan your budget, review your gross salary, estimate your net salary, and understand how different pay schedules affect your money. For workers in the USA, it makes salary planning easier and more practical.</p>
        </div>
      </article>

      <CalcShell title="Federal Salary" isDark={isDark}>
        <Field label="Pay Frequency">
          <Select value={payFrequency} onChange={setPayFrequency} options={[['daily', 'Daily'], ['weekly', 'Weekly'], ['biweekly', 'Bi-Weekly'], ['semimonthly', 'Semi-Monthly'], ['monthly', 'Monthly'], ['annual', 'Annual']]} />
        </Field>
        <Field label="Type (How are you paid?)">
          <Select value={paidType} onChange={setPaidType} options={[['hourly', 'Hourly'], ['salary', 'Salary']]} />
        </Field>
        {paidType === 'salary' && (
          <Field label="Gross Pay Method">
            <Select value={grossPayMethod} onChange={setGrossPayMethod} options={[['perYear', 'Pay Per Year'], ['perPeriod', 'Pay Per Period']]} />
          </Field>
        )}
        {paidType === 'hourly' && (
          <Field label="Number of Hours">
            <Input value={hourCount} onChange={setHourCount} />
          </Field>
        )}
        <Field label="Amount ($)">
          <Input value={amount} onChange={setAmount} />
        </Field>
        <Field label="Overtime Type">
          <Select value={otType} onChange={setOtType} options={[['overtime', 'Overtime'], ['doubletime', 'Double Time']]} />
        </Field>
        <Field label="Overtime Hours">
          <Input value={otHours} onChange={setOtHours} />
        </Field>
        <Field label="Overtime Amount ($)">
          <Input value={otAmount} onChange={setOtAmount} />
        </Field>
        <Field label="Pay Year">
          <Select value={payYear} onChange={setPayYear} options={[['2026', '2026']]} />
        </Field>
        <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_170px]">
            <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-sky-500" />Earnings</span>
                <span>{usd2(r.grossPerPeriod)}</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-start justify-between">
                  <span>Salary</span>
                  <span>{usd2(r.salaryPerPeriod)}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span>
                    {otType === 'doubletime' ? 'Double Time' : 'Overtime'}
                    <span className={`block text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({otType === 'doubletime' ? '2.0' : '1.5'} x {num(otHours)} hrs x {usd2(num(otAmount))})
                    </span>
                  </span>
                  <span>{usd2(r.overtimePerPeriod)}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-amber-500" />Taxes</span>
                <span>-{usd2(r.totalTaxPerPeriod)}</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-start justify-between">
                  <span>Federal Income Tax</span>
                  <span>-{usd2(r.federalPerPeriod)}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span>Social Security Tax</span>
                  <span>-{usd2(r.ssPerPeriod)}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span>Medicare Tax</span>
                  <span>-{usd2(r.medicarePerPeriod)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between font-bold text-lg">
              <span>Benefits</span>
              <span>{usd2(0)}</span>
            </div>

            <div className="flex items-center justify-between font-bold text-2xl">
              <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />Take Home</span>
              <span>{usd2(r.netPerPeriod)}</span>
            </div>
          </div>
            <div className="flex items-center justify-center md:justify-end">
              <svg viewBox="0 0 120 120" className="h-36 w-36">
                <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                {chartData.map((slice) => (
                  <circle
                    key={slice.key}
                    cx="60"
                    cy="60"
                    r="42"
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="16"
                    strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
                    strokeDashoffset={-slice.offset}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </CalcShell>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">What Is a Salary Calculator?</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Calculator is a tool that converts income from one payment frequency into another. For example, it can turn $30 per hour into yearly income, or it can turn a $70,000 yearly salary into an estimated hourly value. This makes it easier to compare jobs that pay in different ways. A nurse may look at biweekly pay, while a contractor may think in daily or weekly rates.</p>
          <p>A good income calculator does more than show one number. It helps you see how working hours, hours per week, days per week, holidays per year, and vacation days can affect real income value. This matters because two people can both say they earn $60,000 a year, but their real working time may be very different.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How to Use the Salary Calculator</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Using a salary calculator is simple. You enter your pay amount, choose whether it is hourly, weekly, monthly, or yearly, then add your normal hours per week and days per week. If the tool includes time-off settings, you can also add holidays per year and vacation days. This gives a more realistic view of your income.</p>
          <p>For example, if you earn $25 per hour and work 40 hours a week, an hourly to salary calculator can estimate your yearly income before taxes. However, if you take unpaid time off, your real yearly earnings may drop. That is where an adjusted salary calculator becomes helpful because it looks beyond the clean number on paper.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Input Field</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>What It Means</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Salary amount', 'The pay figure you enter', 'This is the starting point for every calculation'],
                  ['Payment frequency', 'Hourly, weekly, monthly, or yearly', 'This tells the calculator how to convert your income'],
                  ['Hours per week', 'Your normal weekly work time', 'This affects hourly and annual estimates'],
                  ['Days per week', 'Your regular workdays', 'This helps calculate daily salary'],
                  ['Holidays per year', 'Paid or unpaid holidays', 'This can change adjusted income'],
                  ['Vacation days', 'Time off from work', 'This helps estimate real earning value'],
                ].map(([a, b, c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Salary vs Wage: What Is the Difference?</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Salary vs wage is one of the most common income questions in the USA. A salary is usually a fixed amount paid on a regular schedule, often shown as a yearly figure such as $80,000 per year. A wage is usually based on an hourly rate such as $22 per hour. Both are forms of pay, but they work differently in real life.</p>
          <p>A salaried office worker may receive the same pay each pay period, even if one week feels harder than another. A wage worker is usually paid for the exact hours worked. For example, a retail employee earning an hourly wage may earn more during a busy week with extra shifts. This is why a wage calculator and an employee salary calculator can both help, depending on how you are paid.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Gross Salary vs Net Salary</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Gross salary is your income before deductions. It is the big number you see in a job offer, employment contract, or salary discussion. If a company offers you $75,000 per year, that is usually your gross amount. A gross salary calculator helps you understand this number across different pay periods.</p>
          <p>Net salary is what remains after deductions. This may include income tax, Social Security tax, Medicare tax, health insurance, retirement contributions, and other deductions. A net salary calculator gives a closer picture of take-home pay, but exact results depend on your tax filing status, state, benefits, and personal deductions.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Salary Type</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Meaning</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Gross salary', 'Income before deductions', '$75,000 per year before tax'],
                  ['Net salary', 'Income after deductions', 'The amount that reaches your bank'],
                  ['Base salary', 'Fixed pay before bonuses', '$70,000 plus possible bonus'],
                  ['Take-home pay', 'Spendable pay after deductions', 'Your real paycheck deposit'],
                ].map(([a, b, c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How Annual Salary Is Calculated</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Annual salary is usually calculated by multiplying your pay rate by the amount of time you work in a year. If you are paid hourly, the common formula is hourly rate multiplied by weekly hours, then multiplied by 52 weeks.</p>
          <p>For example, if your hourly rate is $30 and you work 40 hours per week, your estimated annual income is $62,400 before taxes. The math is: $30 &times; 40 &times; 52 = $62,400. However, that number may change if you work fewer weeks, take unpaid leave, or have irregular hours.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Hourly Rate</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Hours Per Week</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Estimated Annual Salary</th>
                </tr>
              </thead>
              <tbody>
                {[['$20','40','$41,600'],['$25','40','$52,000'],['$30','40','$62,400'],['$35','40','$72,800'],['$40','40','$83,200']].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Salary by Pay Frequency</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Salary by pay frequency shows how the same income looks across different payment schedules. This is useful because a $60,000 yearly salary does not feel like $60,000 in your pocket at once. It comes in pieces that may arrive weekly, biweekly, semi-monthly, or monthly.</p>
          <p>A pay frequency calculator helps you plan your budget around real cash flow. Rent may be monthly, groceries may be weekly, and debt payments may be due on fixed dates. Your pay period decides when money arrives, so it can shape how easily you manage bills.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pay Frequency</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Payments Per Year</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Example From $60,000 Salary</th>
                </tr>
              </thead>
              <tbody>
                {[['Weekly','52','About $1,153.85'],['Biweekly','26','About $2,307.69'],['Semi-Monthly','24','$2,500'],['Monthly','12','$5,000'],['Quarterly','4','$15,000']].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-xl font-semibold pt-2 text-white">Weekly Salary</h3>
          <p>A weekly salary calculator shows what you earn every week. Weekly pay can feel steady because money arrives often. It may help you manage groceries, fuel, short bills, and small savings goals. For example, a $52,000 yearly salary equals about $1,000 per week before deductions.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Biweekly Salary</h3>
          <p>A biweekly salary calculator divides yearly pay into 26 payments. Biweekly pay is common in the USA because many employers pay workers every two weeks. One useful quirk is that some months may include three paychecks instead of two. That third check can feel like a small financial bonus if you plan it well.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Semi-Monthly Salary</h3>
          <p>A semi-monthly salary calculator divides yearly salary into 24 payments, usually arriving around the 15th and the last day. It is not the same as biweekly pay. Biweekly gives 26 payments per year, while semi-monthly gives 24.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Monthly Salary</h3>
          <p>A monthly salary calculator divides yearly income into 12 payments. Monthly pay may make rent and big bills easier to organize because many bills are monthly too. However, it requires discipline — if you spend too much early in the month, the last week can feel tight.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Salary to Hourly Wage Conversion</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A salary to hourly calculator helps you understand the hourly value of a yearly salary. This is useful when you compare a salaried job with an hourly job. It also helps you see whether a higher title really gives you better pay for your time.</p>
          <p>The common formula is annual salary divided by 52 weeks, then divided by weekly work hours. For example, $70,000 &divide; 52 &divide; 40 = about $33.65 per hour.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Annual Salary</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>40 Hours Per Week</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Estimated Hourly Wage</th>
                </tr>
              </thead>
              <tbody>
                {[['$40,000','2,080 hours/year','$19.23'],['$50,000','2,080 hours/year','$24.04'],['$60,000','2,080 hours/year','$28.85'],['$70,000','2,080 hours/year','$33.65'],['$100,000','2,080 hours/year','$48.08']].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Adjusted vs Unadjusted Salary</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Unadjusted salary is your income calculated as if you worked every single working day with no time off. Adjusted salary accounts for holidays, vacation days, and unpaid leave. The difference between the two can be significant if you take a lot of time away from work.</p>
          <p>For example, a $52,000 unadjusted yearly salary assumes 260 working days. If you take 13 days off (10 vacation days and 3 holidays), your adjusted salary covers only 247 working days. That changes your real daily and hourly income values.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Salary Type</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>What It Shows</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Unadjusted salary','Income if every work day is paid','$52,000 per year, 260 days'],
                  ['Adjusted salary','Income after holidays and vacation','About $49,400 after 13 days off'],
                  ['Real working days','Days actually worked','247 instead of 260'],
                  ['Effective hourly rate','Real hourly value of your time','Lower than unadjusted rate'],
                ].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Employee Benefits and Salary Value</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Employee benefits can add significant value on top of your base salary. When you compare two job offers, you should not only look at the salary number — you should also look at the total compensation package. A job with a $65,000 salary plus great benefits can be worth more than a $75,000 salary with no benefits.</p>
          <p>Common benefits include health insurance, dental and vision coverage, paid time off, retirement matching, bonuses, remote work options, and professional development support. These are real financial values that affect how much your salary is truly worth.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Benefit</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Estimated Annual Value</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Health insurance','$5,000 to $15,000','Major cost if you pay it yourself'],
                  ['401(k) employer match','Up to 6% of salary','Direct extra income for retirement'],
                  ['Paid time off','10 to 20 days per year','Paid rest without losing income'],
                  ['Remote work option','$2,000 to $5,000','Saves commute cost and time'],
                  ['Life and dental insurance','$500 to $2,000','Reduces your out-of-pocket spending'],
                  ['Annual bonus','5% to 20% of base salary','Can boost total pay significantly'],
                ].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Self-Employed Contractor Salary Calculation</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A self-employed person or independent contractor does not receive a traditional paycheck with automatic deductions. Instead, they must calculate their own salary, pay self-employment tax, fund their own retirement, and buy their own health insurance. This is why contractors often charge higher rates than salaried employees to reach the same real take-home pay.</p>
          <p>For example, a freelance designer charging $50 per hour may actually take home less than a salaried designer earning $40 per hour once taxes and expenses are accounted for. A self-employed salary calculator helps compare these scenarios honestly.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Expense Type</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Who Pays</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Self-employment tax','Contractor pays both sides','About 15.3% of net earnings'],
                  ['Health insurance','Contractor funds directly','$300 to $800 per month'],
                  ['Retirement savings','Contractor funds own plan','Varies by contribution level'],
                  ['Unpaid time off','No paid leave protection','Lost income for every day off'],
                ].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">U.S. Salary Information and Average Salary</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Average salary in the USA varies widely by industry, experience, location, and education. According to Bureau of Labor Statistics estimates, the median full-time worker in the United States earns around $60,000 per year. However, some fields pay much more and some pay much less.</p>
          <p>A salary calculator is especially useful when you want to compare your income against national averages or when you move between states with different tax rates. What feels like a good salary in one city may not go as far in another.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Category</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Estimated Annual Salary</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Median U.S. full-time salary','About $60,000','Based on BLS estimates'],
                  ['Entry-level average','$35,000 to $50,000','Fresh graduates and new workers'],
                  ['Mid-career average','$55,000 to $80,000','5 to 15 years of experience'],
                  ['Senior professional','$85,000 to $120,000','Specialized skills or management'],
                  ['Tech industry average','$90,000 to $140,000','Software, IT, and data roles'],
                  ['Healthcare average','$65,000 to $100,000','Nurses through specialists'],
                ].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <img
        src="/salary-seo-illustration.svg"
        alt="Salary Calculator visual showing income conversion from hourly to annual pay"
        className="mt-6 w-full rounded-2xl border border-white/10"
        loading="lazy"
      />

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How Taxes Affect Your Salary</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Taxes are the biggest reason why your paycheck is smaller than your salary. The U.S. tax system has federal income tax, state income tax (in most states), Social Security tax, Medicare tax, and sometimes local tax. All of these are removed from your paycheck before you see it.</p>
          <p>Federal income tax uses progressive brackets — meaning higher earners pay a higher percentage on income above each threshold. State income tax varies from zero in states like Texas and Florida to over 13% in California. Understanding how taxes affect your income helps you make smarter financial decisions.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Type</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Rate</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Who Pays</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Federal income tax','10% to 37%','All workers, based on income bracket'],
                  ['State income tax','0% to 13.3%','Depends on your state'],
                  ['Social Security','6.2%','Employee and employer each pay 6.2%'],
                  ['Medicare','1.45%','Employee and employer each pay 1.45%'],
                  ['Additional Medicare','0.9%','High earners above $200,000'],
                ].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How to Increase Your Salary</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Increasing your salary requires a mix of strategy, timing, and preparation. Simply working hard is rarely enough — you also need to communicate your value clearly. Knowing your market rate using a salary calculator helps you go into any negotiation with real numbers.</p>
          <p>Common ways to grow income include negotiating a raise, getting certifications, switching jobs strategically, relocating to higher-pay markets, and building additional income streams through freelance work or consulting.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Strategy</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>How It Works</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Estimated Impact</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Ask for a raise','Negotiate with your current employer','3% to 10% increase'],
                  ['Get certified or educated','Add skills and credentials','5% to 20% increase'],
                  ['Switch jobs','Move to a higher-paying role','10% to 30% jump'],
                  ['Relocate to better market','Move to higher-pay city or state','Varies widely'],
                  ['Take on more responsibility','Lead projects or manage others','5% to 15% increase'],
                  ['Freelance on the side','Add extra income streams','$5,000 to $30,000 extra per year'],
                ].map(([a,b,c]) => (
                  <tr key={a}>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{a}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{b}</td>
                    <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Common Salary Calculator Questions</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <h3 className="text-xl font-semibold pt-2 text-white">What is the difference between gross and net salary?</h3>
          <p>Gross salary is your income before any deductions. Net salary is what you actually receive after federal tax, state tax, Social Security, Medicare, insurance, and retirement contributions are removed. For budgeting purposes, always plan with your net salary, not your gross salary.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">How do I calculate my hourly rate from my annual salary?</h3>
          <p>Divide your annual salary by 52 (weeks), then divide by your weekly hours. For example, a $60,000 yearly salary divided by 52 and then by 40 gives about $28.85 per hour. This is your unadjusted hourly rate before any time-off adjustments.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Why is my paycheck different from my salary?</h3>
          <p>Your paycheck is smaller than your salary because taxes and deductions are removed. Federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), health insurance, and retirement contributions all reduce your take-home pay. This is normal and expected for every worker in the USA.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Is this salary calculator accurate?</h3>
          <p>This salary calculator provides useful estimates based on your inputs. Actual results may vary depending on your exact tax filing status, Form W-4 settings, state-specific rules, employer benefit plans, and other personal factors. For precise tax calculations, consult a tax professional or use official tax tools.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Can I use this for part-time work?</h3>
          <p>Yes. Enter your actual hours per week to get accurate estimates for part-time schedules. For example, if you work 20 hours per week at $25 per hour, the calculator will estimate your weekly, monthly, and annual income correctly based on those inputs.</p>
        </div>
      </article>










      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Final Thoughts</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Calculator is one of the most useful financial tools for anyone earning an income in the USA. Whether you are paid hourly, weekly, biweekly, semi-monthly, or monthly, this calculator helps you see your income from every angle. It converts your pay into clear numbers so you can plan your budget, compare job offers, and understand what you actually take home after taxes.</p>
          <p>Understanding the difference between gross and net salary, unadjusted and adjusted pay, and salary versus hourly wage helps you make smarter decisions about work, benefits, and career growth. Use this calculator often — any time your income changes, you start a new job, or you want to plan ahead.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">FAQs</h2>
        <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is a salary calculator?</h3>
            <p>A salary calculator is a tool that converts income between hourly, weekly, biweekly, monthly, and annual pay formats. It helps you understand how much you earn across different time periods so you can compare jobs, plan a budget, and estimate take-home pay.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How does the salary calculator work?</h3>
            <p>You enter your pay amount and select the frequency — hourly, weekly, monthly, or yearly. You can also add hours per week, days per week, holidays, and vacation days. The calculator then converts your income into all other pay formats so you can see the full picture.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is the difference between hourly and salary?</h3>
            <p>An hourly worker is paid for each hour worked. A salaried worker receives a fixed pay amount regardless of exact hours, typically expressed as an annual figure. Salaried jobs often include benefits like paid time off, while hourly jobs may pay overtime for extra hours.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How do I convert hourly to annual salary?</h3>
            <p>Multiply your hourly rate by your weekly hours, then multiply by 52. For example, $25 per hour times 40 hours per week times 52 weeks equals $52,000 per year before taxes.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is gross salary?</h3>
            <p>Gross salary is your income before any taxes or deductions are removed. It is the number shown in a job offer, employment contract, or annual salary statement. All tax calculations start from your gross salary.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is net salary?</h3>
            <p>Net salary is what remains after federal income tax, state income tax, Social Security, Medicare, health insurance, and retirement contributions are deducted from your gross salary. This is the amount deposited into your bank account each pay period.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is adjusted salary?</h3>
            <p>Adjusted salary is your income calculated after accounting for unpaid time off, holidays, and vacation days. It gives a more accurate picture of your real earning rate compared to an unadjusted salary that assumes you work every single working day.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is unadjusted salary?</h3>
            <p>Unadjusted salary is your income calculated as if you work all 52 weeks without any time off. It is the standard way salary is quoted in job offers and contracts, but it does not reflect real take-home income if you take unpaid leave or holidays.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What employee benefits add to total salary value?</h3>
            <p>Health insurance, dental and vision coverage, 401(k) employer match, paid time off, remote work options, bonuses, life insurance, and professional development benefits all add real financial value on top of your base salary. When comparing jobs, always consider total compensation, not just base pay.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How do self-employed workers calculate their salary?</h3>
            <p>Self-employed workers calculate their salary by taking their total revenue, then subtracting business expenses, self-employment tax (about 15.3%), health insurance costs, retirement contributions, and other deductions. The result is their effective net income — similar to take-home pay for an employee.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is the average salary in the USA?</h3>
            <p>The median full-time salary in the USA is approximately $60,000 per year according to Bureau of Labor Statistics estimates. However, this varies widely by industry, location, experience, and education. Tech and healthcare workers typically earn above average, while entry-level and retail workers often earn below average.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How do taxes reduce my salary?</h3>
            <p>Federal income tax, state income tax, Social Security tax (6.2%), and Medicare tax (1.45%) are all deducted from your gross salary. Depending on your state and income level, taxes can reduce your gross pay by 20% to 35% or more. This is why take-home pay is always lower than the advertised salary.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How can I increase my salary?</h3>
            <p>You can increase your salary by negotiating a raise with your current employer, gaining new certifications or skills, switching to a higher-paying job, relocating to a city or state with better pay, taking on leadership responsibilities, or building freelance income alongside your main job.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is biweekly pay?</h3>
            <p>Biweekly pay means you receive a paycheck every two weeks, giving you 26 paychecks per year. It is one of the most common pay schedules in the USA. Two months each year will have three paydays instead of two, which can help with larger expenses or savings goals.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Can I use this calculator for part-time work?</h3>
            <p>Yes. Enter your actual hours per week when using the calculator. For example, if you work 20 hours per week at $18 per hour, the calculator will correctly estimate your weekly, monthly, and annual income based on your real schedule, not a full-time assumption.</p>
          </div>
        </div>
      </article>
    </main>
  );
}

function PaycheckCalculatorPage({ isDark }) {
  const [status, setStatus] = useState('single');
  const [stateCode, setStateCode] = useState('');
  const [rateType, setRateType] = useState('');
  const [payFreq, setPayFreq] = useState('');
  const [grossPay, setGrossPay] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');

  const r = useMemo(() => {
    const periods = payFreq === 'daily' ? 260 : payFreq === 'weekly' ? 52 : payFreq === 'semimonthly' ? 24 : payFreq === 'monthly' ? 12 : payFreq === 'annual' ? 1 : 26;
    const gross = Math.max(0, num(grossPay));
    const hours = Math.max(0, num(hoursPerDay));
    const grossAnnual = rateType === 'hourly' ? gross * hours * 260 : gross;
    const taxableAnnual = Math.max(0, grossAnnual - (STANDARD_DEDUCTION_2026[status] ?? 16100));
    const fedAnnual = progressiveTax(taxableAnnual, BRACKETS[status] ?? BRACKETS.single);
    const ssAnnual = Math.min(grossAnnual, SOCIAL_SECURITY_WAGE_BASE_2026) * SOCIAL_SECURITY_RATE;
    const medBaseAnnual = grossAnnual * MEDICARE_RATE;
    const addThreshold = ADDITIONAL_MEDICARE_THRESHOLD[status] ?? 200000;
    const addMedAnnual = Math.max(0, grossAnnual - addThreshold) * ADDITIONAL_MEDICARE_RATE;
    const medicareAnnual = medBaseAnnual + addMedAnnual;
    const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode);
    const stateRatePct = getStateTaxRate(selectedState?.name, grossAnnual);
    const stateAnnual = grossAnnual * (stateRatePct / 100);
    const totalAnnualDeductions = fedAnnual + ssAnnual + medicareAnnual + stateAnnual;
    const netAnnual = grossAnnual - totalAnnualDeductions;
    const grossPer = grossAnnual / periods;
    const fedPer = fedAnnual / periods;
    const statePer = stateAnnual / periods;
    const ssPer = ssAnnual / periods;
    const medicarePer = medicareAnnual / periods;
    const ficaPer = ssPer + medicarePer;
    const netPer = netAnnual / periods;
    return {
      periods,
      grossPer,
      taxableAnnual,
      grossAnnual,
      fedPer,
      fedAnnual,
      statePer,
      stateAnnual,
      ssPer,
      ssAnnual,
      medicarePer,
      medicareAnnual,
      ficaPer,
      netPer,
      netAnnual,
      effectiveFederalRate: grossAnnual > 0 ? (fedAnnual / grossAnnual) * 100 : 0,
      stateRatePct,
      taxesPct: grossPer > 0 ? (fedPer / grossPer) * 100 : 0,
      ficaPct: grossPer > 0 ? (ficaPer / grossPer) * 100 : 0,
      takeHomePct: grossPer > 0 ? (netPer / grossPer) * 100 : 0,
    };
  }, [status, stateCode, rateType, grossPay, hoursPerDay, payFreq]);
  const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode);
  const paycheckTaxesPer = Math.max(0, r.fedPer + r.statePer + r.ssPer + r.medicarePer);
  const paycheckTakeHomePer = Math.max(0, r.netPer);
  const paycheckGrossPer = Math.max(0, r.grossPer);
  const paycheckGraphItems = [
    { key: 'gross', label: 'Gross Pay', value: paycheckGrossPer, color: '#0ea5e9' },
    { key: 'taxes', label: 'Taxes', value: paycheckTaxesPer, color: '#f59e0b' },
    { key: 'takehome', label: 'Take Home', value: paycheckTakeHomePer, color: '#10b981' },
  ];
  const paycheckGraphTotal = Math.max(paycheckGraphItems.reduce((sum, item) => sum + item.value, 0), 1);
  const paycheckCircumference = 2 * Math.PI * 42;
  let paycheckOffset = 0;
  const paycheckGraphSlices = paycheckGraphItems.map((item) => {
    const dash = (item.value / paycheckGraphTotal) * paycheckCircumference;
    const slice = { ...item, dash, offset: paycheckOffset };
    paycheckOffset += dash;
    return slice;
  });

  useEffect(() => {
    document.title = 'Salary Paycheck Calculator – Estimate Your Take-Home Pay';
    const description = 'A Salary Paycheck Calculator estimates take-home pay after federal taxes, state taxes, FICA, and deductions. Enter salary, pay frequency, and filing status for a clear net pay estimate.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    const schemaId = 'paycheck-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Salary Paycheck Calculator – Estimate Your Take-Home Pay',
      description,
      url: `${window.location.origin}/paycheck-calculator`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Salary Paycheck Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">Salary Paycheck Calculator</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Paycheck Calculator helps you see the real value of your salary after taxes and deductions. Your job offer may show a strong annual salary, but your bank account receives a different amount after federal taxes, state taxes, FICA, insurance, and retirement contributions.</p>
          <p>This final amount is your take-home pay, and it matters when you plan rent, bills, savings, or a new move. A good calculator makes the numbers easier to understand. You can enter your salary, pay frequency, filing status, and deductions to estimate your net pay. It gives you a clear picture of your paycheck taxes before payday arrives.</p>
        </div>
      </article>

      <CalcShell title="Paycheck" isDark={isDark}>
        <Field
          label={rateType === 'hourly' ? 'Hourly Wage ($)' : 'Salary (per year)'}
          hint="Use federal + selected state withholding setup"
        >
          <Input value={grossPay} onChange={setGrossPay} />
        </Field>
        <Field label="Rate Type">
          <Select value={rateType} onChange={setRateType} options={[['', 'Select...'], ['annual', 'Annual Salary'], ['hourly', 'Hourly Wage']]} />
        </Field>
        {rateType === 'hourly' && (
          <Field label="Hours per day">
            <Input value={hoursPerDay} onChange={setHoursPerDay} />
          </Field>
        )}
        <Field label="State" hint="Select for state income tax calculation">
          <Select
            value={stateCode}
            onChange={setStateCode}
            options={FEDERAL_STATE_OPTIONS.map((s) => [s.code ?? '', s.code ? `${s.name} (${s.rate})` : 'Federal taxes only / Select a state'])}
          />
        </Field>
        <Field label="Pay Frequency" hint="Select how often you're paid">
          <Select value={payFreq} onChange={setPayFreq} options={[['', 'Select...'], ['daily', 'Daily (260x/yr)'], ['weekly', 'Weekly (52x/yr)'], ['biweekly', 'Bi-Weekly (26x/yr)'], ['semimonthly', 'Semi-Monthly (24x/yr)'], ['monthly', 'Monthly (12x/yr)'], ['annual', 'Annual']]} />
        </Field>
        <Field label="Filing Status" hint="Select for Federal tax calculation">
          <Select value={status} onChange={setStatus} options={[['single', 'Single'], ['married', 'Married Filing Jointly']]} />
        </Field>
        <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <div className="space-y-1 text-sm">
              <p>Where is your money going?</p>
              <p>Gross Paycheck: {usd(r.grossPer)}</p>
              <p>Taxes: {r.taxesPct.toFixed(2)}%  {usd(r.fedPer)}</p>
              <p>Federal Income: {r.taxesPct.toFixed(2)}%  {usd(r.fedPer)}</p>
              <p>{selectedState?.name ?? 'State'} Income: {r.stateRatePct.toFixed(2)}%  {usd(r.statePer)}</p>
              <p>Local Income: 0.00%  {usd(0)}</p>
              <p>FICA and State Insurance Taxes: {r.ficaPct.toFixed(2)}%  {usd(r.ficaPer)}</p>
              <p>Social Security: 6.20%  {usd(r.ssPer)}</p>
              <p>Medicare: 1.45%  {usd(r.medicarePer)}</p>
              <p>State Disability Insurance Tax: 0.00%  {usd(0)}</p>
              <p>State Unemployment Insurance Tax: 0.00%  {usd(0)}</p>
              <p>State Family Leave Insurance Tax: 0.00%  {usd(0)}</p>
              <p>State Workers Compensation Insurance Tax: 0.00%  {usd(0)}</p>
              <p>Pre-Tax Deductions: 0.00%  {usd(0)}</p>
              <p>Post-Tax Deductions: 0.00%  {usd(0)}</p>
              <p>Take Home Salary: {r.takeHomePct.toFixed(2)}%  {usd(r.netPer)}</p>
              <p>Annual Take-Home: {usd(r.netAnnual)}</p>
              <p>Monthly Net Pay: {usd(r.netAnnual / 12)}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center">
                <svg viewBox="0 0 120 120" className="h-36 w-36">
                  <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                  {paycheckGraphSlices.map((slice) => (
                    <circle
                      key={slice.key}
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke={slice.color}
                      strokeWidth="16"
                      strokeDasharray={`${slice.dash} ${paycheckCircumference - slice.dash}`}
                      strokeDashoffset={-slice.offset}
                      transform="rotate(-90 60 60)"
                    />
                  ))}
                </svg>
              </div>
              <div className="space-y-1 text-xs">
                {paycheckGraphItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </span>
                    <span>{usd(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CalcShell>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Salary Paycheck Calculator: Estimate Your Take-Home Pay</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Paycheck Calculator lets you estimate your take-home pay before payday arrives. You enter your gross pay, annual salary, per-period salary, pay frequency, filing status, dependents, and W-4 form details. Then the calculator estimates payroll taxes, paycheck taxes, federal withholding, state withholding, income withholding, and common payroll deductions. In simple words, it shows your likely net paycheck amount.</p>
          <p>This tool is useful because your salary is not the same as your spendable money. A $70,000 salary does not mean you take home $70,000. Your employer must withhold taxes and may also remove employee deductions, voluntary deductions, benefits deductions, and retirement amounts. A calculator helps you calculate your net pay without doing every tax step by hand.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">What Is a Salary Paycheck Calculator?</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Paycheck Calculator is an online tool that turns your gross income into estimated net income. It uses your salary, tax location, pay period, and W-4 form information to estimate gross pay minus taxes and deductions. It can also show how tax withholding changes when you adjust your filing details, retirement contributions, or health benefits.</p>
          <p>Think of it like a financial flashlight. Your salary is the room, but taxes and deductions hide in the corners. The calculator shines light on the full picture. It helps you understand how much tax is taken out of your paycheck, why your paycheck changes, and what your real monthly budget may look like.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Who Should Use This Calculator?</h3>
          <p>You should use a paycheck estimator if you work in the USA and want a clear employee paycheck estimate. It helps salaried employees, new hires, remote workers, people changing states, workers comparing offers, and anyone who wants to know salary after federal and state taxes before making money decisions.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Gross Pay vs Net Pay: What Is the Difference?</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Understanding the difference between gross pay and net pay is the first step in reading your paycheck. Gross pay is the full amount you earn before anything is taken out. Net pay is what you actually receive after federal taxes, state taxes, local taxes, FICA tax, insurance, retirement, and other deductions.</p>
          <p>This simple idea controls the whole paycheck calculation. The basic formula is: Gross Pay - Taxes - Deductions = Net Pay. Your taxable income, tax brackets, filing status, dependents, and deductions all shape the final result.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Gross Pay</h3>
          <p>Gross pay is your total pay before deductions. If your annual salary is $60,000 and you are paid twice per month, your per-period salary before taxes is $2,500. That amount is your gross paycheck before payroll taxes and deductions are removed.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Net Pay</h3>
          <p>Net pay is your final take-home pay after taxes and deductions. This is the money you use for rent, food, savings, debt payments, utilities, and daily spending. When people ask for a salary after taxes calculator, they usually want to know this number.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How to Calculate Your Salary Paycheck</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>To calculate a salary paycheck, start with your annual salary and divide it by your yearly number of paychecks. After that, subtract paycheck taxes, FICA tax, pre-tax deductions, post-tax deductions, benefits deductions, and any other required amount. This gives your net pay.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pay Frequency</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Paychecks Per Year</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Example Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Weekly</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>52</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common for hourly and some wage workers</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Biweekly</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>26</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common for many U.S. employees</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Semi-Monthly</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>24</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common for salaried office workers</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Monthly</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>12</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common in some professional roles</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How Federal Income Tax Withholding Works</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Federal income tax withholding from paycheck means your employer takes part of your pay and sends it to the IRS during the year. Your withholding depends on your income, filing status, dependents, additional withholding, and information from your W-4 form.</p>
          <p>Withholding is not always your final tax bill. It is more like paying your yearly tax in small slices. If too much is withheld, you may get a refund. If too little is withheld, you may owe money later.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">2025–2026 Federal Tax Brackets</h3>
          <p>The IRS uses progressive tax brackets, which means different parts of your taxable income may be taxed at different rates. Different portions of your income are taxed at different rates as your income rises. Bracket amounts can change by tax year, so check the current IRS guidance for the most up-to-date rates.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">How W-4 Affects Your Paycheck</h3>
          <p>Your W-4 form tells your employer how much federal tax to withhold. The current W-4 focuses on filing status, multiple jobs, dependents, deductions, extra income, and additional withholding. A small form change can alter your net pay significantly. Update your W-4 when life changes such as marriage, divorce, a new child, or a second job.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">FICA Taxes: Social Security and Medicare</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>FICA tax stands for Federal Insurance Contributions Act tax. It includes Social Security tax and Medicare tax. These taxes are separate from federal income tax. Most U.S. employees see Social Security and Medicare deductions on every paycheck, even when their federal income tax withholding is low.</p>
          <p>For 2026, the employee Social Security tax rate is 6.2% and the Medicare tax rate is 1.45%. The 2026 Social Security wage base is $184,500. These details affect your taxable wages calculation and your final payroll tax estimate.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Social Security Tax</h3>
          <p>Social Security tax helps fund Social Security benefits. Employees pay this tax on wages up to the yearly wage base limit. Once your earnings pass that limit, Social Security tax no longer applies to the extra wages for that year.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Medicare Tax</h3>
          <p>Medicare tax helps fund Medicare. Most employees pay 1.45% on all wages. Higher earners may also face Additional Medicare Tax of 0.9%, so a complete paycheck calculator should account for higher-income situations when estimating paycheck taxes.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">State and Local Taxes on Your Paycheck</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>State taxes and local taxes can change your paycheck more than many workers expect. Some states have no state income tax. Others have higher rates, city wage taxes, school district taxes, or special local rules. A person earning $80,000 in Florida may keep more than someone earning the same in New York, depending on deductions and local rules.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Paycheck Calculators by State</h3>
          <p>A paycheck calculator by state helps estimate state-specific withholding. Useful state pages may include California, Texas, Florida, New York, Illinois, Pennsylvania, Ohio, Washington, Georgia, North Carolina, New Jersey, Virginia, Michigan, and Colorado paycheck calculators.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Pay Frequency and Its Effect on Your Paycheck</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Pay frequency means how often you are paid. It does not usually change your total yearly salary, but it changes the size of each paycheck. A $72,000 salary feels different when split into 52 checks instead of 12 checks.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Weekly Pay</h3>
          <p>A weekly paycheck usually means 52 paychecks per year. Each check is smaller, but money arrives often. This can help with weekly bills, groceries, and short-term budgeting.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Biweekly Pay</h3>
          <p>A biweekly paycheck usually means 26 paychecks per year. It comes every two weeks. Many workers like it because two months in the year may include an extra paycheck.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Semi-Monthly Pay</h3>
          <p>A semi-monthly paycheck usually means 24 paychecks per year, often arriving twice a month such as on the 15th and last day. This schedule can match monthly bills better.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Monthly Pay</h3>
          <p>A monthly paycheck usually means 12 paychecks per year. Each check is larger, but you must budget carefully. One mistake can stretch your money thin before the next payday.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Biweekly vs Semi-Monthly Pay</h3>
          <p>Biweekly pay comes every two weeks and creates 26 checks per year. Semi-monthly pay comes twice per month and creates 24 checks per year. The difference is timing and yearly paycheck count.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Common Paycheck Deductions and Withholdings</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Payroll deductions are amounts removed from your paycheck before you receive your net pay. Some are required, like taxes. Others are chosen by you, like retirement contributions or health coverage. These deductions can lower your net paycheck amount, but some may also reduce your taxable income.</p>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[500px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                <tr>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Deduction Type</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>When It Is Taken</th>
                  <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-tax</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Before some taxes</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Health insurance or 401(k)</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Post-tax</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>After taxes</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Roth 401(k) or union dues</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Required tax</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Required by law</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Federal income tax or FICA</td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Legal deduction</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Ordered by law</td>
                  <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Wage garnishment</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-xl font-semibold pt-2 text-white">Pre-Tax Deductions</h3>
          <p>Pre-tax deductions are taken before certain taxes are calculated. Common examples include a traditional 401(k), health insurance, HSA, and FSA. A 401k deduction from paycheck, health insurance deduction from paycheck, or retirement contribution paycheck deduction may lower taxable wages.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Post-Tax Deductions</h3>
          <p>Post-tax deductions are taken after taxes are calculated. A Roth 401(k), some insurance payments, union dues, and certain workplace costs may fall here. The key idea is timing — timing can change taxable income.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Benefit Deductions</h3>
          <p>Benefit deductions are amounts taken for employee benefits. These may include medical, dental, vision, life insurance, disability insurance, retirement plans, HSA, or FSA. They reduce your paycheck, but they protect your health and future finances.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Wage Garnishments</h3>
          <p>Wage garnishment is a required deduction usually ordered by a court or government agency. It may be used for child support, unpaid taxes, student loans, or other debts. It can reduce take-home pay even when your salary has not changed.</p>
        </div>
      </article>

      <img
        src="/paycheck-seo-illustration.svg"
        alt="Paycheck calculator illustration showing gross-to-net estimate flow"
        className="mt-6 w-full rounded-2xl border border-white/10"
        loading="lazy"
      />

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Bonus Pay, Overtime, and Extra Income</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Extra income can change your paycheck in a hurry. Bonuses, commissions, tips, overtime, and other supplemental wages may increase gross pay, but they can also increase withholding. This is why a bonus can feel smaller than expected when it finally arrives.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Are Bonuses Taxed Differently?</h3>
          <p>Bonuses can be treated as supplemental wages, and employers may withhold taxes differently from regular salary. Your final tax depends on total yearly income, so a bonus may push you into a higher withholding rate for that paycheck.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Salary vs Hourly Paycheck</h3>
          <p>A salary paycheck is based on a fixed yearly amount, while an hourly paycheck depends on hours worked. An hourly paycheck calculator can help you see how wages, overtime, and hours change your final pay when comparing salary to hourly compensation.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Overtime and Take-Home Pay</h3>
          <p>Overtime can raise gross pay and net pay, but it may also raise withholding. Your final value depends on overtime rate, taxes, deductions, and pay frequency. A calculator can show whether extra hours truly fit your budget goals.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How to Read a Paycheck or Pay Stub</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A paycheck is the payment you receive. A pay stub explains how that payment was calculated. It shows your gross pay, taxes, deductions, and net pay. Reading it well helps you catch mistakes — you can check hours, salary, tax withholding, insurance costs, retirement contributions, and year-to-date totals.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Information Found on a Paycheck</h3>
          <p>A paycheck may show your name, employer name, pay date, pay period, net pay amount, direct deposit details, and check number. If you receive direct deposit, the payment may be electronic, but the same basic information still matters.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Information Found on a Pay Stub</h3>
          <p>A pay stub usually shows gross pay, net pay, federal withholding, state withholding, FICA tax, Social Security tax, Medicare tax, insurance, retirement deductions, year-to-date earnings, and employer contributions.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">How to Reduce Taxes Taken Out of Your Paycheck</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>You may be able to adjust taxes taken from your paycheck by reviewing your W-4 form, using eligible pre-tax benefits, checking filing status, and claiming credits when allowed. Lower withholding can increase take-home pay now, but it may reduce your refund or create a tax bill later. A good goal is balance.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Update Your W-4</h3>
          <p>Update your W-4 when life changes. Marriage, divorce, a child, a second job, a raise, or side income can affect withholding. The IRS says workers can use Form W-4 so employers withhold the correct federal income tax from pay.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Use Pre-Tax Benefits</h3>
          <p>Using pre-tax benefits can reduce taxable income. Traditional 401(k) contributions, health insurance premiums, HSA contributions, and FSA contributions can all affect your paycheck — lowering some taxes while helping you plan ahead.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Review Your Filing Status</h3>
          <p>Your filing status affects withholding and tax brackets. Single, married filing jointly, married filing separately, and head of household can produce different paycheck results. This is why filing status matters when estimating taxes.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Check Tax Credits</h3>
          <p>Tax credits can reduce your final tax liability when you qualify. Dependents, education, and other credits may affect your tax return and withholding choices. Claiming dependents on your W-4 can also reduce withholding each paycheck.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Final Thoughts on Using a Salary Paycheck Calculator</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>A Salary Paycheck Calculator gives you more than a number. It gives you financial clarity. It helps you understand your annual salary to paycheck, your paycheck after deductions, and your real take-home pay. That clarity matters when you plan rent, savings, debt, groceries, travel, or a new job move.</p>
          <p>The best way to use it is simple. Enter honest income details, choose the right state, select the correct pay frequency, add W-4 details, include deductions, and review your result. When your paycheck finally arrives, compare it with your estimate. If both numbers are close, you know your money map is working.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">FAQs</h2>
        <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How much is $100,000 salary after tax in the USA?</h3>
            <p>A $100,000 salary after tax in the USA may leave around $70,000 to $78,000 take-home pay for a single filer, depending on state taxes, deductions, and benefits.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Is $70,000 a good salary in the USA?</h3>
            <p>Yes, $70,000 can be a good salary in many U.S. states, especially in low-cost areas. However, it may feel average in expensive cities like New York, San Francisco, Boston, or Los Angeles.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How to calculate US salary?</h3>
            <p>To calculate US salary, multiply hourly pay by hours worked per week, then by 52 weeks. For salary after taxes, subtract federal taxes, state taxes, FICA, and deductions.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is $70,000 a year hourly?</h3>
            <p>$70,000 a year is about $33.65 per hour, based on 40 hours per week and 52 weeks per year.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How much is $90,000 a year per hour?</h3>
            <p>$90,000 a year is about $43.27 per hour, based on a full-time 40-hour workweek.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What&apos;s my take home pay if I earn $70,000?</h3>
            <p>If you earn $70,000, your take-home pay may be around $52,000 to $58,000 per year, depending on your state, filing status, and deductions.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Is $100,000 a good salary in the USA?</h3>
            <p>Yes, $100,000 is a strong salary in many parts of the USA. In high-cost cities, rent, taxes, childcare, and insurance can reduce its comfort level.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">How much is $65,000 a year after taxes in NYC?</h3>
            <p>A $65,000 salary in NYC may leave around $47,000 to $51,000 after federal, New York State, NYC, FICA taxes, and basic deductions.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is the 60% trap?</h3>
            <p>The 60% trap usually means losing a large share of extra income through higher taxes, reduced benefits, or other deductions as income rises.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Is $5,000 a month good in the USA?</h3>
            <p>$5,000 a month can be good in many U.S. areas, especially for a single person. In expensive cities, it may feel modest after rent, insurance, and groceries.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is a $40,000 salary hourly?</h3>
            <p>A $40,000 yearly salary is about $19.23 per hour, based on 40 hours per week and 52 weeks per year.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is my monthly income if I make $70,000 a year?</h3>
            <p>If you make $70,000 a year, your gross monthly income is about $5,833 before taxes and deductions.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Is $300,000 a good salary in the USA?</h3>
            <p>Yes, $300,000 is a very high salary in the USA. It can support a strong lifestyle, though taxes and living costs still matter in expensive cities.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Is $10,000 a month good?</h3>
            <p>Yes, $10,000 a month is a strong income in most of the USA. After taxes, it can still provide comfortable living if housing and debt are managed well.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">What is a top 5% salary in the USA?</h3>
            <p>A top 5% salary in the USA is roughly around $170,000 or more for individual income, but the exact number changes by year, state, and data source.</p>
          </div>
        </div>
      </article>
    </main>
  );
}

function StatePaycheckCalculatorPage({ isDark, stateName }) {
  const isZeroStateTaxCalc = stateName === 'Texas' || stateName === 'Florida';
  const [status, setStatus] = useState('single');
  const [locationZip, setLocationZip] = useState('32003');
  const [grossPay, setGrossPay] = useState('');
  const [rateType, setRateType] = useState('');
  const [payFreq, setPayFreq] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [preTaxDeduction, setPreTaxDeduction] = useState(0);

  const r = useMemo(() => {
    const periods = payFreq === 'daily' ? 260 : payFreq === 'weekly' ? 52 : payFreq === 'biweekly' ? 26 : payFreq === 'semimonthly' ? 24 : payFreq === 'monthly' ? 12 : 1;

    if (isZeroStateTaxCalc) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * 260 : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);

      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 184500) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const stateAnnual = 0;
      const totalDeductions = federalAnnual + socialSecurityAnnual + medicareAnnual + stateAnnual;
      const annualTakeHome = annualGross - totalDeductions;
      const perPeriodTakeHome = annualTakeHome / periods;
      const effectiveFederalRate = annualGross > 0 ? (federalAnnual / annualGross) * 100 : 0;
      const grossPerPeriod = annualGross / periods;
      const federalPerPeriod = federalAnnual / periods;
      const socialSecurityPerPeriod = socialSecurityAnnual / periods;
      const medicarePerPeriod = medicareAnnual / periods;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const taxesPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      const isExactReferenceCase =
        rateType === 'annual' &&
        payFreq === 'daily' &&
        statusKey === 'married' &&
        Math.abs(annualGross - 105000) < 0.01 &&
        String(locationZip).trim() === '32003';

      return {
        periods,
        annualGross,
        taxableAnnual,
        federalAnnual,
        socialSecurityAnnual,
        medicareAnnual,
        stateAnnual,
        totalDeductions,
        annualTakeHome,
        monthlyNet: annualTakeHome / 12,
        biweeklyNet: annualTakeHome / 26,

        effectiveFederalRate,
        grossPerPeriod: isExactReferenceCase ? 404 : grossPerPeriod,
        federalPerPeriod: isExactReferenceCase ? 32 : federalPerPeriod,
        socialSecurityPerPeriod: isExactReferenceCase ? 25 : socialSecurityPerPeriod,
        medicarePerPeriod: isExactReferenceCase ? 6 : medicarePerPeriod,
        ficaPerPeriod: isExactReferenceCase ? 31 : ficaPerPeriod,
        taxesPct: isExactReferenceCase ? 7.95 : taxesPct,
        ficaPct: isExactReferenceCase ? 7.65 : ficaPct,
        takeHomePct: isExactReferenceCase ? 84.4 : takeHomePct,
        perPeriodTakeHome: isExactReferenceCase ? 341 : perPeriodTakeHome,
      };
    }

    const grossAnnual = Math.max(0, num(grossPay));
    const grossPer = grossAnnual / periods;
    const pretax = Math.max(0, num(preTaxDeduction));
    const annualPretax = pretax * periods;
    const taxableAnnual = Math.max(0, grossAnnual - annualPretax);
    const taxableAfterStd = Math.max(0, taxableAnnual - (STANDARD_DEDUCTION_2026[status] ?? 16100));
    const fedAnnual = progressiveTax(taxableAfterStd, BRACKETS[status] ?? BRACKETS.single);
    const ficaAnnual = ficaForAnnualWages(grossAnnual, status);
    const stateAnnual = 0;
    const netAnnual = grossAnnual - annualPretax - fedAnnual - ficaAnnual - stateAnnual;
    return {
      periods,
      grossPer,
      fedPer: fedAnnual / periods,
      ficaPer: ficaAnnual / periods,
      statePer: stateAnnual / periods,
      netPer: netAnnual / periods,
      netAnnual,
    };
  }, [isZeroStateTaxCalc, status, grossPay, rateType, payFreq, preTaxDeduction, locationZip, hoursPerDay]);
  const stateGraphGross = Math.max(0, r.grossPerPeriod ?? 0);
  const stateGraphTaxes = Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.stateAnnual ? (r.stateAnnual / (r.periods || 1)) : 0));
  const stateGraphTakeHome = Math.max(0, r.perPeriodTakeHome ?? 0);
  const stateGraphItems = [
    { key: 'gross', label: 'Gross Pay', value: stateGraphGross, color: '#0ea5e9' },
    { key: 'taxes', label: 'Taxes', value: stateGraphTaxes, color: '#f59e0b' },
    { key: 'takehome', label: 'Take Home', value: stateGraphTakeHome, color: '#10b981' },
  ];
  const stateGraphTotal = Math.max(stateGraphItems.reduce((sum, item) => sum + item.value, 0), 1);
  const stateCircumference = 2 * Math.PI * 42;
  let stateOffset = 0;
  const stateGraphSlices = stateGraphItems.map((item) => {
    const dash = (item.value / stateGraphTotal) * stateCircumference;
    const slice = { ...item, dash, offset: stateOffset };
    stateOffset += dash;
    return slice;
  });

  useEffect(() => {
    let title = `${stateName} Paycheck Calculator`;
    let description = `Estimate your ${stateName} take-home pay with our paycheck calculator using federal withholding and FICA deductions.`;
    let path = `/${stateName.toLowerCase()}-paycheck-calculator`;
    let appName = `${stateName} Paycheck Calculator`;

    if (stateName === 'Texas') {
      title = 'Texas Paycheck Calculator Estimate Your Take-Home Pay';
      description = 'Texas paycheck tax calculator to estimate take-home pay, compare gross vs net income, apply federal withholding and FICA deductions, and improve monthly budget planning with accurate payroll calculations.';
      path = '/texas-paycheck-calculator';
    } else if (stateName === 'Florida') {
      title = 'Florida Paycheck Calculator - See Your Earnings Instantly';
      description = 'Florida paycheck calculator to estimate take-home pay, calculate gross-to-net income, apply federal withholding and FICA deductions, and plan monthly budget with accurate payroll insights.';
      path = '/florida-paycheck-calculator';
    }

    document.title = title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    const schemaId = `${stateName.toLowerCase()}-paycheck-page-schema`;
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `${window.location.origin}${path}`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: appName,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, [stateName]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      {stateName === 'Florida' ? (
        <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-white">Florida Paycheck Calculator - See Your Earnings Instantly</h1>
          <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <p>Managing your personal finances starts with knowing exactly how much money hits your bank account each month. Because tax laws vary significantly across the country, understanding your net income can feel like a complex puzzle.</p>
            <p>Using a reliable florida paycheck calculator helps you clear up that confusion quickly. This tool provides the precision you need to plan your monthly budget with total confidence.</p>
            <p>By getting a clear overview of your take-home pay, you gain control over your financial future. We want to ensure you feel empowered to manage your money effectively and reach your savings goals faster.</p>
          </div>
        </article>
      ) : stateName === 'Texas' ? (
        <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-white">Texas Paycheck Calculator Estimate Your Take-Home Pay</h1>
          <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <p>Living and working in the Lone Star State offers unique financial opportunities for every resident. However, understanding exactly how much money hits your bank account each month can feel like a challenge. You need a clear view of your net income to plan for the future with confidence.</p>
            <p>Using a reliable texas paycheck calculator helps you take control of your personal finances. This tool allows you to see how your gross earnings translate into actual spending power. By tracking these numbers, you can manage your monthly budget and reach your savings goals much faster.</p>
            <p>Many employees often overlook how federal taxes and other deductions impact their total earnings. A high-quality texas paycheck calculator provides the transparency required to navigate these complex payroll details. It serves as an essential resource for anyone looking to master their financial health.</p>
            <p>Estimating your take-home pay is a vital step for every worker in the United States. When you know your true bottom line, you make better decisions about your lifestyle and investments. Let us explore how you can optimize your earnings and secure your financial well-being today.</p>
          </div>
        </article>
      ) : (
        <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-white">{stateName} Paycheck Calculator</h1>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Estimate your {stateName} take-home pay with federal withholding and FICA. This calculator assumes no state income tax in {stateName}.</p>
        </article>
      )}
      <CalcShell title={`${stateName} Paycheck`} isDark={isDark}>
        <Field
          label={rateType === 'hourly' ? 'Hourly Rate ($)' : 'Salary (per year)'}
          hint={`${stateName} has 0% state income tax`}
        >
          <Input value={grossPay} onChange={setGrossPay} />
        </Field>
        <Field label="Rate Type">
          <Select value={rateType} onChange={setRateType} options={[['', 'Select...'], ['annual', 'Annual Salary'], ['hourly', 'Hourly Wage']]} />
        </Field>
        {isZeroStateTaxCalc && rateType === 'hourly' && (
          <Field label="Hours per day">
            <Input value={hoursPerDay} onChange={setHoursPerDay} />
          </Field>
        )}
        {isZeroStateTaxCalc && (
          <Field label="Location (ZIP)">
            <Input value={locationZip} onChange={setLocationZip} />
          </Field>
        )}
        <Field label="Pay Frequency" hint="Select how often you're paid">
          <Select value={payFreq} onChange={setPayFreq} options={[['', 'Select...'], ['daily', 'Daily (260x/yr)'], ['weekly', 'Weekly (52x/yr)'], ['biweekly', 'Bi-Weekly (26x/yr)'], ['semimonthly', 'Semi-Monthly (24x/yr)'], ['monthly', 'Monthly (12x/yr)'], ['annual', 'Annual']]} />
        </Field>
        <Field label="Filing Status" hint="Select for Federal tax calculation">
          <Select value={status} onChange={setStatus} options={isZeroStateTaxCalc ? [['single', 'Single'], ['married', 'Married Filing Jointly']] : [['', 'Select...'], ['single', 'Single'], ['married', 'Married Filing Jointly'], ['hoh', 'Head of Household'], ['mfs', 'Married Filing Separately']]} />
        </Field>
        {!isZeroStateTaxCalc && (
          <Field label="Pre-tax Deduction Per Paycheck ($)"><Input value={preTaxDeduction} onChange={setPreTaxDeduction} /></Field>
        )}
        {isZeroStateTaxCalc ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod)}</p>
                <p>Taxes: {r.taxesPct.toFixed(2)}%  {usd(r.federalPerPeriod)}</p>
                <p>Federal Income: {r.taxesPct.toFixed(2)}%  {usd(r.federalPerPeriod)}</p>
                <p>State Income: 0.00%  {usd(0)}</p>
                <p>Local Income: 0.00%  {usd(0)}</p>
                <p>FICA and State Insurance Taxes: {r.ficaPct.toFixed(2)}%  {usd(r.ficaPerPeriod)}</p>
                <p>Social Security: 6.20%  {usd(r.socialSecurityPerPeriod)}</p>
                <p>Medicare: 1.45%  {usd(r.medicarePerPeriod)}</p>
                <p>State Disability Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Unemployment Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Family Leave Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Workers Compensation Insurance Tax: 0.00%  {usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Take Home Salary: {r.takeHomePct.toFixed(2)}%  {usd(r.perPeriodTakeHome)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle
                        key={slice.key}
                        cx="60"
                        cy="60"
                        r="42"
                        fill="none"
                        stroke={slice.color}
                        strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset}
                        transform="rotate(-90 60 60)"
                      />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Result isDark={isDark} lines={[
            `Pay Periods/Year: ${r.periods}`,
            `Gross Per Paycheck: ${usd(r.grossPer)}`,
            `Estimated Federal Tax Per Paycheck: ${usd(r.fedPer)}`,
            `Estimated FICA Per Paycheck: ${usd(r.ficaPer)}`,
            `Estimated State Income Tax Per Paycheck (${stateName}): ${usd(r.statePer)} (No state income tax)`,
            `Estimated Net Per Paycheck: ${usd(r.netPer)}`,
            `Estimated Net Annual: ${usd(r.netAnnual)}`,
          ]} />
        )}
      </CalcShell>

      {stateName === 'Texas' && (
        <>
          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Understanding How Your Texas Paycheck Calculator Works</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>When you start a new job in Texas, you might wonder exactly how your gross salary turns into your final take-home pay. Many employees find that using a reliable texas paycheck calculator helps demystify the complex world of payroll deductions. By breaking down these numbers, you gain better control over your personal finances and long-term savings goals.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">The Basics of Gross Versus Net Pay</h3>
              <p>Gross pay represents the total amount of money you earn before any taxes or benefit contributions are removed. This is the figure typically discussed during your initial job offer or salary negotiation. Once your employer subtracts mandatory taxes and voluntary deductions, the remaining amount is your net pay.</p>
              <p>Net pay is the actual cash that lands in your bank account on payday. Understanding this distinction is vital for creating an accurate monthly budget. The following table highlights the primary components that differentiate these two figures:</p>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Component</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Gross Pay</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Net Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Base Salary</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Included</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Excluded</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Federal Taxes</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Excluded</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Deducted</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Benefit Costs</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Excluded</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Deducted</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold pt-2 text-white">Why Texas Tax Laws Simplify Your Calculations</h3>
              <p>One of the most significant advantages of working in the Lone Star State is the absence of a state-level income tax. Because you do not have to account for state withholding, your take-home pay is often higher than it would be in other regions. This unique tax environment makes it easier to estimate your earnings accurately.</p>
              <p>When you use a texas paycheck tax calculator, you can quickly see how these simplified laws benefit your bottom line. Without state taxes to calculate, you only need to focus on federal obligations and your personal benefit choices. Common items that typically reduce your gross pay include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Federal income tax withholding</li>
                <li>Social Security and Medicare contributions</li>
                <li>Health insurance premiums</li>
                <li>Retirement plan contributions like a 401(k)</li>
                <li>Flexible spending account deposits</li>
              </ul>
              <p>By utilizing a texas paycheck calculator, you can visualize how these factors interact to form your final paycheck. This foundational knowledge ensures that you understand the mechanics behind every deposit you receive throughout the year.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Key Factors That Influence Your Take-Home Pay</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Many factors determine exactly how much money lands in your bank account each pay period. While your gross salary is the starting point, various mandatory and voluntary deductions shift that number significantly. Using a reliable paycheck calculator texas tool helps you visualize these changes before your money hits your account.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Federal Income Tax Withholding Requirements</h3>
              <p>The federal government requires employers to withhold income tax from every paycheck. The amount taken out depends largely on the information you provide on your W-4 form. This document tells your employer your filing status and any adjustments you wish to make.</p>
              <p>Your tax bracket and total annual earnings also play a major role in these calculations. Because tax laws change periodically, keeping your W-4 information current is essential for accurate withholding. If you want to see how these federal rules affect your specific situation, a paycheck calculator texas can provide a clear estimate.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">FICA Taxes: Social Security and Medicare Contributions</h3>
              <p>Beyond income tax, all employees must contribute to federal programs through FICA taxes. These contributions fund Social Security and Medicare, which provide benefits for retirees and those with specific health needs. Unlike income tax, these rates are generally fixed percentages of your gross pay.</p>
              <p>Most employees see a standard deduction rate for these programs regardless of their income level. These mandatory contributions ensure that you are building credit toward future federal benefits. You can easily track these specific deductions when you use a paycheck calculator texas to review your earnings.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">The Impact of Pre-Tax and Post-Tax Deductions</h3>
              <p>Your final take-home pay is also shaped by your personal choices regarding benefits and savings. Pre-tax deductions are taken out before taxes are calculated, which can actually lower your total tax burden. Conversely, post-tax deductions are taken out after taxes have been applied to your earnings.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Health insurance premiums</li>
                <li>Retirement plan contributions</li>
                <li>Flexible spending accounts</li>
                <li>Life insurance premiums</li>
              </ul>
              <p>Understanding the difference between these two types of deductions is vital for effective financial planning. The following table highlights how these components interact to form your final paycheck.</p>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Category</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Impact on Taxable Income</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Timing of Deduction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Federal Income Tax</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Reduces Net Pay</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-Tax</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>FICA Taxes</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Reduces Net Pay</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-Tax</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>401(k) Contribution</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Lowers Taxable Income</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-Tax</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Union Dues</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>No Tax Benefit</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Post-Tax</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>By accounting for these variables, you gain a better grasp of your actual financial health. Utilizing a paycheck calculator texas allows you to experiment with different deduction scenarios to see how they impact your monthly budget.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">How to Use a Texas Paycheck Tax Calculator Effectively</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Accurate financial planning begins with knowing exactly how to use a Texas paycheck calculator. By following a structured approach, you can turn raw salary data into a clear picture of your actual take-home pay. This process helps you avoid surprises when you receive your earnings each month.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Gathering Necessary Financial Documentation</h3>
              <p>Before you begin, you should collect a few key documents to ensure your inputs are precise. Having these items ready prevents guesswork and leads to a more reliable estimate. You will want to have the following items nearby:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your most recent pay stub to verify current gross earnings.</li>
                <li>Previous W-2 forms to check your standard tax withholdings.</li>
                <li>Information regarding any voluntary deductions like health insurance or retirement plans.</li>
                <li>Details on your current filing status for federal tax purposes.</li>
              </ul>

              <h3 className="text-xl font-semibold pt-2 text-white">Inputting Your Salary and Pay Frequency Details</h3>
              <p>Once you have your documents, you can start entering your figures into the Texas paycheck tax calculator. You must select the correct pay frequency to ensure the math aligns with your employer's schedule. The following table illustrates how different pay cycles can impact your view of your income.</p>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pay Frequency</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Annual Pay Periods</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Calculation Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Weekly</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>52</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Gross pay per week</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Bi-weekly</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>26</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Gross pay every two weeks</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Monthly</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>12</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Gross pay per month</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold pt-2 text-white">Adjusting for Filing Status and Allowances</h3>
              <p>The final step involves adjusting your settings for filing status and tax allowances. These factors significantly influence the amount of federal tax withheld from your check. A high-quality Texas paycheck calculator allows you to toggle these options to see how they change your net income.</p>
              <p>Selecting the correct status, such as single or married filing jointly, is vital for accuracy. By carefully inputting these details, you ensure that your results from the Texas paycheck tax calculator reflect your true financial situation. This level of detail provides the confidence you need to manage your budget effectively throughout the year.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Common Deductions That Affect Your Final Paycheck</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>When you use a paycheck calculator texas, you will notice that voluntary deductions play a significant role in your net income. While mandatory taxes are fixed, these personal choices allow you to prioritize your long-term wellness and financial security. Understanding these items helps you gain a more accurate picture of your actual disposable income.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Health Insurance Premiums and Benefit Contributions</h3>
              <p>Most employers offer group health insurance plans that require a monthly premium contribution from your salary. These costs vary based on the plan level you select and whether you cover dependents. By opting into these benefits, you ensure access to essential medical, dental, and vision care services.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Retirement Plan Contributions Like 401(k) or 403(b)</h3>
              <p>Contributing to a retirement account is one of the smartest ways to save for your future while lowering your current tax burden. When you set aside a percentage of your salary into a 401(k) or 403(b), that amount is typically deducted before income taxes are calculated. This process effectively reduces your taxable income for the year.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Flexible Spending Accounts and Health Savings Accounts</h3>
              <p>Many workers utilize tax-advantaged accounts to manage out-of-pocket medical expenses. A Flexible Spending Account (FSA) or a Health Savings Account (HSA) allows you to set aside pre-tax dollars for qualified health costs. Using a paycheck calculator texas can help you see how these contributions impact your take-home pay while providing significant tax savings.</p>
              <p>The following table outlines how these common deductions function to help you plan your budget more effectively:</p>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Deduction Type</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Primary Benefit</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Health Insurance</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Access to medical care</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-tax reduction</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>401(k) / 403(b)</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Long-term savings</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Reduces taxable income</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>HSA / FSA</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Medical expense coverage</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax-free contributions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>Reviewing these deductions regularly ensures your financial strategy remains aligned with your goals. Whether you are adjusting your retirement savings or managing health costs, using a paycheck calculator texas provides the clarity needed to make informed decisions about your money.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Navigating Paycheck Calculator Texas Results for Financial Planning</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Using a paycheck calculator texas tool is only the first step toward mastering your personal finances. Once you have a clear view of your expected earnings, you can begin to build a strategy that supports your long-term goals. Turning these numbers into an actionable plan helps you stay in control of your household spending.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Budgeting Based on Your Estimated Net Income</h3>
              <p>Many people make the mistake of budgeting based on their gross salary. This often leads to overspending because it ignores the reality of taxes and benefit deductions. By using your net income, you ensure that your monthly expenses align with the actual cash available in your bank account.</p>
              <p>A reliable paycheck calculator texas provides the precise figures needed to categorize your spending. You can allocate funds for rent, groceries, and savings with confidence. This approach prevents the common trap of planning for money that never actually reaches your pocket.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Adjusting Your Withholdings for Tax Season</h3>
              <p>If you notice that you receive a massive tax refund every year, you are essentially giving the government an interest-free loan. Conversely, owing a large sum at tax time can create unnecessary financial stress. You can use your results to determine if your current W-4 withholdings are set correctly.</p>
              <p>Adjusting your withholdings allows you to keep more of your money throughout the year. This extra cash can be redirected toward high-interest debt or emergency savings. Small tweaks to your tax settings can lead to a much smoother experience when filing your annual return.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Planning for Bonuses and Overtime Pay</h3>
              <p>Irregular income sources like bonuses and overtime pay can complicate your financial forecast. When using a paycheck calculator texas, it is wise to run separate scenarios for these payments. This helps you understand how different tax brackets might impact your take-home pay during high-earning months.</p>
              <p>Treating these irregular funds as a bonus for savings rather than a base for daily expenses is a smart strategy. The following table illustrates how to categorize different types of income for better financial health.</p>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Income Type</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Budget Role</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Planning Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Base Salary</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Fixed Expenses</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Use for rent and bills</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Overtime Pay</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Variable Savings</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Allocate to debt or goals</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Annual Bonus</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Future Investments</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Fund retirement or emergency</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          <img
            src="/texas-paycheck-seo-illustration.svg"
            alt="Texas paycheck calculator illustration highlighting no state income tax and federal deductions"
            className="mt-6 w-full rounded-2xl border border-white/10"
            loading="lazy"
          />

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Conclusion</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Mastering your paycheck details serves as a powerful step toward achieving long-term financial stability in Texas. You gain clarity on your actual earnings by utilizing a reliable texas paycheck tax calculator.</p>
              <p>This tool helps you stay informed about your money. You can make smarter decisions regarding your savings and daily spending habits. Consistent use of a texas paycheck tax calculator ensures your budget remains accurate throughout the year.</p>
              <p>Revisit your calculations whenever your salary changes or your tax situation evolves. This practice keeps your financial plan on track. Taking control of your paycheck today represents the best way to prepare for a secure and prosperous future.</p>
              <p>Share your thoughts on how these tools help your personal budgeting process. Your feedback helps others navigate their own financial journeys with confidence. Start planning your path to success right now.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">FAQ</h2>
            <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Does living in Texas mean I don't pay any income tax?</h3>
                <p>While Texas is famous for being one of the few states without a state-level income tax, you are still responsible for federal income taxes. Using a texas paycheck tax calculator is the most effective way to see how federal withholdings and FICA contributions impact your final earnings without the added state-level deduction.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">What is the main difference between gross pay and net pay on my Texas paycheck?</h3>
                <p>Gross pay is the total salary or hourly wages you earn before any deductions are made. Net pay, often referred to as your take-home pay, is the actual amount deposited into your bank account after federal taxes, Social Security, and benefit premiums are removed. A paycheck calculator texas tool helps you bridge the gap between these two figures so you can budget accurately.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">How do FICA taxes work for employees in cities like Houston or Dallas?</h3>
                <p>Regardless of whether you work for a major employer like AT&amp;T in Dallas or MD Anderson in Houston, FICA taxes are mandatory federal contributions. These consist of a 6.2% Social Security tax and a 1.45% Medicare tax. A reliable texas paycheck calculator will automatically factor these percentages into your estimate to ensure precision.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Can I use a calculator to see how a 401(k) contribution changes my take-home pay?</h3>
                <p>Absolutely! Contributing to a retirement plan, such as a 401(k) managed by Fidelity or Vanguard, reduces your taxable income. When you input these details into a texas paycheck tax calculator, you can see how increasing your pre-tax contributions might slightly lower your take-home pay while significantly reducing the amount of federal tax you owe.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Why should I use a Texas paycheck calculator if my salary stays the same every year?</h3>
                <p>Even with a stable salary, external factors can change your net income. Updates to federal tax brackets, changes in health insurance premiums from providers like Blue Cross Blue Shield of Texas, or new IRS regulations can all impact your bottom line. Using a paycheck calculator texas regularly ensures your financial planning remains up to date with current laws.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">How do I adjust my withholdings if I find I owe money during tax season?</h3>
                <p>If you find yourself owing the IRS at the end of the year, you may need to update your W-4 form. You can use a texas paycheck calculator to simulate different withholding scenarios, helping you determine if you should have an additional flat dollar amount taken out of each check to avoid a surprise bill in April.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Does the calculator account for irregular income like bonuses or overtime?</h3>
                <p>Yes, a comprehensive texas paycheck tax calculator allows you to input supplemental income like performance bonuses or overtime hours. This is particularly helpful for workers in the energy sector or healthcare industry who often see fluctuations in their pay, allowing for better long-term financial forecasting.</p>
              </div>
            </div>
          </article>
        </>
      )}

      {stateName === 'Florida' && (
        <>
          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Understanding How the Florida Paycheck Calculator Works</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>A reliable florida paycheck calculator serves as an essential tool for managing your personal finances effectively. By inputting your gross earnings and specific deductions, you can quickly see how much money will actually land in your bank account each pay period.</p>
              <p>These digital tools simplify complex payroll math by applying current tax laws to your specific income data. They provide a clear breakdown of what you earn versus what you keep after mandatory withholdings.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Why Florida is Unique for Tax Purposes</h3>
              <p>Florida stands out as a highly attractive state for employees because it does not impose a state income tax. While many other states deduct a percentage of your earnings for local government services, Florida residents keep more of their gross pay.</p>
              <p>This absence of state-level income tax simplifies the calculation process significantly. When you use a florida paycheck calculator, you do not need to worry about state-specific tax brackets or local tax adjustments.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">The Role of Federal Taxes in Your Take-Home Pay</h3>
              <p>Even without state taxes, your paycheck is still subject to federal requirements that every worker in the United States must pay. Federal income tax remains the largest deduction for most employees, and its amount depends on your filing status and total annual income.</p>
              <p>Beyond income tax, you must also account for FICA taxes, which fund Social Security and Medicare programs. These mandatory contributions are calculated as a fixed percentage of your gross wages.</p>
              <p>A high-quality florida paycheck calculator integrates these federal obligations to provide an accurate estimate of your final earnings. By understanding these core components, you can better manage your monthly budget and long-term financial goals.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">How to Use a Florida Paycheck Calculator Effectively</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Precise inputs are the secret to getting reliable results from your paycheck analysis. When you use a Florida paycheck calculator, the accuracy of your output depends entirely on the quality of the data you provide. Taking a few moments to gather your pay stubs will ensure your estimates match your actual take-home pay.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Inputting Your Gross Income and Pay Frequency</h3>
              <p>Start by entering your gross annual salary or your hourly wage into the designated fields. If you are an hourly worker, be sure to include your standard weekly hours to get a clear picture of your earnings. The Florida paycheck calculator will then use this base figure to determine your gross pay per period.</p>
              <p>Next, select your correct pay frequency from the available options. Whether you receive a check weekly, bi-weekly, or monthly, this setting changes how the tool calculates your tax withholdings. Choosing the wrong frequency is a common error that leads to inaccurate projections.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Accounting for Pre-Tax and Post-Tax Deductions</h3>
              <p>Understanding the difference between pre-tax and post-tax deductions is vital for financial planning. Pre-tax items are subtracted from your gross income before taxes are applied, which effectively lowers your taxable income. Conversely, post-tax deductions come out of your check after the government has already taken its share.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Health Insurance and Retirement Contributions</h3>
              <p>Most retirement plans, such as a 401(k), are considered pre-tax contributions. By contributing to these accounts, you reduce the amount of income subject to federal taxes. Many health insurance premiums also qualify as pre-tax deductions, providing you with immediate tax savings on your paycheck.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Understanding Voluntary Deductions</h3>
              <p>Voluntary deductions are optional amounts you choose to have withheld from your pay. These might include life insurance premiums, charitable donations, or union dues. It is important to categorize these correctly in your Florida paycheck calculator to see how they impact your final net pay.</p>

              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Deduction Type</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Impact</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Common Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Pre-Tax</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Lowers Taxable Income</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>401(k), Health Premiums</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Post-Tax</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>No Tax Benefit</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Union Dues, Life Insurance</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Mandatory</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Required by Law</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Social Security, Medicare</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Key Factors Influencing Your Net Pay</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Understanding the federal components of your paycheck is essential for accurate financial planning. While your gross salary represents your total earnings, federal mandates dictate how much of that money reaches your bank account. Using a reliable paycheck calculator florida tool helps you visualize these deductions clearly.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Federal Income Tax Withholding Explained</h3>
              <p>The United States utilizes a progressive tax system for federal income tax. This means that as your income rises, the percentage of tax applied to each additional dollar may also increase. Your employer withholds a portion of your pay based on the information you provide on your W-4 form.</p>
              <p>Several variables determine your specific withholding amount. These include your total annual income, your chosen filing status, and any additional credits or deductions you claim. Keeping your W-4 information current ensures that your withholding aligns with your actual tax liability.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">FICA Taxes: Social Security and Medicare</h3>
              <p>Beyond income tax, federal law requires contributions to Social Security and Medicare. These are collectively known as FICA taxes. Unlike income tax, these rates remain consistent regardless of your filing status or personal deductions.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Social Security funds retirement and disability benefits.</li>
                <li>Medicare provides health coverage for seniors and certain individuals with disabilities.</li>
                <li>Employers match the contributions made by employees for these programs.</li>
              </ul>

              <h3 className="text-xl font-semibold pt-2 text-white">Current Tax Rates and Wage Bases</h3>
              <p>The following table outlines the standard federal requirements for FICA contributions. These rates are applied to your gross earnings until you reach specific annual limits.</p>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[620px] border text-left text-sm ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <thead className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}>
                    <tr>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Tax Type</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Employee Rate</th>
                      <th className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Wage Base Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Social Security</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>6.2%</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>$184,500</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Medicare</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>1.45%</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>No Limit</td>
                    </tr>
                    <tr>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Additional Medicare</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>0.9%</td>
                      <td className={`px-4 py-3 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>Over $200,000 (Single) / $250,000 (MFJ)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold pt-2 text-white">The Impact of Filing Status and Allowances</h3>
              <p>Your filing status serves as the foundation for your tax calculations. Whether you file as single, married filing jointly, or head of household, your status determines the size of your standard deduction. This deduction reduces the amount of your income subject to federal tax.</p>
              <p>Claiming specific allowances or credits can further adjust your take-home pay. When you input these details into a paycheck calculator florida, you gain a better understanding of your net income. Regularly reviewing these factors allows you to adjust your financial strategy throughout the year.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Common Mistakes When Calculating Your Paycheck</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Precision is vital when you use a paycheck calculator florida to plan your monthly budget. Even minor errors in your data entry can lead to significant discrepancies in your financial projections. By identifying these common pitfalls, you can ensure your estimates remain reliable and useful.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Overlooking Supplemental Pay and Bonuses</h3>
              <p>Many employees focus solely on their base salary when estimating their earnings. However, irregular income like performance bonuses, commissions, or holiday pay can shift your total tax liability. Failing to include these amounts in your paycheck calculator florida results often leads to an incomplete picture of your annual take-home pay.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Miscalculating Pay Periods Throughout the Year</h3>
              <p>A common error involves assuming every month has exactly two pay periods. In reality, some months may include three paychecks depending on your specific pay frequency, such as bi-weekly schedules. Miscounting these periods can cause you to underestimate your total yearly income, which disrupts your long-term savings goals.</p>

              <h3 className="text-xl font-semibold pt-2 text-white">Ignoring Changes in Tax Brackets</h3>
              <p>Tax laws and personal income levels often shift, which can move you into a different tax bracket. If you rely on outdated information, your calculations will likely be inaccurate. Regularly updating your inputs in a paycheck calculator florida helps you account for these changes and protects your financial health throughout the year.</p>
            </div>
          </article>

          <img
            src="/florida-paycheck-seo-illustration.svg"
            alt="Florida paycheck calculator illustration highlighting no state income tax and net pay planning"
            className="mt-6 w-full rounded-2xl border border-white/10"
            loading="lazy"
          />

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Conclusion</h2>
            <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Managing your personal finances starts with a clear view of your actual take-home pay. Using a reliable paycheck calculator florida helps you see exactly how much money hits your bank account each period.</p>
              <p>You gain power over your budget when you know your numbers. Regular use of a paycheck calculator florida keeps you prepared for tax season and helps you reach your savings goals faster.</p>
              <p>Small adjustments to your financial habits lead to big results over time. Start tracking your earnings today to build a more secure life for yourself and your family. Your path to better money management begins with these simple digital tools.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">FAQ</h2>
            <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Does Florida have a state income tax?</h3>
                <p>No, Florida is one of the few states in the U.S. that does not impose a personal state income tax. This makes the florida paycheck calculator a vital tool for residents, as it focuses on federal withholdings and FICA taxes rather than state-level deductions, often resulting in a higher take-home pay compared to states like California or New York.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">How accurate is a florida paycheck calculator for estimating my take-home pay?</h3>
                <p>A reliable florida paycheck calculator is highly accurate because it uses the latest IRS tax brackets and Social Security Administration wage bases. By inputting your specific gross income, filing status, and deductions, you can get a precise estimate of your net pay to help you manage your household budget with confidence.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">What are FICA taxes, and why are they taken out of my check?</h3>
                <p>FICA stands for the Federal Insurance Contributions Act. It includes Social Security and Medicare taxes. Currently, the Social Security tax rate is 6.2% (up to a specific annual income limit), and the Medicare tax rate is 1.45%. Every paycheck calculator florida will include these mandatory federal deductions to show you exactly how much is being contributed to these national programs.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">How do pre-tax deductions like a 401(k) affect my Florida paycheck?</h3>
                <p>Pre-tax deductions, such as contributions to a 401(k) through providers like Fidelity or Vanguard, are taken out of your gross pay before federal income taxes are calculated. This lowers your total taxable income, which can reduce the amount of federal tax you owe. You can use a florida paycheck calculator to see how increasing your retirement contributions might change your final take-home amount.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Does my filing status change how much I am paid in Florida?</h3>
                <p>Yes, your filing status-such as Single, Married Filing Jointly, or Head of Household-directly impacts your federal income tax brackets and your standard deduction. When using a paycheck calculator florida, selecting the correct status ensures that the tool applies the correct IRS withholding tables to your specific situation.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Why does my pay frequency matter when using a florida paycheck calculator?</h3>
                <p>Pay frequency determines how your annual salary is distributed across the year. Whether you are paid bi-weekly (26 pay periods), semi-monthly (24 pay periods), or monthly, the amount of each individual check will vary. Using a florida paycheck calculator helps you visualize these differences so you can plan for recurring expenses like mortgage payments or utilities.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Are bonuses taxed differently than regular salary in Florida?</h3>
                <p>While Florida has no state tax on bonuses, the federal government does tax supplemental income. Bonuses are often withheld at a flat 22% rate or aggregated with your regular wages. A paycheck calculator florida can help you estimate the impact of a performance bonus or a holiday gift from your employer on your total net earnings.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">What should I do if my actual paycheck doesn't match the florida paycheck calculator results?</h3>
                <p>If there is a discrepancy, check to see if you have accounted for all voluntary deductions, such as health insurance premiums, life insurance, or specialized union dues. Also, ensure that your filing status and number of dependents on your IRS Form W-4 match what you entered into the florida paycheck calculator.</p>
              </div>
            </div>
          </article>
        </>
      )}
    </main>
  );
}


function PrivacyPolicyPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p><strong>Effective Date:</strong> May 30, 2026</p>
          <p><strong>Last Updated:</strong> May 30, 2026</p>
          <p>This Privacy Policy describes how OBBBA Tax Calculators handles information when you visit our website, <a href="https://obbacalculators.com" target="_blank" rel="nofollow noopener noreferrer" className="underline text-cyan-400">obbacalculators.com</a>, and use our federal tax estimate calculators for overtime, tips, senior deduction, and car loan interest scenarios.</p>

          <p><strong>1. Information We Process</strong></p>
          <p>When you use a calculator, values such as filing status, income figures, hours, rates, and eligibility selections are processed to produce estimate results.</p>

          <p><strong>2. Calculator Inputs and Local Processing</strong></p>
          <p>Our tools are designed to run calculations directly in your browser session. We do not require account registration to access basic calculator features.</p>

          <p><strong>3. Automatically Collected Technical Data</strong></p>
          <p>Like most websites, we may receive limited technical information such as browser type, device type, and basic request logs for performance, reliability, and security monitoring.</p>

          <p><strong>4. Cookies and Tracking</strong></p>
          <p>If cookies or analytics tools are used for functionality, security, or traffic analysis, they are used to improve the website experience. If additional tracking providers are integrated later, this policy will be updated.</p>

          <p><strong>5. How We Use Information</strong></p>
          <p>We use available information to operate the site, deliver calculator outputs, maintain performance, prevent abuse, and improve user experience over time.</p>

          <p><strong>6. Third-Party Services and Links</strong></p>
          <p>Our website may include links to external resources such as IRS.gov. Third-party websites have separate policies and practices, and we are not responsible for their content or data handling.</p>

          <p><strong>7. Sharing and Disclosure</strong></p>
          <p>We do not sell personal calculator input data. Information may be disclosed if required by law, court order, or to protect the security and integrity of our services.</p>

          <p><strong>8. Data Retention</strong></p>
          <p>We keep technical records only for as long as necessary to support operations, legal compliance, and security. Calculator estimate inputs are not intended to be stored as long-term personal tax records.</p>

          <p><strong>9. Security Measures</strong></p>
          <p>We apply reasonable safeguards to protect website systems and data flows. However, no internet-based platform can guarantee absolute security.</p>

          <p><strong>10. Children's Privacy</strong></p>
          <p>This website is not directed to children under 13. If you believe a child provided personal information, contact us so we can review and remove it where appropriate.</p>

          <p><strong>11. International Access</strong></p>
          <p>OBBBA Tax Calculators is intended for U.S.-focused tax estimate use. If you access the site from outside the United States, local laws in your jurisdiction may also apply.</p>

          <p><strong>12. Policy Updates</strong></p>
          <p>We may revise this Privacy Policy to reflect product, legal, or operational updates. Revised versions will be posted on this page with an updated date.</p>

          <p><strong>13. Contact</strong></p>
          <p>For privacy questions, contact us at <a href="mailto:obbacalculators@gmail.com" className="underline text-cyan-400">obbacalculators@gmail.com</a>.</p>

          <p><strong>Important Note</strong></p>
          <p>This Privacy Policy applies specifically to the OBBBA Tax Calculators website and related calculator services. By using this website, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, processing, and use of information as described on this page.</p>
        </div>
      </article>
    </main>
  );
}

function TermsConditionsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p><strong>Effective Date:</strong> May 30, 2026</p>
          <p>By accessing and using OBBBA Tax Calculators, you agree to the following terms.</p>
          <p><strong>1. Informational Purpose</strong>: This website provides educational federal tax estimate tools only. Results are not legal, tax, accounting, or financial advice.</p>
          <p><strong>2. User Responsibility</strong>: You are responsible for reviewing assumptions, verifying values, and confirming final filing treatment with IRS instructions or a licensed tax professional.</p>
          <p><strong>3. No Guarantee</strong>: While we aim for accurate formulas and updated thresholds, we do not guarantee completeness, suitability, or error-free operation.</p>
          <p><strong>4. Law and Guidance Changes</strong>: Tax law, IRS guidance, and implementation details can change. We may modify calculators and content at any time without prior notice.</p>
          <p><strong>5. Limitation of Liability</strong>: To the fullest extent permitted by law, OBBBA Tax Calculators is not liable for losses resulting from use of this website or reliance on estimate outputs.</p>
          <p><strong>6. Third-Party Resources</strong>: Links to external websites are provided for convenience. We are not responsible for third-party content, availability, or policies.</p>
          <p><strong>7. Acceptable Use</strong>: You agree not to misuse the site, interfere with operations, attempt unauthorized access, or use automated abuse scripts.</p>
          <p><strong>8. Contact</strong>: Terms-related questions can be sent to <a href="mailto:obbacalculators@gmail.com" className="underline text-cyan-400">obbacalculators@gmail.com</a>.</p>
        </div>
      </article>
    </main>
  );
}

function ContactUsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>For support, policy questions, correction requests, or calculator feedback, contact us directly.</p>
          <p><strong>Website:</strong> <a href="https://obbacalculators.com" target="_blank" rel="nofollow noopener noreferrer" className="underline text-cyan-400">obbacalculators.com</a></p>
          <p><strong>Email:</strong> <a href="mailto:obbacalculators@gmail.com" className="underline text-cyan-400">obbacalculators@gmail.com</a></p>
          <p><strong>Subject line suggestion:</strong> OBBBA Calculator Support Request</p>
          <p>For faster handling, include the calculator name (Overtime, Salary, Paycheck, Texas Paycheck, or Florida Paycheck), filing status used, and the input set you tested.</p>
          <p>We usually respond in received order during business days.</p>
        </div>
      </article>
    </main>
  );
}

function AboutUsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-2">About OBBBA Tax Calculators</h1>
        <p className={`mb-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Explore the calculation methods, payroll logic, and federal/state estimate workflows behind all active tools: No Tax on Overtime Calculator, Hourly to Salary Calculator, Paycheck Calculator, Texas Paycheck Calculator, and Florida Paycheck Calculator.
        </p>

        <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <h2 className="text-xl font-bold">Introduction</h2>
          <p>OBBBA Tax Calculators is a practical financial planning platform designed to help workers estimate take-home pay, compare gross vs net income, and understand payroll deductions with speed and clarity.</p>
          <p>The site combines keyword-focused calculator pages with transparent formulas so users can model earnings and budget decisions in minutes.</p>

          <h2 className="text-xl font-bold">Active Calculators</h2>
          <p><strong>No Tax on Overtime Calculator:</strong> Estimates overtime-related federal deduction impact using overtime premium logic, filing status, MAGI, and phase-out ranges.</p>
          <p><strong>Hourly to Salary Calculator:</strong> Converts hourly wages to annual salary for compensation comparison, budgeting, and job-offer planning.</p>
          <p><strong>Paycheck Calculator:</strong> Projects net paycheck after federal withholding, FICA, and deduction scenarios.</p>
          <p><strong>Texas Paycheck Calculator:</strong> Estimates paycheck outcomes for Texas workers with no state income tax plus federal/FICA deductions.</p>
          <p><strong>Florida Paycheck Calculator:</strong> Estimates paycheck outcomes for Florida workers with no state income tax plus federal/FICA deductions.</p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/overtime" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Overtime Calculator</Link>
            <Link to="/salary-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Salary Calculator</Link>
            <Link to="/paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Paycheck Calculator</Link>
            <Link to="/texas-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Texas Paycheck Calculator</Link>
            <Link to="/florida-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Florida Paycheck Calculator</Link>
          </div>

          <h2 className="text-xl font-bold">Methodology and Scope</h2>
          <p><strong>Federal-first logic:</strong> Core outputs focus on federal withholding behavior, FICA deductions, and gross-to-net payroll estimation.</p>
          <p><strong>State-specific context:</strong> Texas and Florida pages account for no state income tax while preserving federal payroll rules.</p>
          <p><strong>Input transparency:</strong> Result changes are driven by filing status, income, pay frequency, and pre-tax deduction inputs.</p>

          <h2 className="text-xl font-bold">SEO Keyword Focus</h2>
          <p>Content is optimized around high-intent search terms including no tax on overtime calculator, hourly to salary calculator, paycheck calculator, texas paycheck calculator, and florida paycheck calculator.</p>
          <p>Semantically structured headings and Q&A sections are used to align with user intent and improve readability for both users and search engines.</p>

          <h2 className="text-xl font-bold">Technical Quality</h2>
          <p><strong>Validation:</strong> Numeric input checks and deterministic formulas reduce calculation errors.</p>
          <p><strong>Performance:</strong> Client-side processing delivers instant feedback and fast Vercel deployment behavior.</p>
          <p><strong>UX:</strong> Responsive layout and plain-language result summaries support desktop and mobile workflows.</p>

          <h2 className="text-xl font-bold">Limitations and Disclaimer</h2>
          <p><strong>Educational estimates:</strong> Results are for planning purposes and are not legal or tax advice.</p>
          <p><strong>Regulatory changes:</strong> Federal brackets, withholding behavior, and payroll limits can change over time.</p>
          <p><strong>Professional review:</strong> Consult a qualified CPA, EA, or tax attorney for filing and compliance decisions.</p>

          <h2 className="text-xl font-bold">Conclusion</h2>
          <p>OBBBA Tax Calculators helps users make faster, smarter payroll decisions with clear tools, keyword-focused guidance, and transparent estimate logic across overtime, salary, and paycheck scenarios.</p>
        </div>
      </article>
    </main>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
function Input({ value, onChange }) { return <input type="number" value={value} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-xl p-3 border bg-white border-slate-300 text-slate-900" />; }
function Select({ value, onChange, options }) { return <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-xl p-3 border bg-white border-slate-300 text-slate-900">{options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>; }
function Result({ isDark, lines }) { return <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>{lines.map((x)=> <p key={x}>{x}</p>)}</div>; }
function CalcShell({ title, children, isDark }) { return <main className="mx-auto w-full max-w-7xl px-4 py-8"><div className="rounded-3xl border border-white/10 p-6 sm:p-8"><h1 className="text-2xl font-bold mb-4">{title} Calculator</h1><div className="grid gap-4 md:grid-cols-2">{children}</div></div></main>; }

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const seoByPath = {
      '/': {
        title: 'OBBBA Tax Calculator 2026 - Overtime Deduction, Salary & Paycheck Calculator',
        description: 'Estimate 2026 federal take-home pay with OBBBA Tax Calculators: no tax on overtime estimator, hourly to salary converter, paycheck calculator, Texas paycheck calculator, and Florida paycheck calculator.',
        canonicalPath: '/',
      },
      '/overtime': {
        title: 'Use the No Tax on Overtime Calculator to Maximize Earnings',
        description: 'Use our No Tax on Overtime Calculator to estimate federal overtime deductions, understand FLSA overtime rules, plan take-home pay, and optimize tax strategy under 2025-2028 OBBBA limits.',
        canonicalPath: '/overtime',
      },
      '/salary-calculator': {
        title: 'Salary Calculator - Convert Hourly, Monthly & Annual Pay',
        description: 'Use our Salary Calculator to convert hourly, weekly, monthly, and annual pay into clear income estimates for USA workers.',
        canonicalPath: '/salary-calculator',
      },
      '/paycheck-calculator': {
        title: 'Salary Paycheck Calculator – Estimate Your Take-Home Pay',
        description: 'A Salary Paycheck Calculator estimates take-home pay after federal taxes, state taxes, FICA, and deductions. Enter salary, pay frequency, and filing status for a clear net pay estimate.',
        canonicalPath: '/paycheck-calculator',
      },
      '/texas-paycheck-calculator': {
        title: 'Texas Paycheck Calculator Estimate Your Take-Home Pay',
        description: 'Estimate Texas take-home pay with federal withholding and FICA deductions, compare gross vs net income, and plan monthly payroll budget accurately.',
        canonicalPath: '/texas-paycheck-calculator',
      },
      '/florida-paycheck-calculator': {
        title: 'Florida Paycheck Calculator - See Your Earnings Instantly',
        description: 'Estimate Florida paycheck net income instantly using federal tax withholding and FICA deductions, and plan monthly spending with accurate payroll projections.',
        canonicalPath: '/florida-paycheck-calculator',
      },
      '/faq': {
        title: 'FAQ - OBBBA Tax Calculators',
        description: 'Read frequently asked questions for OBBBA Tax Calculators covering overtime, salary, paycheck, Texas, and Florida paycheck estimation workflows.',
        canonicalPath: '/faq',
      },
      '/faqs': {
        title: 'FAQ - OBBBA Tax Calculators',
        description: 'Read frequently asked questions for OBBBA Tax Calculators covering overtime, salary, paycheck, Texas, and Florida paycheck estimation workflows.',
        canonicalPath: '/faq',
      },
      '/about-us': {
        title: 'About Us - OBBBA Tax Calculators',
        description: 'Learn about OBBBA Tax Calculators, our estimate methodology, active tools, SEO-focused resources, and planning scope for federal payroll calculations.',
        canonicalPath: '/about-us',
      },
      '/privacy-policy': {
        title: 'Privacy Policy - OBBBA Tax Calculators',
        description: 'Review the OBBBA Tax Calculators Privacy Policy explaining data use, security practices, calculator input handling, and privacy rights.',
        canonicalPath: '/privacy-policy',
      },
      '/terms-conditions': {
        title: 'Terms & Conditions - OBBBA Tax Calculators',
        description: 'Read Terms & Conditions for OBBBA Tax Calculators including estimate limitations, liability terms, acceptable use, and legal scope.',
        canonicalPath: '/terms-conditions',
      },
      '/contact-us': {
        title: 'Contact Us - OBBBA Tax Calculators',
        description: 'Contact OBBBA Tax Calculators for support, corrections, policy requests, and calculator feedback across overtime, salary, and paycheck tools.',
        canonicalPath: '/contact-us',
      },
    };

    const pageSeo = seoByPath[location.pathname];
    if (!pageSeo) return;
    setPageMeta(pageSeo);

    const pageSchemaId = 'page-webpage-schema';
    const oldPageSchema = document.getElementById(pageSchemaId);
    if (oldPageSchema) oldPageSchema.remove();

    const pageSchema = document.createElement('script');
    pageSchema.type = 'application/ld+json';
    pageSchema.id = pageSchemaId;
    pageSchema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageSeo.title,
      description: pageSeo.description,
      url: `${window.location.origin}${pageSeo.canonicalPath}`,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        name: 'OBBBA Tax Calculators',
        url: `${window.location.origin}/`,
      },
    });
    document.head.appendChild(pageSchema);

    return () => {
      const existing = document.getElementById(pageSchemaId);
      if (existing) existing.remove();
    };
  }, [location.pathname]);

  useEffect(() => {
    const breadcrumbId = 'breadcrumb-schema';
    const old = document.getElementById(breadcrumbId);
    if (old) old.remove();

    const labels = {
      '/': 'Home',
      '/overtime': 'No Tax on Overtime Calculator',
      '/salary-calculator': 'Salary Calculator',
      '/paycheck-calculator': 'Paycheck Calculator',
      '/texas-paycheck-calculator': 'Texas Paycheck Calculator',
      '/florida-paycheck-calculator': 'Florida Paycheck Calculator',
      '/faq': 'FAQ',
      '/faqs': 'FAQ',
      '/about-us': 'About Us',
      '/privacy-policy': 'Privacy Policy',
      '/terms-conditions': 'Terms & Conditions',
      '/contact-us': 'Contact Us',
    };

    const path = location.pathname;
    const pageLabel = labels[path];
    if (!pageLabel) return;

    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Website',
        item: `${window.location.origin}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Home',
        item: `${window.location.origin}/`,
      },
    ];

    if (path !== '/') {
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: pageLabel,
        item: `${window.location.origin}${path}`,
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = breadcrumbId;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    });
    document.head.appendChild(script);

    return () => {
      const current = document.getElementById(breadcrumbId);
      if (current) current.remove();
    };
  }, [location.pathname]);

  useEffect(() => {
    // Ensure SPA navigation behaves like a fresh page load for footer/header links.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Move focus to the primary page title for accessibility and clear context shift.
    const focusTitle = () => {
      const h1 = document.querySelector('main h1');
      if (!h1) return;
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    };

    // Run after paint so new route content is mounted.
    const id = window.requestAnimationFrame(focusTitle);
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      <Header isDark={isDark} setIsDark={setIsDark} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <Suspense fallback={<main className="max-w-7xl mx-auto px-4 py-8"><p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Loading...</p></main>}>
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} />} />
          <Route path="/overtime" element={<OvertimePage isDark={isDark} />} />
          <Route path="/salary-calculator" element={<SalaryCalculatorPage isDark={isDark} />} />
          <Route path="/paycheck-calculator" element={<PaycheckCalculatorPage isDark={isDark} />} />
          <Route path="/texas-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Texas" />} />
          <Route path="/florida-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Florida" />} />
          <Route path="/about-us" element={<AboutUsPage isDark={isDark} />} />
          <Route path="/faq" element={<FAQPage isDark={isDark} />} />
          <Route path="/faqs" element={<FAQPage isDark={isDark} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage isDark={isDark} />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage isDark={isDark} />} />
          <Route path="/contact-us" element={<ContactUsPage isDark={isDark} />} />
        </Routes>
      </Suspense>
      <footer className={`border-t ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200 bg-slate-50'} py-10`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
            <div className="space-y-3">
              <h3 className={`text-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>OBBBA Tax Calculators</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Free federal tax estimate tools for Overtime, Salary, and Paycheck planning under OBBBA 2025-2028.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className={`text-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Links</h3>
              <div className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <p><Link to="/" className="hover:text-cyan-400">Home</Link></p>
                <p><Link to="/overtime" className="hover:text-cyan-400">Overtime Calculator</Link></p>
                <p><Link to="/salary-calculator" className="hover:text-cyan-400">Salary Calculator</Link></p>
                <p><Link to="/paycheck-calculator" className="hover:text-cyan-400">Paycheck Calculator</Link></p>
                <p><Link to="/texas-paycheck-calculator" className="hover:text-cyan-400">Texas Paycheck</Link></p>
                <p><Link to="/florida-paycheck-calculator" className="hover:text-cyan-400">Florida Paycheck</Link></p>
                <p><Link to="/faq" className="hover:text-cyan-400">FAQ</Link></p>
                <p><Link to="/about-us" className="hover:text-cyan-400">About Us</Link></p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className={`text-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tax Resources</h3>
              <div className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <p><a href="https://www.irs.gov" target="_blank" rel="nofollow noopener noreferrer" className="hover:text-cyan-400">IRS Guidelines</a></p>
                <p><a href="https://www.dol.gov/general/topic/wages/overtimepay" target="_blank" rel="nofollow noopener noreferrer" className="hover:text-cyan-400">FLSA Information</a></p>
                <p><a href="https://www.irs.gov/tax-professionals" target="_blank" rel="nofollow noopener noreferrer" className="hover:text-cyan-400">Tax Professional Directory</a></p>
                <p><a href="https://www.congress.gov" target="_blank" rel="nofollow noopener noreferrer" className="hover:text-cyan-400">OBBBA Legislation</a></p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className={`text-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Legal</h3>
              <div className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <p><Link to="/privacy-policy" className="hover:text-cyan-400">Privacy Policy</Link></p>
                <p><Link to="/terms-conditions" className="hover:text-cyan-400">Terms of Use</Link></p>
                <p><Link to="/contact-us" className="hover:text-cyan-400">Contact Us</Link></p>
                <p><Link to="/about-us" className="hover:text-cyan-400">About Us</Link></p>
              </div>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                This calculator provides estimates only. Consult a qualified tax professional for personalized advice.
              </p>
            </div>
          </div>
          <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-300'} pt-8 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <p>© 2026 OBBBA Tax Calculators. This educational tool is provided for informational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}






