import path from 'path';
import {writeFile, readFile} from 'fs/promises';

let input = await readFile(path.resolve() + '/names_table.jsonl', {encoding:'utf8'});

input = input.split(/\r?\n/);

let count = 0;
let index = 0;
let lastNames = [];

while(count<1000) {
	let data = JSON.parse(input[index]);
	index++;
	if(data.gender === 'm') {
		count++;
		lastNames.push(data.text);
	}
}

//console.log(lastNames[lastNames.length-1]);

let txt = lastNames.join('\r\n');

await writeFile(path.resolve() + '/../server/content/ru.first.name.txt', txt);
