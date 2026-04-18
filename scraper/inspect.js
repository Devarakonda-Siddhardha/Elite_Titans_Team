const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
  const url = `https://cricheroes.com/team-profile/6955664/elite-titans/matches`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  const data = await page.evaluate(() => {
    const out = {};
    const nextData = document.getElementById('__NEXT_DATA__');
    if (nextData) out.__NEXT_DATA__ = JSON.parse(nextData.textContent);
    const scripts = [...document.querySelectorAll('script')].map(s => ({
      id: s.id, type: s.type, src: s.src, length: s.textContent.length
    }));
    out.scripts = scripts.slice(0, 30);
    return out;
  });

  const fs = require('fs');
  fs.writeFileSync('inspect.json', JSON.stringify(data, null, 2));
  console.log('scripts count:', data.scripts.length);
  console.log('has __NEXT_DATA__:', !!data.__NEXT_DATA__);
  if (data.__NEXT_DATA__) {
    console.log('next data keys:', Object.keys(data.__NEXT_DATA__));
    console.log('pageProps keys:', data.__NEXT_DATA__.props ? Object.keys(data.__NEXT_DATA__.props.pageProps || {}) : null);
  }
  await browser.close();
})();
