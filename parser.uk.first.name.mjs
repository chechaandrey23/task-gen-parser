import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

/*
 * 10 000 uniqul last name
 */
const urls = [
	'https://sites.google.com/site/uaname/popularnist-imen'
];

let promises = urls.map((url) => {
	return new Promise((resolve, reject) => {
		let req = https.request(new URL(url), {method: 'GET'}, (res) => {
			res.setEncoding('utf8');
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				resolve(data);
			});
		});
		req.on('error', (e) => {
			reject(e);
		});
		req.end();
	});
});

let datas = await Promise.all(promises);

let firstNames = datas.reduce((accamulator, data) => {
	// <div><font face="'courier new', monospace">&nbsp;&nbsp;133| ЗАЄЦЬ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | &nbsp; 3998| &nbsp; &nbsp; 25987</font></div>
	const re = /<div[^\>]*>\s*<font[^\>]*>[^\||\d]*\d+\|\s*([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,})\s*[^\<]*<\/font[^\>]*>\s*<\/div[^\>]*>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		let name = res[1];
		name = name.toLowerCase();
		name = name.charAt(0).toUpperCase() + name.slice(1);
		accamulator.push(name);
	}
	
	return accamulator;
}, []);

//console.log(firstNames)

let txt = firstNames.join('\r\n');

await writeFile(path.resolve() + '/../server/content/uk.first.name.txt', txt);
