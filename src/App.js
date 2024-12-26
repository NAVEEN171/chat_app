import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Avatar from "./pages/Avatar";
import Chatbox from "./pages/Chatbox";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Avatar" element={<Avatar />} />
          <Route path="/" element={<Chatbox />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
