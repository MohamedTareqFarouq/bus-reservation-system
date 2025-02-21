import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "./SeatSelection.css";
import axios from "axios";
import Overlay from "../overlayScreen/overlay";
import LoadingPage from "../loadingPage/loadingPage";
import LoadingScreen from "../loadingScreen/loadingScreen";
import Pusher from "pusher-js"; // Import Pusher
import SeatLegend from "./SeatLegend";
const backEndUrl = import.meta.env.VITE_BACK_END_URL;

const SeatSelection = () => {
  const navigate = useNavigate();
  const { busId } = useParams();
  const [userId, setUserId] = useState("");
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [alertFlag, setAlertFlag] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Fetch bus details and subscribe to Pusher updates
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const [req_user, response] = await Promise.all([
          axios.get(`${backEndUrl}/auth`, { withCredentials: true }),
          axios.get(`${backEndUrl}/seatselection/${busId}`),
        ]);
        setBusDetails(response.data);
        setUserId(req_user.data.userId);
      } catch (err) {
        console.error("Error fetching bus details:", err);
        setError("Failed to fetch bus details.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    if (busId) fetchBusDetails();

    // Initialize Pusher
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("bus-channel");

    channel.bind("seat-reserved", (data) => {
      setBusDetails((prev) => ({
        ...prev,
        seats: { ...prev.seats, reservedSeats: data.updatedBus.seats.reservedSeats },
      }));
    });
    
    channel.bind("seat-booked", (data) => {
      if (data.busId === busId) {
        setBusDetails((prev) => ({
          ...prev,
          seats: {
            ...prev.seats,
            bookedSeats: prev.seats.bookedSeats.map((seat, index) =>
              data.selectedSeats.includes(index) ? data.userId : seat
            ),
          },
        }));
      }
    });
    
    channel.bind("seat-canceled", (data) => {
      setBusDetails((prev) => ({
        ...prev,
        seats: {
          ...prev.seats,
          bookedSeats: data.updatedBus.seats.bookedSeats,
          reservedSeats: data.updatedBus.seats.reservedSeats
        }
      }));
    });
    channel.bind("bus-deleted", (data) => {
      if (data.busId === busId) {
        localStorage.removeItem(`selectedSeats_${busId}`);
        setSelectedSeats([]);
      }
    });
    
    

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);
  useEffect(() => {
    const savedSeats = localStorage.getItem(`selectedSeats_${busId}`);
    if (savedSeats) {
      setSelectedSeats(JSON.parse(savedSeats));
    }
  }, [busId]);
  
  const handleSeatSelect = async (seat, index) => {
    // setReservedSeats(
    //   busDetails.seats.reservedSeats
    //     .filter((seat) => seat.reservedBy === userId)
    //     .map((seat) => parseInt(seat.seatNumber))
    // );
    const isBooked = seat !== "0";
    const isCurrentUserSeat = seat === userId;

    const isReserved = busDetails.seats.reservedSeats
      .map((seat) => seat.seatNumber)
      .includes(String(index));

    const isReservedForCurrentUser = busDetails.seats.reservedSeats
      .filter((seat) => seat.reservedBy === userId)
      .map((seat) => seat.seatNumber)
      .includes(String(index));

  
    try {
      const req_user = await axios.get(`${backEndUrl}/auth`, {
        withCredentials: true,
      });
  
      if (!req_user.data.userId) {
        alert("Session ended");
        navigate("/login");
        return;
      }
  
      // Update selected seats logic here
      setSelectedSeats((prev) => {
        const newSeats = [...prev];
  
        if (newSeats.length >= 2 && !newSeats.includes(index)) {
          alert("You can only select a maximum of 2 seats.");
          return prev;
        }
  
        if (!isBooked && !isCurrentUserSeat) {
          if (newSeats.includes(index)) {
            newSeats.splice(newSeats.indexOf(index), 1);
          } else {
            newSeats.push(index);
          }
        } else if (isCurrentUserSeat) {
          if (newSeats.includes(index)) {
            newSeats.splice(newSeats.indexOf(index), 1);
          } else {
            newSeats.push(index);
          }
        } else {
          setConfirmation(true);
        }
  
        localStorage.setItem(`selectedSeats_${busId}`, JSON.stringify(newSeats));
  
        return newSeats;
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
    

  const handleConfirmSeats = async (type) => {
    setIsLoading(true);

    if (selectedSeats.length > 0 && type === "book") {
      try {
        const response = await axios.post(
          `${backEndUrl}/seatselection/reserve/${busId}`,
          { data: { selectedSeats, userId }, withCredentials: true }
        );

        if (response.status === 200 || response.status === 202) {
          setTimeout(() => {
            setIsLoading(false);
            setAlertMessage(`${response.data.message}`);
            setAlertFlag(true);
          }, 1000);

          setTimeout(() => {
            setAlertFlag(false);
            navigate(`/payment/${selectedSeats}`);
          }, 2200);          
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setSelectedSeats([]);

          setTimeout(() => {
            setIsLoading(false);
            setAlertMessage(
              <div className="payment-success-container">
                <h1>Payment Failed</h1>
                <p>
                  The selected seats are already Reserved. <br /> <br />
                  Please try again with different seats.
                </p>
              </div>
            );
            setAlertFlag(true);
          }, 1000);
        } else {
          console.error("An error occurred:", error);
        }
      }
    } else if (selectedSeats.length > 0 && type === "cancel") {
      const response = await axios.delete(
        `${backEndUrl}/seatselection/${busId}`,
        { data: { selectedSeats, userId }, withCredentials: true }
      );
      setBusDetails(response.data.updatedBus);
      setSelectedSeats([]);

      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage("Seats canceled successfully");
        setAlertFlag(true);
      }, 1000);

      setTimeout(() => {
        setAlertFlag(false);
      }, 2200);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage("Select at least one seat");
        setAlertFlag(true);
      }, 1000);

    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <p>{error}</p>;

  return (
    <div className="seat-selection-page">
      <header className="header">
        <h1>Seat Selection</h1>
      </header>
      <div className="bus-card">
        <div className="bus-details">
          <h2>Bus details</h2>
          <div className="bus-data">
            <p>
              <strong>Time</strong> {busDetails.time.departureTime}
            </p>
            <p>
              <strong>Price</strong> {busDetails.price}
            </p>
            <p>
              <strong>Pickup</strong> {busDetails.location.pickupLocation}
            </p>
            <p>
              <strong>Arrival</strong> {busDetails.location.arrivalLocation}
            </p>
            <p>
              <strong>Date</strong> {busDetails.schedule}
            </p>
          </div>
          <CSSTransition
            in={confirmation && selectedSeats.length > 0}
            timeout={300}
            classNames="confirm-btn-transition"
            unmountOnExit
          >
            <div className="seat-confirmation">
              <h3>Seats Confirmed</h3>
              <p>{selectedSeats.map((seat) => seat + 1).join(", ")}</p>
            </div>
          </CSSTransition>
        </div>
        <div className="bus-seats">
          <SeatLegend/>
          <div className="seat-grid">
            {busDetails.seats.bookedSeats.map((seat, index) => {
              const isBooked = seat !== "0";
              const isCurrentUserBookedSeat = seat === userId;
              const isSelected = selectedSeats.includes(index);
              const isReserved = busDetails.seats.reservedSeats
                .map((seat) => seat.seatNumber)
                .includes(String(index));
              const isReservedForCurrentUser = busDetails.seats.reservedSeats
                .filter((seat) => seat.reservedBy === userId)
                .map((seat) => seat.seatNumber)
                .includes(String(index));

              return (
                <div
                  key={index}
                  className={`seat ${isSelected ? "selected" : ""} ${
                    isReserved &&
                    !isReservedForCurrentUser &&
                    !isCurrentUserBookedSeat
                      ? "reserved"
                      : ""
                  } 
                  ${
                    isReservedForCurrentUser &&
                    isReserved &&
                    !isCurrentUserBookedSeat
                      ? "reserved-for-current-user"
                      : ""
                  } 
                  ${isBooked && !isCurrentUserBookedSeat ? "booked" : ""} ${
                    isCurrentUserBookedSeat ? "current-user" : ""
                  }`}
                  onClick={() =>
                    (!isReserved || isReservedForCurrentUser) &&
                    handleSeatSelect(seat, index)
                  }
                  title={
                    isBooked && !isCurrentUserBookedSeat
                      ? "This seat is booked"
                      : "This seat is reserved temporarily"
                  }
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          <div className="btn-container">
            <CSSTransition
              in={
                selectedSeats.length > 0 &&
                (selectedSeats.every(
                  (seat) => busDetails.seats.bookedSeats[seat] === userId
                ) ||
                  selectedSeats.every((seat) =>
                    busDetails.seats.reservedSeats
                      .filter((seat) => seat.reservedBy === userId)
                      .map((seat) => seat.seatNumber)
                      .includes(String(seat))
                  ))
              }
              timeout={300}
              classNames="confirm-btn-transition"
              unmountOnExit
            >
              <button
                className="confirm-btn"
                onClick={() => handleConfirmSeats("cancel")}
              >
                Cancel
              </button>
            </CSSTransition>

            <CSSTransition
              in={
                selectedSeats.length > 0 &&
                selectedSeats.every(
                  (seat) => busDetails.seats.bookedSeats[seat] === "0"
                )
              }
              timeout={300}
              classNames="confirm-btn-transition"
              unmountOnExit
            >
              <button
                className="confirm-btn"
                onClick={() => handleConfirmSeats("book")}
              >
                Proceed
              </button>
            </CSSTransition>
          </div>
        </div>
      </div>

      {isLoading && <LoadingScreen />}

      <Overlay
        alertFlag={alertFlag}
        alertMessage={alertMessage}
        setAlertFlag={setAlertFlag}
      />
    </div>
  );
};

export default SeatSelection;
