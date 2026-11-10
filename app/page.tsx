import { getChatGPTUser } from './chatgpt-auth';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function Home(){const u=await getChatGPTUser();return <Dashboard user={u?{id:u.userId,name:u.displayName}:null}/>;}
