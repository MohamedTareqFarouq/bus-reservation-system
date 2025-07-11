import express from 'express';
const router = express.Router();
import hmacVerifier from '../middleware/hmacVerifier.js'

router.post("/webhook", (req, res) => {
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


export default router;