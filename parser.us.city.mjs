import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'https://www.britannica.com/topic/list-of-cities-and-towns-in-the-United-States-2023068'
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
	// <li><div><a href="https://www.britannica.com/place/Bismarck-North-Dakota" class="md-crosslink">Bismarck</a></div></li>
	const re = /\<li[^\>]*\>\s*\<div[^\>]*\>\s*\<a[^\>]*\>\s*([\w\s\.]+)\s*\<\/a[^\>]*\>\s*\<\/div[^\>]*\>\s*\<\/li[^\>]*\>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

let txt = city.join('\r\n');

console.log(city, city.length);

await writeFile(path.resolve() + '/../server/content/us.city.txt', txt);
