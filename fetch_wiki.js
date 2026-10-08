const https = require('https');
https.get('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=Bubble_tea&pithumbsize=1000&format=json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pages[pageId].thumbnail) {
      console.log('Wiki Image:', pages[pageId].thumbnail.source);
    }
  });
});
