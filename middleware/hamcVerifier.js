const crypto = require("crypto");
require("dotenv").config();

// Ensure your secret key is loaded from environment variables
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;

if (!PAYMOB_HMAC_SECRET) {
  console.error("ERROR: PAYMOB_HMAC_SECRET environment variable is not set.");
}

const hmacVerifier = (payload, receivedHmac) => {
  if (!receivedHmac) {
    console.error("HMAC signature not provided.");
    return false;
  }

  if (!payload || typeof payload !== "object") {
    console.error("Invalid webhook payload format for HMAC verification.");
    return false;
  }

  // PayMob's main transaction details are typically nested under 'obj'
  const obj = payload.obj || {}; // Safely get 'obj', default to empty object if not present

  // Helper function to safely get string value, handling booleans and null/undefined
  const getSafeString = (value) => {
    if (typeof value === "boolean") {
      return value.toString();
    }
    // Convert to string; if null/undefined, default to empty string
    return String(value ?? "");
  };
  // --- Extract and prepare values from 'obj' for concatenation ---
  // Access properties from 'obj', not directly from 'payload'
  const amount_cents = getSafeString(obj.amount_cents);
  const created_at = getSafeString(obj.created_at);
  const currency = getSafeString(obj.currency);
  const error_occured = getSafeString(obj.error_occured);
  const has_parent_transaction = getSafeString(obj.has_parent_transaction);
  const objId = getSafeString(obj.id); // 'id' from 'obj'
  const integration_id = getSafeString(obj.integration_id);
  const is_3d_secure = getSafeString(obj.is_3d_secure);
  const is_auth = getSafeString(obj.is_auth);
  const is_capture = getSafeString(obj.is_capture);
  const is_refunded = getSafeString(obj.is_refunded);
  const is_standalone_payment = getSafeString(obj.is_standalone_payment); // Verify this exact field name
  const is_voided = getSafeString(obj.is_voided);
  const orderId = getSafeString(obj.order?.id); // Safely access nested order.id
  const owner = getSafeString(obj.owner);
  const pending = getSafeString(obj.pending);
  const source_data_pan = getSafeString(obj.source_data?.pan); // Safely access nested source_data
  const source_data_sub_type = getSafeString(obj.source_data?.sub_type);
  const source_data_type = getSafeString(obj.source_data?.type);
  const success = getSafeString(obj.success);

  // Step 2: Concatenate the values (Order is CRUCIAL)
  const concatenatedString =
    amount_cents +
    created_at +
    currency +
    error_occured +
    has_parent_transaction +
    objId + // This is the 'id' of the transaction object, often called 'id' or 'transaction_id' in docs
    integration_id +
    is_3d_secure +
    is_auth +
    is_capture +
    is_refunded +
    is_standalone_payment +
    is_voided +
    orderId + // This is the 'id' of the associated order
    owner +
    pending +
    source_data_pan +
    source_data_sub_type +
    source_data_type +
    success;

  console.log("HMAC String to hash:", concatenatedString);

  // Step 3: Compute HMAC
  const computedHmac = crypto
    .createHmac("sha512", PAYMOB_HMAC_SECRET)
    .update(concatenatedString)
    .digest("hex");

  // Log for debugging
  console.log("Computed HMAC:", computedHmac);
  console.log("Received HMAC:", receivedHmac);

  // Step 4: Compare securely
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHmac),
    Buffer.from(receivedHmac)
  );

  return isValid;
};

module.exports = hmacVerifier;
