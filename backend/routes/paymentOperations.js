const express = require('express');
const router = express.Router();

router.post("/api/pay", async (req, res) => {
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

router.post("/api/refund", async (req, res) => {
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

module.exports = router;