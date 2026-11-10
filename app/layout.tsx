import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Avances BD LMT',description:'Control de montaje de desviadores de vuelo. Salar del Rincón.',manifest:'/manifest.webmanifest',icons:{icon:'/icon.svg',apple:'/icon-192.png'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>;}
