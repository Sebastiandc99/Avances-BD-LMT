import {spawnSync} from 'node:child_process';
const mode=process.argv[2]||'build';
const run=args=>{
 const r=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,LMT_DEPLOY_TARGET:'cloudflare'}});
 if(r.error)throw r.error;
 if(r.status!==0)process.exit(r.status??1);
};
const build=()=>run(['node_modules/vite/bin/vite.js','build','--config','vite.pages.config.ts']);
const verify=()=>run(['scripts/verify-pages.mjs']);
if(mode==='build')build();
else if(mode==='verify')verify();
else if(mode==='deploy'){
 build();verify();
 run(['node_modules/wrangler/bin/wrangler.js','pages','deploy','cloudflare-dist','--config','wrangler.pages.jsonc','--project-name','avances-lmt-seba','--branch','main']);
}else throw Error('Acción de Cloudflare no válida: '+mode);
