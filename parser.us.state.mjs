import http from 'http';
import https from 'https';
import path from 'path';
import {writeFile} from 'fs/promises';

const urls = [
	'https://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_population'
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
	 * <td style="text-align:left"><span class="flagicon"><img alt="" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Puerto_Rico.svg/23px-Flag_of_Puerto_Rico.svg.png" decoding="async" width="23" height="15" class="thumbborder" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Puerto_Rico.svg/35px-Flag_of_Puerto_Rico.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Puerto_Rico.svg/45px-Flag_of_Puerto_Rico.svg.png 2x" data-file-width="900" data-file-height="600">&nbsp;</span><a href="/wiki/Puerto_Rico" title="Puerto Rico">Puerto Rico</a>
</td>
	 */
	const re = /\<a\s*href\s*=\s*\"\/wiki\/[\s\w_)(\.]+\"[^\>]*\>\s*([\s\w]+)\s*\<\/a[^\>]*\>\s*\<\/td[^\>]*\>/igm;
	let res = null;
	
	while(res = re.exec(data)) {
		accamulator.push(res[1]);
	}
	
	return accamulator;
}, []);

let txt = state.join('\r\n');

await writeFile(path.resolve() + '/../server/content/us.state.txt', txt);
