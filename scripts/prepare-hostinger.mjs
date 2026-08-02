#!/usr/bin/env node
/**
 * Builds the site and packs `dist/` for Hostinger File Manager / FTP upload
 * into public_html for www.synergytravelsandtour.com
 */
import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, 'dist');
const outDir = join(root, 'hostinger-deploy');

console.log('→ Building production bundle…');
execSync('npm run build', { cwd: root, stdio: 'inherit' });

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Build failed: dist/index.html missing');
  process.exit(1);
}

if (!existsSync(join(dist, '.htaccess'))) {
  console.warn('Warning: .htaccess missing from dist — copying from public/');
  copyFileSync(join(root, 'public', '.htaccess'), join(dist, '.htaccess'));
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

execSync(`cp -R "${dist}/." "${outDir}/"`, { stdio: 'inherit' });

const readme = `Synergy Travels & Tour — Hostinger upload pack
==============================================

Domain: https://www.synergytravelsandtour.com

1. In Hostinger hPanel → Domains → point www.synergytravelsandtour.com
   to this hosting account (A record / nameservers as Hostinger shows).
2. Enable free SSL (Let's Encrypt) for the domain.
3. Open File Manager → public_html
4. Delete default Hostinger placeholder files (index.html, etc.)
5. Upload EVERYTHING inside this folder into public_html
   (index.html, assets/, .htaccess, robots.txt, sitemap.xml, logo.png, …)
6. Visit https://www.synergytravelsandtour.com and hard-refresh.

Payments API (Stripe/PayPal) is optional and runs separately (Node).
Set VITE_PAYMENTS_API_URL if you host the API elsewhere.
`;

writeFileSync(join(outDir, 'HOSTINGER-UPLOAD.txt'), readme);

const zipPath = join(root, 'hostinger-deploy.zip');
rmSync(zipPath, { force: true });
execSync(`cd "${outDir}" && zip -r "${zipPath}" . -x "*.DS_Store"`, {
  stdio: 'inherit',
});

const index = readFileSync(join(outDir, 'index.html'), 'utf8');
if (!index.includes('synergytravelsandtour.com')) {
  console.warn('Warning: production domain not found in built index.html');
}

console.log('\n✓ Ready for Hostinger');
console.log(`  Folder: ${outDir}`);
console.log(`  Zip:    ${zipPath}`);
console.log('  Upload folder/zip contents → public_html');
