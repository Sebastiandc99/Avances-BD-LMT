import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { inventoryRevision } from './lib/model';

const root=process.cwd();
const cloudflare=process.env.LMT_DEPLOY_TARGET==='cloudflare';
const base=cloudflare?'/':'/Avances-BD-LMT/';
const outputDir=cloudflare?'cloudflare-dist':'pages-dist';

function writeOfflineWorker(out:string) {
  const template=fs.readFileSync(path.join(root,'pages/sw.js'),'utf8');
  const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
  const assets=fs.readdirSync(path.join(out,'assets'),{recursive:true,withFileTypes:true})
    .filter(entry=>entry.isFile())
    .map(entry=>path.relative(out,path.join(entry.parentPath,entry.name)).split(path.sep).join('/'))
    .sort();
  const hash=createHash('sha256').update(template).update(html);
  const files=[...assets,'manifest.webmanifest'].map(file=>{
    const url=file==='assets/inventory.json' ? file+'?revision='+inventoryRevision : file;
    hash.update(url).update(fs.readFileSync(path.join(out,file)));
    return url;
  });
  const version=hash.digest('hex').slice(0,16);
  const entryAssets=assets.filter(file=>html.includes('"'+base+file+'"'));
  const worker=template.replace('/* BUILD_CONFIG */',()=>`const BUILD = ${JSON.stringify({version,files,entryAssets})};`);
  fs.writeFileSync(path.join(out,'sw.js'),worker);
}

export default defineConfig({
  root:path.join(root,'pages'),
  base,
  publicDir:path.join(root,'public'),
  css:{postcss:root},
  plugins:[react(),{
    name:'lmt-pages-offline',
    closeBundle(){
      const out=path.join(root,outputDir);
      const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/manifest.webmanifest'),'utf8'));
      fs.writeFileSync(path.join(out,'manifest.webmanifest'),JSON.stringify({...manifest,id:base,start_url:base,scope:base})+'\n');
      writeOfflineWorker(out);
      fs.writeFileSync(path.join(out,'.nojekyll'),'');
    },
  }],
  build:{outDir:path.join(root,outputDir),emptyOutDir:true},
});
