import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve('pages-dist'),base='/Avances-BD-LMT/';
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
assert.ok(html.includes(base+'assets/'),'Los recursos deben usar el subdirectorio del repositorio.');
const resources=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
for(const resource of resources){if(resource.startsWith(base))assert.ok(fs.existsSync(path.join(out,resource.slice(base.length))),'Falta '+resource);}
const data=JSON.parse(fs.readFileSync(path.join(out,'assets/inventory.json'),'utf8'));
assert.equal(data.piquetes.length,237);assert.equal(data.vanos.length,235);
assert.equal(data.vanos.reduce((sum,s)=>sum+s.bd_propuestos_pendientes_validacion,0),1743);
const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.webmanifest'),'utf8'));
assert.equal(manifest.start_url,base);assert.equal(manifest.scope,base);
assert.ok(fs.existsSync(path.join(out,'sw.js')));
const background=fs.readFileSync(path.join(out,'assets/fondo-esquematico.svg'),'utf8');
assert.ok(!background.includes('base64')&&!background.includes('<image'));
console.log('GitHub Pages: recursos, ruta, inventario, fondo y manifiesto verificados.');
