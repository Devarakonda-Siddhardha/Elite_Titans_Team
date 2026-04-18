require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEAM_ID = process.env.TEAM_ID || '6955664';
const TEAM_SLUG = process.env.TEAM_SLUG || 'elite-titans';
const BASE = `https://cricheroes.com/team-profile/${TEAM_ID}/${TEAM_SLUG}`;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

function unwrap(field) {
  if (!field || typeof field !== 'object') return null;
  if (field.status === false) return null;
  if ('data' in field) return field.data;
  return field;
}

async function loadPage(page, tab) {
  log(`Loading ${tab}`);
  await page.goto(`${BASE}/${tab}`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.evaluate(async () => {
    for (let i = 0; i < 8; i++) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 400));
    }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1500));
}

async function getNextData(page) {
  return page.evaluate(() => {
    const el = document.getElementById('__NEXT_DATA__');
    return el ? JSON.parse(el.textContent).props.pageProps : null;
  });
}

async function scrapeMembers(page) {
  await loadPage(page, 'members');
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll('a[href*="/player-profile/"]')];
    const seen = new Set();
    const out = [];
    for (const c of cards) {
      const href = c.getAttribute('href') || '';
      if (seen.has(href)) continue;
      seen.add(href);
      const m = href.match(/player-profile\/(\d+)\/([^/]+)/);
      const lines = (c.innerText || '').split('\n').map(s => s.trim()).filter(Boolean);
      const img = c.querySelector('img');
      out.push({
        player_id: m ? parseInt(m[1], 10) : null,
        slug: m ? m[2] : null,
        name: lines[0] || null,
        badges: lines.slice(1),
        is_captain: lines.some(l => /captain/i.test(l)),
        profile_photo: img?.getAttribute('src') || null
      });
    }
    return out;
  });
}

async function scrapeLeaderboard(page) {
  await loadPage(page, 'leaderboard');
  return page.evaluate(() => {
    const sections = [];
    const headings = [...document.querySelectorAll('h2, h3, [class*="title"], [class*="Title"]')]
      .filter(h => h.innerText && h.innerText.length < 60);

    const playerCards = [...document.querySelectorAll('a[href*="/player-profile/"]')];
    const seenPlayers = playerCards.map(c => {
      const href = c.getAttribute('href') || '';
      const m = href.match(/player-profile\/(\d+)\/([^/]+)/);
      return {
        player_id: m ? parseInt(m[1], 10) : null,
        slug: m ? m[2] : null,
        text: (c.innerText || '').split('\n').map(s => s.trim()).filter(Boolean),
        context_text: (c.closest('section, div[class*="leaderboard"], div[class*="Leaderboard"]')?.innerText || '').slice(0, 200)
      };
    });

    return { headings: headings.map(h => h.innerText), entries: seenPlayers };
  });
}

async function scrapeAllMatches(page) {
  const years = [2026, 2025, 2024];
  const all = [];
  const seen = new Set();
  for (const year of years) {
    log(`Matches year=${year}`);
    await page.goto(`${BASE}/matches?year=${year}`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    const pageProps = await getNextData(page);
    const list = unwrap(pageProps?.matches) || [];
    for (const m of (Array.isArray(list) ? list : [])) {
      if (seen.has(m.match_id)) continue;
      seen.add(m.match_id);
      all.push(m);
    }
  }
  return all;
}

async function scrapeTeamInfo(page) {
  await page.goto(`${BASE}/stats`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  const pageProps = await getNextData(page);
  return {
    team: unwrap(pageProps?.teamDetails),
    team_stats: unwrap(pageProps?.teamStats)
  };
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport({ width: 1366, height: 900 });

    const { team, team_stats } = await scrapeTeamInfo(page);
    const matches = await scrapeAllMatches(page);
    const members = await scrapeMembers(page);
    const leaderboard = await scrapeLeaderboard(page);

    const bundle = {
      scraped_at: new Date().toISOString(),
      team,
      team_stats,
      matches,
      members,
      leaderboard
    };

    const outPath = path.join(__dirname, 'data.json');
    fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2));
    log(`Saved ${outPath}`);
    log(`Team: ${team?.team_name} | Matches: ${matches.length} | Members: ${members.length}`);

    if (process.argv.includes('--push')) {
      pushToGit();
    }
  } finally {
    await browser.close();
  }
}

function pushToGit() {
  const repoDir = path.resolve(__dirname, '..');
  try {
    execSync('git add scraper/data.json', { cwd: repoDir, stdio: 'inherit' });
    try {
      execSync(`git commit -m "chore: auto-update scraped data ${new Date().toISOString()}"`, {
        cwd: repoDir, stdio: 'inherit'
      });
    } catch (e) {
      log('Nothing to commit (data unchanged)');
      return;
    }
    execSync('git push origin main', { cwd: repoDir, stdio: 'inherit' });
    log('Pushed to GitHub');
  } catch (e) {
    log('Git push failed:', e.message);
  }
}

run().catch(e => {
  log('ERROR', e);
  process.exit(1);
});
