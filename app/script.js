const https = require('https');

https.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.txt', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('druidic feathers')) {
        console.log(lines[i-1]);
        console.log(lines[i]);
        console.log(lines[i+1]);
      }
    }
  });
});
