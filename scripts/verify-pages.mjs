import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const cloudflare=process.env.LMT_DEPLOY_TARGET==='cloudflare';
const out=path.resolve(cloudflare?'cloudflare-dist':'pages-dist'),base=cloudflare?'/':'/Avances-BD-LMT/';
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
assert.ok(html.includes(base+'assets/'),'Los recursos deben usar la ruta de publicación elegida.');
const resources=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
for(const resource of resources){if(resource.startsWith(base))assert.ok(fs.existsSync(path.join(out,resource.slice(base.length))),'Falta '+resource);}
const data=JSON.parse(fs.readFileSync(path.join(out,'assets/inventory.json'),'utf8'));
assert.equal(data.piquetes.length,237);assert.equal(data.vanos.length,235);
assert.equal(data.vanos.reduce((sum,s)=>sum+s.bd_segun_planilla,0),1871);
const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.webmanifest'),'utf8'));
assert.equal(manifest.start_url,base);assert.equal(manifest.scope,base);
assert.ok(fs.existsSync(path.join(out,'sw.js')));
assert.ok(fs.readFileSync(path.join(out,'recuperar.html'),'utf8').includes('Recuperar aplicación'));
assert.ok(html.includes(base+'recuperar.html'),'Debe poder recuperarse un arranque incompleto.');
const hero=fs.readFileSync(path.join(out,'assets/obra-lmt.jpg'));
assert.ok(hero.length>10000&&hero[0]===0xff&&hero[1]===0xd8,'Debe publicarse la fotografía JPEG de obra.');
const worker=fs.readFileSync(path.join(out,'sw.js'),'utf8');
const build=JSON.parse(worker.match(/^const BUILD = (.+);$/m)[1]);
const cached=new Set(build.files.map(file=>base+file));
for(const url of [...resources.filter(url=>!url.endsWith('recuperar.html')),base+'assets/fondo-esquematico.svg',base+'assets/obra-lmt.jpg']){
  assert.ok(cached.has(url),'Recurso ausente del arranque sin conexión: '+url);
}
assert.ok([...cached].some(url=>url.startsWith(base+'assets/inventory.json?revision=')));
for(const url of cached)assert.ok(fs.statSync(path.join(out,url.slice(base.length).split('?')[0])).isFile());
assert.deepEqual(build.entryAssets.sort(),resources.filter(url=>/\.(js|css)$/.test(url)).map(url=>url.slice(base.length)).sort());
const background=fs.readFileSync(path.join(out,'assets/fondo-esquematico.svg'),'utf8');
assert.ok(!background.includes('base64')&&!background.includes('<image'));
if(cloudflare)assert.ok(!html.includes('/Avances-BD-LMT/'),'Cloudflare debe publicar en la raíz.');
console.log((cloudflare?'Cloudflare':'GitHub Pages')+': recursos, ruta, inventario, fondo y manifiesto verificados.');
