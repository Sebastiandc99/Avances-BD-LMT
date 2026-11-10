import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const blocked=/\.(pdf|dwg|dxf|zip|7z|rar)$/i;
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const history=execFileSync('git',['rev-list','--objects','--all'],{encoding:'utf8'}).split('\n').map(line=>line.slice(41)).filter(Boolean);
const forbidden=[...new Set([...tracked,...history].filter(name=>blocked.test(name)))];
const embedded=[];
for(const name of tracked){
  const bytes=fs.readFileSync(name);
  if(bytes.subarray(0,5).toString()==='%PDF-'){embedded.push(name);continue;}
  const text=bytes.toString('utf8');
  if(/data:application\/pdf;base64,[A-Za-z0-9+/=]{40,}/i.test(text))embedded.push(name);
}
if(forbidden.length||embedded.length){
  console.error('Publicación detenida: documentos originales o PDF incrustado detectados.',{forbidden,embedded});
  process.exit(1);
}
console.log('Privacidad verificada: sin PDF, DWG/DXF ni archivos comprimidos en archivos versionados e historial disponible; sin PDF incrustado.');
