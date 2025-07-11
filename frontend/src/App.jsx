// import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import axios from "axios";
import "./App.css";
import { Success } from "./Success";
import { Payment } from "./Payment";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payment" element={<Payment/>} />
        <Route path="/success" element={<Success/>} />
        {/* <Route path="/payment" element={<Payment/>} /> */}
      </Routes>
    </Router>
  )
}

export default App;