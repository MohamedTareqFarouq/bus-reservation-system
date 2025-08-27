import axios from "axios";

export const createPayment = async (req, res) => {
  console.log("POST  /pay was called");
  const body = req.body;

  var PAYMENT_URL = "";

  try {
    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      body,
      {
        headers: {
          Authorization: `Token ${process.env.SECRET_KEY}`,
        },
      }
    );
    PAYMENT_URL = `https://accept.paymob.com/api/acceptance/iframes/878748?payment_token=${response.data.payment_keys[0].key}`;
    return res.status(200).json({ PAYMENT_URL });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.send(err);
  }
};

export const refundPayment = async (req, res) => {
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
};
