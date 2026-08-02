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

const readme = `Synergy Travels & Tour — Hostnext upload pack
===========================================

Domain: https://www.synergytravelsandtour.com
Hosting IP (confirmed): 5.9.80.16

UPLOAD (if not done)
1. File Manager → public_html
2. Upload EVERYTHING in this folder (index.html, assets/, .htaccess, …)
   NOT inside a nested hostinger-deploy folder.

CRITICAL — DNS (this is why the old site still shows)
Nameservers are already ns1/ns2.hostnext.net, but records still point to Netlify.

In Hostnext → Domains → DNS Zone Editor for synergytravelsandtour.com:

  DELETE:
    A      @     75.2.60.5
    CNAME  www   synergytravel1.netlify.app

  ADD / SET:
    A      @     5.9.80.16
    A      www   5.9.80.16

Save, wait for DNS, then open https://www.synergytravelsandtour.com
(hard refresh). New site is already on the Hostnext server.

Verify anytime: npm run check:dns
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
