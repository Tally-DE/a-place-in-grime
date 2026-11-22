import './build.mjs';
const { default: worker } = await import('./dist/server/index.js');
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile, link, unlink, readdir, rename } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { randomUUID, createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const receipts = process.env.APIG_LOCAL_DATA_DIR ? pathToFileURL(path.resolve(process.env.APIG_LOCAL_DATA_DIR) + path.sep) : new URL('./.local/', import.meta.url);
await mkdir(receipts, {recursive:true});
const env = {
  DONATION_URL: process.env.DONATION_URL,
  REVIEW_KEY: process.env.REVIEW_KEY,
  BUCKET: {
    async get(key) {
      const file = new URL(key.replace('intake/', 'intake-'), receipts);
      try { const body = await readFile(file, 'utf8'); return {json: () => JSON.parse(body),etag:createHash('sha256').update(body).digest('hex')}; }
      catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    },
    async list({prefix,limit,cursor}) {
      const keys=(await readdir(receipts)).map(k=>k.replace(/^intake-/, 'intake/')).filter(k=>k.startsWith(prefix)&&k.endsWith('.json')&&(!cursor||k>cursor)).sort();
      const page=keys.slice(0,limit);
      return {objects:page.map(key=>({key})),truncated:keys.length>limit,cursor:page.at(-1)};
    },
    async put(key, value, options) {
      const file = new URL(key.replace('intake/', 'intake-'), receipts);
      const temp = new URL(randomUUID()+'.tmp', receipts);
      if(options?.onlyIf?.etagMatches) {
        const lock=new URL(file.href+'.lock');
        try {await writeFile(lock,'',{flag:'wx'});} catch(error){if(error.code==='EEXIST')return null;throw error;}
        try {
          if((await this.get(key))?.etag!==options.onlyIf.etagMatches)return null;
          await writeFile(temp,value);await rename(temp,file);return {key};
        } finally {await unlink(lock);}
      }
      await writeFile(temp,value,{flag:'wx'});
      try { await link(temp,file); return {key}; }
      catch (error) { if (error.code === 'EEXIST') return null; throw error; }
      finally { await unlink(temp); }
    }
  }
};
const port = Number(process.env.PORT || 4173);
createServer(async (incoming,out) => {
  try {
    const url = new URL(incoming.url, 'http://127.0.0.1:'+port);
    const init = {method:incoming.method,headers:incoming.headers};
    if (!['GET','HEAD'].includes(incoming.method)) Object.assign(init,{body:Readable.toWeb(incoming),duplex:'half'});
    const response = await worker.fetch(new Request(url,init),env);
    out.writeHead(response.status,Object.fromEntries(response.headers));
    out.end(Buffer.from(await response.arrayBuffer()));
  } catch { out.writeHead(500); out.end('Unable to complete this request.'); }
}).listen(port,'127.0.0.1',()=>console.log('A Place In Grime on http://127.0.0.1:'+port));
