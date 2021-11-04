import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'https://geographic.org/streetview/usa/ny/new_york.html'
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

let street = datas.reduce((accamulator, data) => {
	// <li><a href="https://geographic.org/streetview/view.php?place=Trans-manhattan Expy, New York, ny, USA">Trans-manhattan Expy</a></li>
	const re = /\<li[^\>]*\>\s*\<a[^\>]*\>\s*([\w\s-\.]+)\s*\<\/a[^\>]*\>\s*\<\/li[^\>]*\>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

let txt = street.join('\r\n');

console.log(street, street.length);

await writeFile(path.resolve() + '/../server/content/us.street.txt', txt);
