import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if(process.env.NODE_ENV==='production') disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
      <Routes>
     < Route path="/*" element={<App/>}/>
     </Routes>
     </AuthProvider>
     </Router>
  </React.StrictMode>,
  
);
