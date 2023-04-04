// App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/welcome/welcome';
import Login from './pages/login/login';
import SignInProvider from './pages/sign-in/sign-in'
import Search from './pages/search/search'
import Bid from './pages/bid/bid'
import Display from './pages/display/display'
import Provider from './pages/provider/provider'
import Admin from './pages/admin/admin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in" element={<SignInProvider />} />
        <Route path="/search" element={<Search />} />
        <Route path="/bid" element={<Bid />} />
        <Route path="/display" element={<Display />} />
        <Route path="/provider" element={<Provider />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;