import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'http://deputat.club/subjects'
];

let promises = urls.map((url) => {
	return new Promise((resolve, reject) => {
		let req = http.request(new URL(url), {method: 'GET'}, (res) => {
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
	 * <li class="views-row views-row-4"><a href="/bu">\s*([а-яА-ЯёЁ]+)\s*</a> </li>
	 * <a href="/khm">Ханты-Мансийский автономный округ – Югра</a>
	 */
	const re = /<li[^\>]*>\s*<a[^\>]*>\s*([а-яА-ЯёЁ\s-–()]+)\s*<\/a[^\>]*>\s*<\/li[^\>]*>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

state = state.filter((value, index) => {
	return index > 10;
}).filter((value) => {
	return !/^Город/igm.test(value);
}).filter((value) => {
	return !/крым/igm.test(value);
}).map((value) => {
	return value.split(/\–|\(/)[0];
}).map((value) => {
	return value.trim();
});

//console.log(state, state.length);

let txt = state.join('\r\n');

await writeFile(path.resolve() + '/../server/content/ru.state.txt', txt);
