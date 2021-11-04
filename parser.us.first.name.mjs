import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';
import qs from 'qs';

const url = {path: '/cgi-bin/popularnames.cgi', hostname: 'www.ssa.gov', data: {
	year: 2020,
	top: 1000,
	submit: '  Go  '
}};

let promises = [url].map(({path, hostname, data}) => {
	return new Promise((resolve, reject) => {
		
		let postData = qs.stringify(data);
		
		let req = https.request({
			hostname,
			port: 443,
			path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(postData)
			}
		}, (res) => {
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
		req.write(postData);
		req.end();
	});
});

let datas = await Promise.all(promises);

let firstNames = datas.reduce((accamulator, data) => {
	// <tr align="right"><td>1</td> <td>Liam</td> <td>Olivia</td></tr>
	const re = /\<tr[^\>]*\>\s*\<td[^\>]*\>\s*\d+\s*\<\/td[^\>]*\>\s*\<td[^\>]*\>\s*(\w+)\s*\<\/td[^\>]*\>\s*\<td[^\>]*\>\s*(\w+)\s*\<\/td[^\>]*>\s*\<\/tr[^\>]*\>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1], res[2]);
	}
	
	return accamulator;
}, []);

firstNames = firstNames.slice(0, 1000);

let txt = firstNames.join('\r\n');

await writeFile(path.resolve() + '/../server/content/us.first.name.txt', txt);
