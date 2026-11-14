import type { Metadata } from 'next';
import './globals.css';
import './cielo.css';
export const metadata:Metadata={title:'Avances LMT',description:'Control de vanos y avance de obra. Salar del Rincón.',manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>;}
