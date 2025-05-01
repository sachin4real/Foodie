import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ You forgot this line
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext'; // (only if you are using it)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider> {/* Optional - if you created UserContext */}
        <SidebarProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SidebarProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
