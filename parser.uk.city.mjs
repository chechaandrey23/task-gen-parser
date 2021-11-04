import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'https://uk.wikipedia.org/wiki/%D0%9C%D1%96%D1%81%D1%82%D0%B0_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8_(%D0%B7%D0%B0_%D0%B0%D0%BB%D1%84%D0%B0%D0%B2%D1%96%D1%82%D0%BE%D0%BC)'
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

let city = datas.reduce((accamulator, data) => {
	// <td><a href="/wiki/%D0%94%D0%BE%D0%B2%D0%B6%D0%B0%D0%BD%D1%81%D1%8C%D0%BA" title="Довжанськ">Довжанськ</a>
	const re = /<td[^\>]*>\s*<a[^\>]*>\s*([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]+)\s*<\/a[^\>]*>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

let txt = city.join('\r\n');

//console.log(city, city.length);

await writeFile(path.resolve() + '/../server/content/uk.city.txt', txt);
