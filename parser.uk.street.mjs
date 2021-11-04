import parse from 'csv-parse'
import path from 'path';
import {writeFile, readFile} from 'fs/promises';

let input = await readFile(path.resolve() + '/Kyiv.csv');

parse(input, {
	comment: '#'
}, async function(err, output){
	let data = output.filter((value, index) => index!==0).map((value) => {
		let [,type, name] = value;
		if(type.startsWith('Про') || type.startsWith('Пло')) {
			type = type.slice(0, 4).toLowerCase()+'.';
		} else {
			type = type.slice(0, 3).toLowerCase()+'.';
		}
		return type+' '+name;
	});
	
	//console.log(data[0]);
	
	let txt = data.join('\r\n');
	
	await writeFile(path.resolve() + '/../server/content/uk.street.txt', txt);
})
