#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
execSync('node scripts/build-static.js', { cwd: root, stdio: 'inherit' });

console.log('🚀 Deploying to Cloudflare Pages (fmwsite)...');
execSync('npx -y wrangler pages deploy out --project-name=fmwsite --branch=main', { cwd: root, stdio: 'inherit' });
console.log('✅ Deployment complete: https://fmwsite.pages.dev/');
