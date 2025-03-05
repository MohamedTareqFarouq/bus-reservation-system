import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Auth.jsx";

// Import components
import Navbar from "./components/navbar/nav.jsx";
import Signup from "./components/signup/Signup.jsx";
import Login from "./components/login/login.jsx";
import ForgotPassword from "./components/forgotPassword/forgotPassword.jsx";
import ResetPassword from "./components/reset-password/reset-password.jsx";
import AddBus from "./components/addBus/AddBus.jsx";
import BusList from "./components/busList/Buslist.jsx";
import Homepage from "./components/homePage/Homepage.jsx";
import SeatSelection from "./components/seatSelection/SeatSelection.jsx";
import Payment from "./components/payment/Payment.jsx";
import PaymentSuccess from "./components/paymentSuccess/PaymentSuccess.jsx";
import TicketSummary from "./components/ticketSummary/TicketSummary.jsx"; 
import Profile from "./components/Profile/profile.jsx";
import Footer from "./components/footer/footer.jsx";
import EditBus from "./components/editBus/editBus.jsx"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <Auth>
              <Navbar />
              <Homepage />
              <Footer /> {/* Footer is only shown when logged in */}
            </Auth>
          }
        />

        <Route
          path="/seat-selection/:busId"
          element={
            <Auth>
              <Navbar />
              <SeatSelection />
              <Footer />
            </Auth>
          }
        />

        <Route
          path="/payment/:selectedSeats"
          element={
            <Auth>
              <Navbar />
              <Payment />
              <Footer />
            </Auth>
          }
        />

        <Route
          path="/payment-success/:selectedSeats"
          element={
            <Auth>
              <Navbar />
              <PaymentSuccess />
              <Footer />
            </Auth>
          }
        />

        <Route
          path="/ticket-summary/:selectedSeats"
          element={
            <Auth>
              <Navbar />
              <TicketSummary />
              <Footer />
            </Auth>
          }
        />

        <Route
          path="/add-bus"
          element={
            <Auth requireAdmin={true}>
              <Navbar />
              <AddBus />
              <Footer />
            </Auth>
          }
        />

        <Route
          path="/bus-list"
          element={
            <Auth requireAdmin={true}>
              <Navbar />
              <BusList />
              <Footer />
            </Auth>
          }
        />
        <Route
        path= "/edit-bus/:busId"
        element={    
            <Auth requireAdmin={true}>
              <Navbar />
              <EditBus />
              <Footer />
            </Auth>
        }
        />

        <Route
          path="/profile"
          element={
            <Auth>
              <Navbar />
              <Profile />
              <Footer />
            </Auth>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
