import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Paymentstatus.css";

export default function Paymentstatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const isSuccess = query.get("success") === true;
  console.log(query.get("success"))
  console.log("isSuccess:", isSuccess);
  const orderId = query.get("order");
  console.log("orderId:", orderId);

  useEffect(() => {
    if (isSuccess) {
      console.warn("Payment failed or status not found");
    }
  }, [isSuccess, navigate]);

  return (
    <div className={`receipt-wrapper ${isSuccess ? "success" : "failure"}`}>
      <div className="receipt-card">
        <div className="icon">{isSuccess ? "✅" : "❌"}</div>
        <h1>{isSuccess ? "Payment Successful" : "Payment Failed"}</h1>
        <p>
          {isSuccess
            ? "Your transaction was completed successfully."
            : "your payment was not successful."}
        </p>

        <div className="receipt-details">
          <div className="row">
            <span>Order ID:</span>
            <span>{orderId || "N/A"}</span>
          </div>
          <div className="row">
            <span>Status:</span>
            <span>{isSuccess ? "Success" : "Failure"}</span>
          </div>
        </div>

        <button className="btn" onClick={() => navigate("/home")}> 
          Return to HomePage
        </button>
      </div>
    </div>
  );
} 