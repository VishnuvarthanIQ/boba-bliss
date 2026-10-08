const https = require('https');
https.get('https://unsplash.com/s/photos/coffee-shop-counter', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
      matches.push(match[1]);
    }
    const unique = [...new Set(matches)];
    console.log('IDs:', unique.slice(0, 5));
  });
});
