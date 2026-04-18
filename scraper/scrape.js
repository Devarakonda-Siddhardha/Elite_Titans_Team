require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const TEAM_ID = process.env.TEAM_ID || '6955664';
const TEAM_SLUG = process.env.TEAM_SLUG || 'elite-titans';
const BASE = `https://cricheroes.com/team-profile/${TEAM_ID}/${TEAM_SLUG}`;

const TABS = ['profile', 'matches', 'stats', 'leaderboard', 'members'];

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

async function scrapeTab(page, tab) {
  const apiResponses = {};
  const handler = async (response) => {
    const url = response.url();
    if (!url.includes('cricheroes.in/api/')) return;
    try {
      const ct = response.headers()['content-type'] || '';
      if (!ct.includes('application/json')) return;
      const json = await response.json();
      const key = url.split('/api/')[1].split('?')[0];
      apiResponses[key] = apiResponses[key] || [];
      apiResponses[key].push({ url, data: json });
    } catch (e) {}
  };
  page.on('response', handler);

  log(`Loading ${tab}...`);
  await page.goto(`${BASE}/${tab}`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  page.off('response', handler);
  return apiResponses;
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1366, height: 900 });

    const bundle = {
      team_id: TEAM_ID,
      team_slug: TEAM_SLUG,
      scraped_at: new Date().toISOString(),
      tabs: {}
    };

    for (const tab of TABS) {
      try {
        bundle.tabs[tab] = await scrapeTab(page, tab);
      } catch (e) {
        log(`Failed ${tab}:`, e.message);
        bundle.tabs[tab] = { error: e.message };
      }
    }

    const out = normalize(bundle);
    const outPath = path.join(__dirname, 'data.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    log(`Saved ${outPath}`);

    if (process.argv.includes('--push')) {
      await pushToGist(out);
    }

    return out;
  } finally {
    await browser.close();
  }
}

function normalize(bundle) {
  const team = { id: bundle.team_id, slug: bundle.team_slug };
  const out = {
    team,
    scraped_at: bundle.scraped_at,
    overview: null,
    matches: [],
    players: [],
    team_stats: null,
    leaderboard: null
  };

  const flatten = (tabData) => {
    const arr = [];
    Object.values(tabData || {}).forEach(entries => {
      if (Array.isArray(entries)) entries.forEach(e => arr.push(e));
    });
    return arr;
  };

  const allResponses = Object.values(bundle.tabs).flatMap(flatten);

  for (const r of allResponses) {
    const u = r.url.toLowerCase();
    const d = r.data?.data || r.data;
    if (!d) continue;

    if (u.includes('/team/') && u.includes('/profile') && !out.overview) out.overview = d;
    if (u.includes('matches') && Array.isArray(d) && d.length && (d[0].match_id || d[0].match_start_time)) {
      out.matches = d;
    }
    if (u.includes('matches') && d.matches && Array.isArray(d.matches)) {
      out.matches = d.matches;
    }
    if (u.includes('member') && Array.isArray(d) && d.length && d[0].player_id) {
      out.players = d;
    }
    if (u.includes('member') && d.players && Array.isArray(d.players)) {
      out.players = d.players;
    }
    if (u.includes('stats') && !Array.isArray(d)) {
      out.team_stats = out.team_stats || d;
    }
    if (u.includes('leaderboard')) {
      out.leaderboard = out.leaderboard || d;
    }
  }

  out._raw = bundle.tabs;
  return out;
}

function pushToGist(data) {
  const token = process.env.GITHUB_TOKEN;
  const gistId = process.env.GIST_ID;
  if (!token || !gistId) {
    log('Skipping Gist push (GITHUB_TOKEN or GIST_ID missing)');
    return;
  }

  const body = JSON.stringify({
    files: {
      'elite-titans.json': { content: JSON.stringify(data, null, 2) }
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'PATCH',
      hostname: 'api.github.com',
      path: `/gists/${gistId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'elite-titans-scraper',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          log('Pushed to Gist');
          resolve();
        } else {
          reject(new Error(`Gist push ${res.statusCode}: ${b}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

run().catch(e => {
  log('ERROR', e);
  process.exit(1);
});
