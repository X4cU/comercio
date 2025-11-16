import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <main>
      <h1>Comercio Frontend</h1>
      <p>Configura tus variables en <code>.env</code> para consumir el backend.</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
