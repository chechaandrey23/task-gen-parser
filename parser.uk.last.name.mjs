import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

/*
 * 10 000 uniqul last name
 */
const urls = [
	'https://sites.google.com/site/uaname/popularnist-prizvis/misca-1---10000',
	'https://sites.google.com/site/uaname/popularnist-prizvis/misca-10001---20000',
	'https://sites.google.com/site/uaname/popularnist-prizvis/misca-20001---30000',
	'https://sites.google.com/site/uaname/popularnist-prizvis/misca-30001---40000',
	'https://sites.google.com/site/uaname/popularnist-prizvis/misca-40001---50000'
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

let lastNames = datas.reduce((accamulator, data) => {
	// <div><font face="'courier new', monospace">&nbsp;&nbsp;133| ЗАЄЦЬ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | &nbsp; 3998| &nbsp; &nbsp; 25987</font></div>
	const re = /<div[^\>]*>\s*<font[^\>]*>[^\||\d]*\d+\|\s*([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,})\s*[^\<]*<\/font[^\>]*>\s*<\/div[^\>]*>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		let name = res[1];
		name = name.toLowerCase();
		name = name.charAt(0).toUpperCase() + name.slice(1);
		accamulator.push(name);
	}
	
	const re1 = /<div[^\>]*>[^\||\d]*\d+\|\s*([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,})\s*[^\<]*<\/div[^\>]*>/igm;
	let res1 = null;
	
	while(res1 = re1.exec(data)) {
		let name = res1[1];
		name = name.toLowerCase();
		name = name.charAt(0).toUpperCase() + name.slice(1);
		accamulator.push(name);
	}
	
	return accamulator;
}, []);

//console.log(lastNames.length)

let txt = lastNames.join('\r\n');

await writeFile(path.resolve() + '/../server/content/uk.last.name.txt', txt);
