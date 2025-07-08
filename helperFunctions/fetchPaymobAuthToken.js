export const fetchPaymobAuthToken = async () => {
  // var token = ''
  // const response = await axios.post('https://accept.paymob.com/api/auth/tokens', {api_key: process.env.API_KEY})
  // .then((res) => token = res?.data?.token)
  // .catch((err) => console.error(err));

  // return res.json({"auth_token: ": token})

  try {
    const response = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      { api_key: process.env.API_KEY }
    );

    const token = response.data.token;

    return token;
  } catch (err) {
    console.error("Auth token error: ", err.response?.data || err.message);
    throw new Error("Failed to fetch auth token!");
  }
};
