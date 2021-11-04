import {Buffer} from 'buffer';
import path from 'path';
import {writeFile} from 'fs/promises';

function shuffleArrayBuffer(arrayBuffer) {
	for(let i = arrayBuffer.length-4; i>=0; i=i-4) {
		//const j = Math.floor(Math.random() * (i + 4));
		const r = Math.random() * (i + 4);
		const j = r-r%4;
		//[array[i], array[j]] = [array[j], array[i]];
		let tmp = arrayBuffer.readUInt32BE(i);
		arrayBuffer.writeUInt32BE(arrayBuffer.readUInt32BE(j), i);
		arrayBuffer.writeUInt32BE(tmp, j);
	}
}

function fillArrayBuffer(arrayBuffer) {
	for(let i = arrayBuffer.length-4, j=arrayBuffer.length/4-1; i>=0; i=i-4, j--) {
		arrayBuffer.writeUInt32BE(j, i);
	}
}

const args = process.argv.slice(2);

const count = args[0]*1 || 10_000_000;

const buffer = Buffer.allocUnsafe(count * 4);

fillArrayBuffer(buffer);

shuffleArrayBuffer(buffer);

//console.log(buffer)

await writeFile(path.resolve() + '/../server/tmp/entries.index', buffer);
