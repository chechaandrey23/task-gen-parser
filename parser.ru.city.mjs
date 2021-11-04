import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%BE%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8'
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
	const re = /<tr[^\>]*>\s*<td[^\>]*>[^\<]*<\/td[^\>]*>\s*<td[^\>]*>\s*<a[^\>]*>\s*<img[^\>]*>\s*<\/a[^\>]*>\s*<\/td[^\>]*>\s*<td[^\>]*>\s*<a[^\>]*>\s*([а-яА-ЯёЁ-]+)\s*<\/a[^\>]*>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

let txt = city.join('\r\n');

//console.log(city, city.length);

await writeFile(path.resolve() + '/../server/content/ru.city.txt', txt);
