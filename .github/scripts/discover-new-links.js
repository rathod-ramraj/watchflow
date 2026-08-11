const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { isWhitelisted } = require('./skip-list');

const REQUEST_TIMEOUT = 8000;
const CONCURRENCY = 6;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const FMHY_DOCS = [
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/video.md', defaultCat: 'movies_shows' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/downloading.md', defaultCat: 'downloads' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/torrenting.md', defaultCat: 'torrents' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/reading.md', defaultCat: 'manga' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/mobile.md', defaultCat: 'apps' },
  { url: 'https://raw.githubusercontent.com/fmhy/edit/refs/heads/main/docs/non-english.md', defaultCat: 'movies_shows' }
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

async function discover() {
  console.log('🔍 Discovering new links from FMHY docs…');
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
          let match;
          while ((match = linkRe.exec(body)) !== null) {
            const name = match[1].trim();
            const rawUrl = match[2].trim();
            const root = siteRoot(rawUrl);
            if (!root || /^\d+$/.test(name) || /^(mirror|backup|alt)$/i.test(name)) continue;

            const norm = normalize(root);
            if (existingUrls.has(norm) || isWhitelisted(root)) continue;
            existingUrls.add(norm);

            candidates.push({
              name,
              url: root,
              category: doc.defaultCat
            });
          }
          resolve();
        });
      });
    });
  }

  console.log(` Found ${candidates.length} new potential link candidates. Testing vitality…`);
  const added = [];

  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (cand) => {
      if (await isAlive(cand.url)) {
        const slug = slugify(cand.name);
        const newItem = {
          name: cand.name,
          url: cand.url,
          logo: `./logo/${cand.category}/${slug}.png`,
          enabled: true,
          status: 'new'
        };
        added.push({ ...newItem, categoryId: cand.category });
        console.log(`   ✓ Found new live link: [${cand.name}] (${cand.url})`);
      }
    }));
  }

  if (added.length > 0) {
    const mainLinksPath = path.join(process.cwd(), 'public', 'links.json');
    const mainLinks = JSON.parse(fs.readFileSync(mainLinksPath, 'utf8'));

    for (const item of added) {
      let cat = mainLinks.categories.find(c => c.id === item.categoryId);
      if (!cat) cat = mainLinks.categories[0];
      cat.sites.push({
        name: item.name,
        url: item.url,
        logo: item.logo,
        enabled: item.enabled,
        status: item.status
      });
    }

    fs.writeFileSync(mainLinksPath, JSON.stringify(mainLinks, null, 2) + '\n');
    fs.writeFileSync('discovered-links.json', JSON.stringify(added, null, 2) + '\n');
    console.log(`✨ Added ${added.length} new live links to public/links.json!`);
  } else {
    console.log('ℹ️ No new live links found.');
  }
}

discover().catch(console.error);
