import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const base='/Avances-BD-LMT/';
export default defineConfig({
  root:path.join(root,'pages'),
  base,
  publicDir:path.join(root,'public'),
  css:{postcss:root},
  plugins:[react(),{
    name:'lmt-pages-offline',
    closeBundle(){
      const out=path.join(root,'pages-dist');
      fs.copyFileSync(path.join(root,'pages/sw.js'),path.join(out,'sw.js'));
      const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/manifest.webmanifest'),'utf8'));
      fs.writeFileSync(path.join(out,'manifest.webmanifest'),JSON.stringify({...manifest,id:base,start_url:base,scope:base})+'\n');
      fs.writeFileSync(path.join(out,'.nojekyll'),'');
    },
  }],
  build:{outDir:path.join(root,'pages-dist'),emptyOutDir:true},
});
