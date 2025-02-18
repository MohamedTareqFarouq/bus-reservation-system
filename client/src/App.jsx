import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Auth.jsx";

//from components
import Navbar from "./components/navbar/nav.jsx";
import Signup from "./components/signup/Signup.jsx";
import Login from "./components/login/login.jsx";
import AddBus from "./components/addBus/AddBus.jsx";
import BusList from "./components/busList/Buslist.jsx";
import Homepage from "./components/homePage/Homepage.jsx";
import SeatSelection from "./components/seatSelection/SeatSelection.jsx";
import Payment from "./components/payment/Payment.jsx";
import PaymentSuccess from "./components/paymentSuccess/PaymentSuccess.jsx";
import TicketSummary from "./components/ticketSummary/TicketSummary.jsx"; // Import TicketSummary component
import Profile from "./components/Profile/profile.jsx";
import Footer from "./components/footer/footer.jsx";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <Auth>
                    <Navbar />

            </Auth>
          }
        ></Route>
                <Route
          path="/"
          element={
            <Auth>
              <Homepage />
            </Auth>
          }
        ></Route>
        <Route
          path="/seat-selection/:busId"
          element={
            <Auth>
              <SeatSelection />
            </Auth>
          }
        ></Route>
        <Route
          path="/payment/:selectedSeats"
          element={
            <Auth>
              <Payment />
            </Auth>
          }
        />
        <Route
          path="/payment-success/:selectedSeats"
          element={
            <Auth>
              <PaymentSuccess />
            </Auth>
          }
        />
        <Route
          path="/ticket-summary/:selectedSeats"
          element={
            <Auth>
              <TicketSummary />
            </Auth>
          }
        />
        {/* <Route path="/authen" element={<authen />}></Route> */}

        <Route
          path="/add-bus"
          element={
            <Auth requireAdmin={true} route="">
              <AddBus />
            </Auth>
          }
        ></Route>
        <Route
          path="/bus-list"
          element={
            <Auth requireAdmin={true} route="">
              <BusList />
            </Auth>
          }
        ></Route>

        <Route
          path="/profile"
          element={
            <Auth>
              <Profile />
            </Auth>
          }
        ></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
