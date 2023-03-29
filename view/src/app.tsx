// App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/welcome/welcome';
import Login from './pages/login/login';
import SignInProvider from './pages/sign-in/sign-in'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in" element={<SignInProvider />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;