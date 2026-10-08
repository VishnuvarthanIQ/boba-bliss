const https = require('https');
const options = {
  hostname: 'www.pexels.com',
  path: '/search/boba%20tea/',
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /images\.pexels\.com\/photos\/(\d+)\/pexels-photo/g;
    const matches = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
      matches.push(match[1]);
    }
    const unique = [...new Set(matches)];
    console.log('Unique Boba IDs:', unique.slice(0, 5));
  });
});
