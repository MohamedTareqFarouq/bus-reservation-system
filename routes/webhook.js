const express = require('express');
const router = express.Router();
const hmacVerifier = require('../middleware/hamcVerifier')

router.post("/api/webhook", (req, res) => {
  const payload = req.body
  const receivedHmac = req.query.hmac
  try {
    // console.log("POST /webhook was called")
    // console.log("Params: ", req.params)
    // console.log("Body: ", req.body);

    const validHMAC = hmacVerifier(payload, receivedHmac)
    
    if (!validHMAC ){
      throw new Error("Invalid HMAC signature!")
    }
    return res.json("Webhook is working!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment Failed!" });
  }
});


module.exports = router;