// import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// import axios from "axios";
import "./App.css";

export const Success = () => {
  const params = useSearchParams();
  console.log(params);
  const success = params.success;

  return (
    <div className="success-container">
      {success === "true" ? <p>Successful Payment!</p> : <p>Payment Failed!</p>}
    </div>
  );
};
