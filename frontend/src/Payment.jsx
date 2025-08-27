import { useState } from "react";
import axios from "axios";
import "./App.css";
const baseUrl = "https://a01ab92dd768.ngrok-free.app";

export const Payment = () => {
  const [transactionId, setTransactionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

  const getPaymentLink = async () => {
    const AMOUNT_CENTS = 50 * 100;
    const Integration_ID = 4867403;
    const First_Name = "mido";
    const Last_Name = "teto";
    const Customer_Phone_Number = 12343423;
    const customer_email = "midoteraq@gmail.com";
    // const PUBLIC_KEY = "egy_pk_test_rrjr6khvweS99K01ECH7JZGvdVu7DzNH"
    console.log({ AMOUNT_CENTS });
    const body = {
      amount: AMOUNT_CENTS, // amount_cents must be equal to the sum of the items amounts
      currency: "EGP",
      payment_methods: [Integration_ID], //Enter your integration ID as an Integar, you can list multiple integration IDs as -> "payment_methods": [{{Integration_ID_1}}, {{Integration_ID_2}}, {{Integration_ID_3}}], so the user can choose the payment method within the checkout page

      items: [
        {
          name: "trip",
          amount: AMOUNT_CENTS,
          description: "One spot",
          quantity: 1,
        },
      ],
      billing_data: {
        first_name: First_Name, // First Name, Last Name, Phone number, & Email are mandatory fields within sending the intention request
        last_name: Last_Name,
        phone_number: Customer_Phone_Number,
        city: "dumy",
        country: "dumy",
        email: customer_email,
        floor: "dumy",
        state: "dumy",
      },

      extras: {
        ee: 22,
      },

      notification_url: `${baseUrl}/api/webhook`,
      redirection_url: "http://localhost:5173/success",
      //Notification and redirection URL are working only with Cards and they overlap the transaction processed and response callbacks sent per Integration ID
    };

    await axios
      .post(`${baseUrl}/api/pay`, body)
      .then((res) => setIframeUrl(res?.data?.PAYMENT_URL))
      .catch((err) => console.error(err.response?.data || err.message));
  };

  const handleRefund = async () => {
    try {
      await axios.post(`${baseUrl}/api/refund`, {
        transaction_id: transactionId,
        amount_cents: amount,
      });
      console.log(transactionId, amount);
    } catch (err) {
      console.error("Error requesting refund: ", err);
    }
  };

  const handleOrderQuery = async () => {
    try {
      await axios.post(`${baseUrl}/api/order_inquiry`, {
        order_id: orderId,
      });
      console.log(orderId);
    } catch (err) {
      console.error("Error getting order details: ", err);
    }
  };

  const handleTransactionQuery = async () => {
    try {
      await axios.post(`${baseUrl}/api/transaction_inquiry`, {
        transaction_id: transactionId,
      });
      console.log(transactionId);
    } catch (err) {
      console.error("Error getting transaction details: ", err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!iframeUrl ? (
          <button onClick={() => getPaymentLink()}>Pay Now</button>
        ) : (
          <iframe
            src={iframeUrl}
            width="100%"
            height="600px"
            frameborder="0"
            title="Paymob Payment"
          ></iframe>
        )}

        <div>
          <label htmlFor="TransactionId">Transaction ID</label>
          <input
            type="number"
            id="TransactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => handleRefund()}>refund</button>
        </div>

        <div>
          <label htmlFor="TransactionId">Transaction ID</label>
          <input
            type="number"
            id="TransactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <button onClick={() => handleTransactionQuery()}>
            Get Transaction Details
          </button>
        </div>

        <div>
          <label htmlFor="order-id">Order Id</label>
          <input
            type="text"
            id="order-id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button onClick={() => handleOrderQuery()}>Get Order Details</button>
        </div>
      </header>
    </div>
  );
};
