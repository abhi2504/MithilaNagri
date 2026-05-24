import { chromium } from 'playwright';
const base = 'http://localhost:4399';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });

async function shootJourney(url, file, tabText) {
  await p.goto(base + url, { waitUntil: 'networkidle' });
  if (tabText) {
    await p.getByRole('tab', { name: tabText }).click();
    await p.waitForTimeout(500);
  }
  const rs = p.locator('.rs').first();
  await rs.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await rs.screenshot({ path: file });
  console.log('shot', file);
}

await shootJourney('/en/festivals/chhath/', 'public/_shot-ch-sandhya.png', /Sandhya Arghya/);
await shootJourney('/en/festivals/chhath/', 'public/_shot-ch-prasad.png', /The prasad/);
await shootJourney('/en/festivals/chhath/', 'public/_shot-ch-usha.png', /Usha Arghya/);
await shootJourney('/en/festivals/chhath/', 'public/_shot-ch-songs.png', /The songs/);
await b.close();
console.log('done');
