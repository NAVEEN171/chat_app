import logo from './logo.svg';
import React from 'react';
import './App.css';
import {Routes,Route,BrowserRouter} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Avatar from "./pages/Avatar";
import Chatbox from "./pages/Chatbox";

function App() {
  return (
    <div className='App'>
    <BrowserRouter>
    <Routes>
      
      <Route path="/Signup" element={<Signup/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/Avatar" element={<Avatar/>}/>
      <Route path="/" element={<Chatbox/>}/>


            </Routes></BrowserRouter>
            </div>
  );
}

export default App;
