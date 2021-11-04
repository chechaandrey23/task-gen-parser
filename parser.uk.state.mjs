import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'https://uk.wikipedia.org/wiki/%D0%9E%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%96_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8'
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

let state = datas.reduce((accamulator, data) => {
	/*
	 * <b><a href="/wiki/%D0%92%D1%96%D0%BD%D0%BD%D0%B8%D1%86%D1%8C%D0%BA%D0%B0_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C" title="Вінницька область">Вінницька</a></b>
	 * 
	 */
	const re = /<li[^\>]*>\s*<b[^\>]*>\s*<a[^\>]*>\s*([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]+)\s*<\/a[^\>]*>\s*<\/b[^\>]*>/igm;
	let res = null;
	
	accamulator.push('Автономна Республіка Крим');
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]+' область');
	}
	
	return accamulator;
}, []);

let txt = state.join('\r\n');

await writeFile(path.resolve() + '/../server/content/uk.state.txt', txt);
