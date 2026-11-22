import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
await mkdir(path.join(dist, 'server'), { recursive: true });
const assets = {};
async function collect(folder, prefix) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const key = prefix + '/' + entry.name;
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await collect(file, key);
    else assets[key] = (await readFile(file)).toString('base64');
  }
}
await collect(path.join(root, 'public'), '');
const sourceData = new URL('../catalogue.json', import.meta.url);
const data = JSON.parse(await readFile(existsSync(sourceData) ? sourceData : path.join(root, 'catalogue.json'), 'utf8'));
const source = await readFile(path.join(root, 'worker.mjs'), 'utf8');
await writeFile(path.join(dist, 'server/index.js'), 'const catalogue = ' + JSON.stringify(data) + ';\nconst assets = ' + JSON.stringify(assets) + ';\n' + source);
try {
  await mkdir(path.join(dist, '.openai'), {recursive:true});
  await copyFile(path.join(root,'.openai/hosting.json'), path.join(dist,'.openai/hosting.json'));
} catch (error) { if (error.code !== 'ENOENT') throw error; }
