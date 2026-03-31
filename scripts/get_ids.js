const https = require('https');
https.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json', (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', () => {
        const items = JSON.parse(data);
        const t4Items = items.filter(i => i.UniqueName.startsWith('T4_') && 
            (i.UniqueName.includes('CROSSBOW') || i.UniqueName.includes('FIRE') || i.UniqueName.includes('KNUCKLES') || i.UniqueName.includes('SHAPESHIFTER') || i.UniqueName.includes('OFF_') || i.UniqueName.includes('CAPE')));
        console.log(JSON.stringify(t4Items.map(i => ({ id: i.UniqueName, name: i.LocalizedNames ? i.LocalizedNames['PT-BR'] : i.UniqueName })).slice(0,100), null, 2));
    });
});
