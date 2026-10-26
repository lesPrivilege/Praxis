import {readFile,writeFile} from 'node:fs/promises';
const model=await readFile(new URL('./model.mjs',import.meta.url),'utf8');
const page=await readFile(new URL('./page.html',import.meta.url),'utf8');
await writeFile(new URL('../index.html',import.meta.url),page.replace('/*__MODEL__*/',model.replace(/^export /gm,'')));
console.log('Built self-contained index.html');
