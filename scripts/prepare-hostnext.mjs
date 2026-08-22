#!/usr/bin/env node
/**
 * Builds the site and packs a Hostnext-ready zip for File Manager upload
 * into public_html (synergytravelsandtour.com).
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
const outDir = join(root, 'hostnext-deploy');
const zipPath = join(root, 'hostnext-deploy.zip');

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

const readme = `Synergy Travels & Tour — Hostnext deploy zip
==========================================

Domain: https://synergytravelsandtour.com
Server IP: 5.9.80.16

EASIEST UPLOAD (zip)
1. Log in to Hostnext cPanel → File Manager
2. Open public_html
3. Upload hostnext-deploy.zip
4. Right-click the zip → Extract
5. If files land inside a "hostnext-deploy" folder, move EVERYTHING
   (index.html, assets/, .htaccess, …) up into public_html
6. Delete the empty folder + the zip
7. Confirm public_html/index.html and public_html/.htaccess exist
8. Hard-refresh https://synergytravelsandtour.com

TIP: In File Manager, enable “Show Hidden Files” so you can see .htaccess.

Do NOT upload nested under public_html/hostnext-deploy/
`;

writeFileSync(join(outDir, 'HOSTNEXT-UPLOAD.txt'), readme);

rmSync(zipPath, { force: true });
// Zip contents at root of archive (no wrapper folder) so extract dumps into public_html
execSync(`cd "${outDir}" && zip -r "${zipPath}" . -x "*.DS_Store" "HOSTNEXT-UPLOAD.txt"`, {
  stdio: 'inherit',
});

const index = readFileSync(join(outDir, 'index.html'), 'utf8');
if (!index.includes('synergytravelsandtour.com')) {
  console.warn('Warning: production domain not found in built index.html');
}

console.log('\n✓ Ready for Hostnext');
console.log(`  Folder: ${outDir}`);
console.log(`  Zip:    ${zipPath}`);
console.log('  Upload zip → public_html → Extract');
