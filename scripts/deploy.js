#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'src', 'app', 'api');
const apiBak = path.join(root, 'src', 'api.bak');
const adminDir = path.join(root, 'src', 'app', 'admin-panel');
const adminBak = path.join(root, 'src', 'admin-panel.bak');
const nextConfig = path.join(root, 'next.config.mjs');
const nextConfigOrig = fs.readFileSync(nextConfig, 'utf8');

let apiMoved = false;
let adminMoved = false;

function restore() {
  if (apiMoved && fs.existsSync(apiBak)) {
    fs.renameSync(apiBak, apiDir);
    apiMoved = false;
  }
  if (adminMoved && fs.existsSync(adminBak)) {
    fs.renameSync(adminBak, adminDir);
    adminMoved = false;
  }
  fs.writeFileSync(nextConfig, nextConfigOrig, 'utf8');
}

process.on('SIGINT', () => {
  restore();
  process.exit(1);
});
process.on('SIGTERM', () => {
  restore();
  process.exit(1);
});

try {
  console.log('📦 Preparing static export build for Cloudflare Pages...');

  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiBak);
    apiMoved = true;
  }
  if (fs.existsSync(adminDir)) {
    fs.renameSync(adminDir, adminBak);
    adminMoved = true;
  }

  const exportConfig = nextConfigOrig.replace(
    /const nextConfig = \{/,
    "const nextConfig = {\n  output: 'export',"
  );
  fs.writeFileSync(nextConfig, exportConfig, 'utf8');

  console.log('⚡ Running next build...');
  execSync('npx next build', { cwd: root, stdio: 'inherit' });

  const redirectsPath = path.join(root, 'out', '_redirects');
  fs.writeFileSync(redirectsPath, '/index.html / 301\n/about.html /about 301\n/dmca.html /dmca 301\n', 'utf8');
} finally {
  console.log('🔄 Restoring project files...');
  restore();
}

console.log('🚀 Deploying to Cloudflare Pages (fmwsite)...');
execSync('npx -y wrangler pages deploy out --project-name=fmwsite --branch=main', { cwd: root, stdio: 'inherit' });
console.log('✅ Deployment complete: https://fmwsite.pages.dev/');
