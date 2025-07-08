const express = require("express");
const cors = require("cors");
const axios = require("axios");
const hmacVerifier = require('./middleware/hamcVerifier')
const webhookroutes = require('./routes/webhook')
const paymentOperations = require('./routes/paymentOperations')
const {fetchPaymobAuthToken} = require('./helperFunctions/fetchPaymobAuthToken')
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["POST", "GET"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON
app.use(express.json());

// Simple hello world route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/pay", async (req, res) => {
  console.log("POST  /pay was called");
  const body = req.body;

  var PAYMENT_URL = "";

  try {
    const response = await axios
      .post("https://accept.paymob.com/v1/intention/", body, {
        headers: {
          Authorization: `Token ${process.env.SECRET_KEY}`,
        },
      })
      .then(
        (res) =>
          (PAYMENT_URL = `https://accept.paymob.com/api/acceptance/iframes/878748?payment_token=${res.data.payment_keys[0].key}`)
      )
      .catch((err) => console.error(err.response?.data || err.message));
  } catch (err) {
    return res.send(err);
  }

  return res.json({ PAYMENT_URL });
});

app.post("/api/refund", async (req, res) => {
  console.log("POST  /refund was called");
  const body = req.body;

  try {
    const response = await axios
      .post(
        "https://accept.paymob.com/api/acceptance/void_refund/refund",
        body,
        {
          headers: {
            Authorization: `Token ${process.env.SECRET_KEY}`,
          },
        }
      )
      .then((res) => console.log(res?.data.message))
      .catch((err) => console.error(err.response?.data || err.message));
  } catch (err) {
    return res.send(err);
  }

  return res.send("Payment Successfully refunded!");
});


app.post("/api/order_inquiry", async (req, res) => {
  const order_id = req.body.order_id;

  try {
    const token = await fetchPaymobAuthToken();

    console.log("Token: ", token);

    const inquiryResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry",
      { order_id: order_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.json(inquiryResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order inquiry failed!" });
  }
});

app.post("/api/transaction_inquiry", async (req, res) => {
  const transaction_id = req.body.transaction_id;

  try {
    const token = await fetchPaymobAuthToken();

    console.log("Token: ", token);

    const inquiryResponse = await axios.get(
      `https://accept.paymob.com/api/acceptance/transactions/${transaction_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.json(inquiryResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order inquiry failed!" });
  }
});

app.use(paymentOperations);

app.use('/api/weebhook', webhookroutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
