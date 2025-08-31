// 🔹 Helper 2: Build Paymob request body
export function buildPaymobBody(payment, user, booking, trip, route) {
  return {
    amount: trip.price,
    currency: "EGP",
    payment_methods: [Number(process.env.INTEGRATION_ID)],

    items: [
      {
        name: `Trip ${route.source} → ${route.destination}`,
        amount: trip.price,
        description: `Pickup: ${booking.stop_name}, Date: ${trip.date}, Takeoff: ${trip.departure_time}`,
        quantity: 1,
      },
    ],

    billing_data: {
      first_name: user.username,
      last_name: user.last_name || "unknown",
      phone_number: user.phone_number,
      city: "dummy",
      country: "dummy",
      email: user.email,
      floor: "dummy",
      state: "dummy",
    },

    extras: { ee: 22 },
    special_reference: `${payment.payment_id}`,
    notification_url: `${process.env.BASE_URL}/payment/webhook`,
    redirection_url: "http://localhost:5173/#/ticket-summary",
  };
}
