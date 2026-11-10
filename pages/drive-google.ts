import { DRIVE_FOLDER_ID, DriveRequestError, verifyDriveFolder } from '../lib/drive-backup';
export type DriveConfig={clientId:string;apiKey:string;projectNumber:string};
const scope='https://www.googleapis.com/auth/drive.file';
type TokenResponse={access_token?:string;expires_in?:number;scope?:string;error?:string;error_description?:string};
interface View{setFileIds(id:string):View;setIncludeFolders(value:boolean):View;setSelectFolderEnabled(value:boolean):View;setMimeTypes(value:string):View;}
interface Picker{setVisible(value:boolean):void;}
interface Builder{setDeveloperKey(key:string):Builder;setAppId(id:string):Builder;setOAuthToken(token:string):Builder;setOrigin(origin:string):Builder;setTitle(title:string):Builder;addView(view:View):Builder;setCallback(callback:(data:{action:string;docs?:{id:string}[]})=>void):Builder;build():Picker;}
interface GoogleSdk{accounts:{oauth2:{initTokenClient(config:{client_id:string;scope:string;callback:(result:TokenResponse)=>void;error_callback:(error:{type:string})=>void}):{requestAccessToken(options:{prompt:string}):void};hasGrantedAllScopes(response:TokenResponse,...scope:string[]):boolean;}};picker:{DocsView:new(id:string)=>View;ViewId:{FOLDERS:string};PickerBuilder:new()=>Builder;Action:{PICKED:string;CANCEL:string};};}
declare global{interface Window{google?:GoogleSdk;gapi?:{load(name:string,options:{callback:()=>void;onerror:()=>void;timeout:number;ontimeout:()=>void}):void};}}
let sdk:Promise<void>|null=null,token='',expiry=0,tokenOwner='',tokenClient='';
function script(id:string,url:string){return new Promise<void>((resolve,reject)=>{const el=document.createElement('script');el.id=id;el.src=url;el.async=true;el.onload=()=>resolve();el.onerror=()=>{el.remove();reject(Error('No se pudo conectar con los servicios de Google.'));};document.head.appendChild(el);});}
export function loadDriveSdk(){
 if(!sdk)sdk=Promise.all([script('lmt-google-identity','https://accounts.google.com/gsi/client'),script('lmt-google-api','https://apis.google.com/js/api.js')]).then(()=>new Promise<void>((resolve,reject)=>window.gapi!.load('picker',{callback:resolve,onerror:()=>reject(Error('No se pudo abrir la autorización de carpeta.')),timeout:20000,ontimeout:()=>reject(Error('Google tardó demasiado en responder.'))}))).catch(e=>{sdk=null;throw e;});
 return sdk;
}
export function resetDriveToken(){token='';expiry=0;tokenOwner='';tokenClient='';}
export function authorizeDrive(config:DriveConfig,owner:string):Promise<string>{
 if(token&&Date.now()<expiry&&tokenOwner===owner&&tokenClient===config.clientId)return Promise.resolve(token);
 return new Promise((resolve,reject)=>{if(!window.google?.accounts){reject(Error('Esperá a que se cargue la conexión con Google.'));return;}
  const client=window.google.accounts.oauth2.initTokenClient({client_id:config.clientId,scope,callback:result=>{
   if(result.error||!result.access_token){reject(Error(result.error_description||result.error||'Google no autorizó el acceso.'));return;}
   if(!window.google!.accounts.oauth2.hasGrantedAllScopes(result,scope)){reject(Error('Falta autorizar el guardado de archivos de esta app.'));return;}
   token=result.access_token;tokenOwner=owner;tokenClient=config.clientId;expiry=Date.now()+(Number(result.expires_in||3600)-60)*1000;resolve(token);
  },error_callback:error=>reject(Error(error.type==='popup_closed'?'Se cerró el acceso a Google sin completar la autorización.':'Permití la ventana de Google para conectar Drive.'))});
  client.requestAccessToken({prompt:''});
 });
}
export async function authorizeFixedFolder(accessToken:string,config:DriveConfig){
 try{await verifyDriveFolder(accessToken);return;}catch(e){if(!(e instanceof DriveRequestError)||![403,404].includes(e.status)||(e.status===403&&!['appNotAuthorizedToFile','insufficientFilePermissions'].includes(e.reason)))throw e;}
 await new Promise<void>((resolve,reject)=>{
  const p=window.google!.picker,view=new p.DocsView(p.ViewId.FOLDERS).setFileIds(DRIVE_FOLDER_ID).setIncludeFolders(true).setSelectFolderEnabled(true).setMimeTypes('application/vnd.google-apps.folder');
  const picker=new p.PickerBuilder().setDeveloperKey(config.apiKey).setAppId(config.projectNumber).setOAuthToken(accessToken).setOrigin(location.origin).setTitle('Autorizar Doc Worley / App avances').addView(view).setCallback(data=>{
   if(data.action===p.Action.CANCEL)reject(Error('La carpeta todavía no está autorizada.'));
   if(data.action===p.Action.PICKED){picker.setVisible(false);if(data.docs?.length===1&&data.docs[0].id===DRIVE_FOLDER_ID)resolve();else reject(Error('La app solo guarda en Doc Worley / App avances.'));}
  }).build();picker.setVisible(true);
 });
 await verifyDriveFolder(accessToken);
}
