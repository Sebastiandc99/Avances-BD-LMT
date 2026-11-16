import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../app/globals.css';
import '../app/cielo.css';
class AppErrorBoundary extends React.Component<React.PropsWithChildren, {failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError() {
    return {failed:true};
  }
  render() {
    if(this.state.failed)return <main className="loading">
      <h1>No se pudo abrir Avances LMT</h1>
      <p>Conectate a internet para recuperar la aplicación.</p>
      <a href={import.meta.env.BASE_URL+'recuperar.html'}>Recuperar aplicación</a>
    </main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(<AppErrorBoundary><App/></AppErrorBoundary>);
