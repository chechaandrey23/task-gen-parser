import parse from 'csv-parse'
import path from 'path';
import {writeFile, readFile} from 'fs/promises';

let input = await readFile(path.resolve() + '/moskow.csv');

parse(input, {
	comment: '#'
}, async function(err, output){
	let data = output.filter((value, index) => index!==0).map((value) => {
		return value[3];
	});
	
	//console.log(data[0]);
	
	let txt = data.join('\r\n');
	
	await writeFile(path.resolve() + '/../server/content/ru.street.txt', txt);
})
