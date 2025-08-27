// import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import axios from "axios";
import "./App.css";

import { Payment } from "./Payment";
import Paymentstatus from "./Paymentstatus";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payment" element={<Payment/>} />
        <Route path="/status" element={<Paymentstatus/>} />
        {/* <Route path="/payment" element={<Payment/>} /> */}
      </Routes>
    </Router>
  )
}

export default App;