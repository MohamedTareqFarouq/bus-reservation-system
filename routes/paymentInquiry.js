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
