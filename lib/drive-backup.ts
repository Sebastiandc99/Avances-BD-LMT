// Folder identifiers do not grant access. Google authorization is always required.
export const DRIVE_FOLDER_ID='1xsdmCcMjyTSp8j-fwXMD28zkwfbcvUPy';
export const DRIVE_FOLDER_URL='https://drive.google.com/drive/folders/'+DRIVE_FOLDER_ID;
export const DRIVE_FOLDER_LABEL='Doc Worley / App avances';
const api='https://www.googleapis.com';
type DriveFile={id:string;name?:string;mimeType?:string;parents?:string[];trashed?:boolean;capabilities?:{canAddChildren?:boolean}};
type DriveFailure={error?:{message?:string;errors?:{reason?:string}[]}};
export class DriveRequestError extends Error{status:number;reason:string;constructor(message:string,status:number,reason=''){super(message);this.status=status;this.reason=reason;}}
export async function driveRequest(token:string,path:string,init:RequestInit={},send:typeof fetch=fetch){
 const response=await send(api+path,{...init,headers:{...init.headers,Authorization:'Bearer '+token},signal:AbortSignal.timeout(90000)});
 if(!response.ok){const body=await response.json().catch(()=>null) as DriveFailure|null;throw new DriveRequestError(body?.error?.message||`Google Drive respondió ${response.status}.`,response.status,body?.error?.errors?.[0]?.reason||'');}return response;
}
export async function verifyDriveFolder(token:string,send:typeof fetch=fetch){
 const response=await driveRequest(token,'/drive/v3/files/'+DRIVE_FOLDER_ID+'?fields=id,mimeType,trashed,capabilities(canAddChildren)',{},send),folder=await response.json() as DriveFile;
 if(folder.id!==DRIVE_FOLDER_ID||folder.mimeType!=='application/vnd.google-apps.folder'||folder.trashed||folder.capabilities?.canAddChildren!==true)throw Error('Google no permite guardar en Doc Worley / App avances con esta cuenta.');
}
/** One versioned backup per browser/device; never touches the original PDF/DWG files. */
export async function saveDriveBackup(token:string,snapshot:string,deviceId:string,send:typeof fetch=fetch){
 if(!/^[a-f0-9-]{36}$/i.test(deviceId))throw Error('Identificador de equipo inválido.');
 const parsed=JSON.parse(snapshot);if(parsed.format!=='lmt-backup-v1'||!Array.isArray(parsed.events)||!Array.isArray(parsed.photos))throw Error('El respaldo no es compatible.');
 if(new Blob([snapshot]).size>70*1024*1024)throw Error('El respaldo supera los 70 MB.');
 await verifyDriveFolder(token,send);
 const name='Avances_BD_LMT_'+deviceId+'.json';
 const q=`'${DRIVE_FOLDER_ID}' in parents and trashed=false and name='${name}' and appProperties has { key='app' and value='avances-bd-lmt' }`;
 const list=await driveRequest(token,'/drive/v3/files?'+new URLSearchParams({q,fields:'files(id,name,mimeType,parents)',orderBy:'modifiedTime desc',pageSize:'100'}),{},send),found=((await list.json()) as {files?:DriveFile[]}).files||[];
 const file=found[0];if(file&&(file.name!==name||file.mimeType!=='application/json'||!file.parents?.includes(DRIVE_FOLDER_ID)))throw Error('El archivo encontrado no es un respaldo de esta carpeta.');
 const boundary='lmt_'+crypto.randomUUID(),metadata={name,mimeType:'application/json',appProperties:{app:'avances-bd-lmt',device:deviceId},...(!file?{parents:[DRIVE_FOLDER_ID]}:{})};
 const body=new Blob([`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,JSON.stringify(metadata),`\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,snapshot,`\r\n--${boundary}--\r\n`]);
 const response=await driveRequest(token,'/upload/drive/v3/files'+(file?'/'+encodeURIComponent(file.id):'')+'?uploadType=multipart&fields=id,name,parents',{method:file?'PATCH':'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body},send),saved=await response.json() as DriveFile;
 if(!saved.id||saved.name!==name||!saved.parents?.includes(DRIVE_FOLDER_ID))throw Error('Google no confirmó el archivo en la carpeta de destino.');
 const readback=await driveRequest(token,'/drive/v3/files/'+encodeURIComponent(saved.id)+'?alt=media',{},send);
 if(await readback.text()!==snapshot)throw Error('No se pudo verificar el contenido guardado en Drive.');
 return {id:saved.id,name:saved.name};
}
