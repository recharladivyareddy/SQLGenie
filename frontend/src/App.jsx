// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext.jsx'; // Import UserProvider
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ChatApp from './components/ChatApp.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider> {/* Wrap the app with UserProvider */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </UserProvider>
);

export default App;
