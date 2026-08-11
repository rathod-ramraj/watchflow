const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { isWhitelisted } = require('./skip-list');

const REQUEST_TIMEOUT = 8000;
const CONCURRENCY = 6;
const MAX_NEW_LINKS = 15;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ALLOWED_CATEGORIES = new Set(['movies', 'anime', 'manga', 'livetv', 'paid', 'apps']);

const FMHY_DOCS = [
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/video.md', defaultCat: 'movies' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/reading.md', defaultCat: 'manga' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/mobile.md', defaultCat: 'apps' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/non-english.md', defaultCat: 'movies' }
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function normalize(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host.replace(/^www\./, '').toLowerCase()}${u.pathname.replace(/\/+$/, '')}`;
  } catch {
    return (url || '').trim().replace(/\/+$/, '').toLowerCase();
  }
}

function siteRoot(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}/`;
  } catch {
    return null;
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function logoDirForCategory(catId) {
  switch (catId) {
    case 'movies': return 'movies_shows';
    case 'paid': return 'paid_apps';
    default: return catId;
  }
}

function hit(url, { method = 'HEAD', timeout = REQUEST_TIMEOUT } = {}) {
  return new Promise((resolve) => {
    let u;
    try { u = new URL(url); } catch { return resolve({ ok: false, error: 'bad-url' }); }
    const isHttps = u.protocol === 'https:';
    const lib = isHttps ? https : http;
    const req = lib.request(url, {
      method,
      timeout,
      headers: {
        'user-agent': UA,
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    }, (res) => {
      resolve({ ok: true, status: res.statusCode });
    });
    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
    req.end();
  });
}

const ALIVE_STATUSES = new Set([200, 201, 202, 203, 204, 206, 301, 302, 303, 307, 308, 403, 405, 406, 429, 451, 503]);

async function isAlive(url) {
  let res = await hit(url, { method: 'HEAD' });
  if (!res.ok || (res.status >= 400 && res.status < 500)) {
    const g = await hit(url, { method: 'GET' });
    if (g.ok) res = g;
  }
  return res.ok && ALIVE_STATUSES.has(res.status);
}

function collectExistingUrls() {
  const existing = new Set();
  const publicDir = path.join(process.cwd(), 'public');
  const files = [
    path.join(publicDir, 'links.json'),
    ...fs.readdirSync(path.join(publicDir, 'Region-Links'))
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(publicDir, 'Region-Links', f))
  ];

  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      for (const cat of data.categories || []) {
        for (const site of cat.sites || []) {
          if (site.url) existing.add(normalize(site.url));
        }
      }
    } catch {}
  }
  return existing;
}

const JUNK_HOST_SUFFIXES = [
  'github.com', 'github.io', 'reddit.com', 'wikipedia.org', 'wikidata.org',
  'discord.gg', 'discord.com', 'discordapp.com', 't.me', 'telegram.me', 'telegram.org',
  'rentry.co', 'rentry.org', 'pastebin.com', 'hastebin.com', 'ghostbin.com',
  'twitter.com', 'x.com', 'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
  'patreon.com', 'ko-fi.com', 'buymeacoffee.com', 'subscribestar.com',
  'archive.org', 'web.archive.org', 'fmhy.net', 'fmhy.pages.dev', 'fmhy.org',
  'google.com', 'google.co', 'google.org', 'blogspot.com', 'wordpress.com',
  'medium.com', 'notion.site', 'notion.so', 'gitlab.com', 'codeberg.org',
  'sourceforge.net', 'docker.com', 'npmjs.com', 'virustotal.com',
  'greasyfork.org', 'openuserjs.org', 'tampermonkey.net'
];

function isJunkHost(host) {
  const h = (host || '').toLowerCase();
  return JUNK_HOST_SUFFIXES.some(s => h === s || h.endsWith('.' + s));
}

function isJunkName(name) {
  const n = (name || '').trim();
  if (!n || /^\d+$/.test(n) || n.length < 2) return true;
  if (/^[◄►▲▼◀▶★⭐\s]+/.test(n)) return true;
  if (/^(mirror|backup|alt|index|wiki|back to|star|fork|edit|discord|grading page|guide|tutorial|faq|rules|readme|changelog)$/i.test(n)) return true;
  if (/back to/i.test(n) || /wiki index/i.test(n) || /guide/i.test(n) || /setup/i.test(n)) return true;
  return false;
}

async function discover() {
  console.log('🔍 Discovering new links for [movies, anime, manga, livetv, paid, apps] from FMHY docs…');
  const existingUrls = collectExistingUrls();
  const linkRe = /\[([^\]]{1,120})\]\((https?:\/\/[^)\s]+)\)/g;
  const candidates = [];

  for (const doc of FMHY_DOCS) {
    console.log(` 📥 Fetching ${doc.url}…`);
    const res = await hit(doc.url, { method: 'GET', timeout: 15000 });
    if (!res.ok) continue;

    await new Promise((resolve) => {
      let body = '';
      const lib = doc.url.startsWith('https') ? https : http;
      lib.get(doc.url, { headers: { 'user-agent': UA } }, (r) => {
        r.on('data', chunk => body += chunk);
        r.on('end', () => {
          let currentCat = doc.defaultCat;

          for (const line of body.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#')) {
              const headerLower = trimmed.toLowerCase();
              if (headerLower.includes('anime')) currentCat = 'anime';
              else if (headerLower.includes('manga') || headerLower.includes('comic')) currentCat = 'manga';
              else if (headerLower.includes('live tv') || headerLower.includes('sport')) currentCat = 'livetv';
              else if (headerLower.includes('app') || headerLower.includes('android') || headerLower.includes('mobile')) currentCat = 'apps';
              else if (headerLower.includes('paid') || headerLower.includes('premium')) currentCat = 'paid';
              else if (headerLower.includes('movie') || headerLower.includes('show') || headerLower.includes('stream')) currentCat = 'movies';
            }

            if (!ALLOWED_CATEGORIES.has(currentCat)) continue;

            const lineRe = new RegExp(linkRe.source, 'g');
            let match;
            while ((match = lineRe.exec(line)) !== null) {
              const name = match[1].trim();
              const rawUrl = match[2].trim();
              const root = siteRoot(rawUrl);
              if (!root || isJunkName(name)) continue;

              let host = '';
              try { host = new URL(root).hostname; } catch { continue; }
              if (isJunkHost(host)) continue;

              const norm = normalize(root);
              if (existingUrls.has(norm) || isWhitelisted(root)) continue;
              existingUrls.add(norm);

              candidates.push({
                name,
                url: root,
                category: currentCat
              });
            }
          }
          resolve();
        });
      });
    });
  }

  console.log(` Found ${candidates.length} new potential link candidates. Testing vitality…`);
  const added = [];

  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    if (added.length >= MAX_NEW_LINKS) break;
    const batch = candidates.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (cand) => {
      if (added.length >= MAX_NEW_LINKS) return;
      if (await isAlive(cand.url)) {
        if (added.length >= MAX_NEW_LINKS) return;
        const slug = slugify(cand.name);
        const logoDir = logoDirForCategory(cand.category);
        const newItem = {
          name: cand.name,
          url: cand.url,
          logo: `./logo/${logoDir}/${slug}.png`,
          enabled: true,
          status: 'new'
        };
        added.push({ ...newItem, categoryId: cand.category });
        console.log(`   ✓ Found new live link (${added.length}/${MAX_NEW_LINKS}): [${cand.name}] (${cand.url}) -> category: ${cand.category}`);
      }
    }));
  }

  if (added.length > 0) {
    const publicDir = path.join(process.cwd(), 'public');
    const regionLinksDir = path.join(publicDir, 'Region-Links');
    const targetFiles = [
      path.join(publicDir, 'links.json'),
      ...(fs.existsSync(regionLinksDir)
        ? fs.readdirSync(regionLinksDir)
            .filter(f => f.endsWith('.json'))
            .map(f => path.join(regionLinksDir, f))
        : [])
    ];

    for (const file of targetFiles) {
      if (!fs.existsSync(file)) continue;
      try {
        const json = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (!Array.isArray(json.categories)) continue;

        let fileModified = false;
        for (const item of added) {
          let cat = json.categories.find(c => c.id === item.categoryId);
          if (!cat) continue;

          const alreadyInFile = cat.sites.some(s => normalize(s.url) === normalize(item.url));
          if (!alreadyInFile) {
            cat.sites.push({
              name: item.name,
              url: item.url,
              logo: item.logo,
              enabled: item.enabled,
              status: item.status
            });
            fileModified = true;
          }
        }

        if (fileModified) {
          fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
        }
      } catch (err) {
        console.error(`Error updating ${file}:`, err.message);
      }
    }

    fs.writeFileSync('discovered-links.json', JSON.stringify(added, null, 2) + '\n');
    console.log(`✨ Added ${added.length} new live links across public/links.json and Region-Links files!`);
  } else {
    console.log('ℹ️ No new live links found.');
  }
}

discover().catch(console.error);
