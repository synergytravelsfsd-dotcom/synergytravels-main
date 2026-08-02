#!/usr/bin/env node
/**
 * Explains why the live domain may still show the old Netlify site
 * even after Hostnext public_html is updated.
 */
import { execSync } from 'node:child_process';

const DOMAIN = 'synergytravelsandtour.com';
const WWW = `www.${DOMAIN}`;
const HOSTNEXT_IP = '5.9.80.16';
const NETLIFY_IP = '75.2.60.5';

function dig(q, type = 'A') {
  try {
    return execSync(`dig +short ${q} ${type}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function fetchHeaders(url) {
  try {
    return execSync(`curl -sI ${JSON.stringify(url)}`, { encoding: 'utf8' });
  } catch (e) {
    return String(e.stdout || e.message || e);
  }
}

const apexA = dig(DOMAIN, 'A');
const wwwCname = dig(WWW, 'CNAME');
const wwwA = dig(WWW, 'A');
const ns = dig(DOMAIN, 'NS');

console.log('DNS check for', DOMAIN);
console.log('  NS:         ', ns.join(', ') || '(none)');
console.log('  @ A:        ', apexA.join(', ') || '(none)');
console.log('  www CNAME:  ', wwwCname.join(', ') || '(none)');
console.log('  www A:      ', wwwA.join(', ') || '(none)');
console.log('');

const pointingNetlify =
  apexA.includes(NETLIFY_IP) ||
  wwwCname.some((c) => c.includes('netlify')) ||
  wwwA.includes(NETLIFY_IP);

const pointingHostnext = apexA.includes(HOSTNEXT_IP) && !pointingNetlify;

if (pointingNetlify) {
  console.log('❌ Domain DNS still points to Netlify — visitors see the OLD site.');
  console.log('   Hostnext already has the NEW site at', HOSTNEXT_IP);
  console.log('');
  console.log('Fix in Hostnext DNS zone editor:');
  console.log(`  1) Delete A record:     @   → ${NETLIFY_IP} (Netlify)`);
  console.log('  2) Delete CNAME record: www → synergytravel1.netlify.app');
  console.log(`  3) Add A record:        @   → ${HOSTNEXT_IP}`);
  console.log(`  4) Add A record:        www → ${HOSTNEXT_IP}`);
  console.log('  5) Save & wait 5–60 minutes, then hard-refresh.');
} else if (pointingHostnext) {
  console.log('✓ DNS points to Hostnext', HOSTNEXT_IP);
} else {
  console.log('? DNS does not match expected Netlify or Hostnext IPs. Review panel records.');
}

console.log('');
const headers = fetchHeaders(`https://${WWW}/`);
const server = (headers.match(/^server:\s*(.+)$/im) || [])[1] || 'unknown';
console.log('Live https://' + WWW + ' server:', server.trim());
if (/netlify/i.test(headers)) {
  console.log('Still serving from Netlify until DNS above is updated.');
}
