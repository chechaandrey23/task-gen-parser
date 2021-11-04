import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

/*
 * 10 000 uniqul last name
 */
const urls = [
	'https://ru.wiktionary.org/wiki/%D0%9F%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5:%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D1%87%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%84%D0%B0%D0%BC%D0%B8%D0%BB%D0%B8%D0%B9_%D0%A1%D0%A8%D0%90:_%D0%9F%D0%B5%D1%80%D0%B5%D0%BF%D0%B8%D1%81%D1%8C_2000_1%E2%80%941000',
	'https://ru.wiktionary.org/wiki/%D0%9F%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5:%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D1%87%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%84%D0%B0%D0%BC%D0%B8%D0%BB%D0%B8%D0%B9_%D0%A1%D0%A8%D0%90:_%D0%9F%D0%B5%D1%80%D0%B5%D0%BF%D0%B8%D1%81%D1%8C_2000_1001%E2%80%942000',
	'https://ru.wiktionary.org/wiki/%D0%9F%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5:%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D1%87%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%84%D0%B0%D0%BC%D0%B8%D0%BB%D0%B8%D0%B9_%D0%A1%D0%A8%D0%90:_%D0%9F%D0%B5%D1%80%D0%B5%D0%BF%D0%B8%D1%81%D1%8C_2000_2001%E2%80%946000', 'https://ru.wiktionary.org/wiki/%D0%9F%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5:%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D1%87%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%84%D0%B0%D0%BC%D0%B8%D0%BB%D0%B8%D0%B9_%D0%A1%D0%A8%D0%90:_%D0%9F%D0%B5%D1%80%D0%B5%D0%BF%D0%B8%D1%81%D1%8C_2000_6001%E2%80%9410000'
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
	// <li><a href="/wiki/Johnson" title="Johnson">Johnson</a></li>
	const re = /\<li[^\>]*\>\s*\<a\s*href\s*=\s*\"(?:\/wiki\/\w+|\/w\/[^\"]*)\"[^\>]*\>\s*(\w+)\s*\<\/a[^\>]*\>\s*\<\/li[^\>]*\>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

let txt = lastNames.join('\r\n');

await writeFile(path.resolve() + '/../server/content/us.last.name.txt', txt);
