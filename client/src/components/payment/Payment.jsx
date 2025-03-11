import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Payment.css";
import axios from "axios";
import LoadingScreen from "../loadingScreen/loadingScreen";
import Overlay from "../overlayScreen/overlay";
const backEndUrl = import.meta.env.VITE_BACK_END_URL;

const Payment = () => {
  const { selectedSeats } = useParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "cash", // Default to Visa
  });

  // overlay screen
  const [alertFlag, setAlertFlag] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for payment success
  const [confirmationMessage, setConfirmationMessage] = useState(""); // New state for the confirmation message


  // if (isProcessing) return; // Prevent multiple submissions
  // setIsProcessing(true);

  // Function to format card number
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .slice(0, 19); // Max 16 digits with spaces
  };

  // Function to format expiry date
  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/g, "$1/")
      .slice(0, 5); // Max 4 digits in MM/YY format
  };

  // Function to strictly enforce 3 numeric characters for CVV
  const formatCvc = (value) => {
    return value.replace(/\D/g, "").slice(0, 3); // Allow only digits, max length of 3
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setIsLoading(true)

    // setConfirmationMessage(`
    //   Your payment was made via ${
    //     paymentDetails.paymentMethod === "visa" ? "Visa" : "Cash"
    //   }.
    // `);
    try {
      const req_user = await axios.get(`${backEndUrl}/auth`, {
        withCredentials: true,
      });

      const userId = req_user.data.userId;
      const busId = req_user.data.busId;

      await axios.post(
        `${backEndUrl}/seatselection/${busId}`,
        { selectedSeats, userId },
        { withCredentials: true }
      );

      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage(
          <div className="payment-success-container">
            <h1>✅ Successful Payment</h1>
            <p>
              Thank you for booking with us. <br /> <br />
              You will receive a confirmation message shortly.
            </p>
          </div>
        );
        setAlertFlag(true);
      }, 1000);

      setTimeout(() => {
        setAlertFlag(false);
        navigate(`/ticket-summary/${selectedSeats}`);
      }, 2200);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTimeout(() => {
          setIsLoading(false);
          setAlertMessage(
            <div className="payment-success-container">
              <h1>⚠️ Payment Failed</h1>
              <p>
                {(error.response.data.message)}
              </p>
            </div>
          );
          setAlertFlag(true);
        }, 1000);

        // setTimeout(() => {
        //   setAlertFlag(false);
        //   navigate(-1);
        // }, 2200);
      } else {
        console.error("An error occurred:", error);
         setTimeout(() => {
          setIsLoading(false);
          setAlertMessage(
            <div className="payment-success-container">
              <h1>⚠️ Payment Failed</h1>
              <p>
              An error occurred while booking, please try again.
              </p>
            </div>
          );
          setAlertFlag(true);
        }, 1000);
      }
    }
  };

  return (
    <div
      className={`payment-container ${
        paymentDetails.paymentMethod === "cash" ? "cash" : ""
      }`}
    >
      <div className="payment-box-container">
        <h1>Confirm Your Booking</h1>
        <form className="payment-form" onSubmit={handlePaymentSubmit}>
          <div className="payment-method">
            {/* <label>
              <input
                type="radio"
                name="paymentMethod"
                value="visa"
                checked={paymentDetails.paymentMethod === "visa"}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentMethod: e.target.value,
                  })
                }
              />
              Visa
            </label> */}
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentDetails.paymentMethod === "cash"}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentMethod: e.target.value,
                  })
                }
              />
              Cash
            </label>
          </div>

          {/* {paymentDetails.paymentMethod === "visa" && (
            <>
              <input
                type="text"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                value={paymentDetails.cardExpiry}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    cardExpiry: formatExpiryDate(e.target.value),
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={paymentDetails.cardCvv}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    cardCvv: formatCvc(e.target.value),
                  })
                }
                required
                maxLength="3" // Limit to 3 characters
                pattern="\d{3}" // Regex to validate exactly 3 digits
                title="CVV must be exactly 3 numeric characters"
              />
            </>
          )} */}

          <button type="submit" className="cta-button">
            Book Now
          </button>
        </form>
        {isLoading && <LoadingScreen />}

        {alertFlag && (
          <Overlay
            alertFlag={alertFlag}
            alertMessage={alertMessage}
            setAlertFlag={setAlertFlag}
          />
        )}
      </div>
    </div>
  );
};

export default Payment;
