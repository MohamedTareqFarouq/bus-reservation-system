import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./mytrips.css";
import { format } from 'date-fns';
const backEndUrl = import.meta.env.VITE_BACK_END_URL;

const MyTrips = () => {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState("");

  const getUserTrips = async () => {
    console.log("fetching history...")
    try {
      const req_user = await axios.get(`${backEndUrl}/auth`, {
        withCredentials: true,
      });
      const user_id = req_user.data.userId
      setUserId(req_user.data.userId);

      const user_history = await axios.get(
        `${backEndUrl}/bookingHistory/user/${user_id}`
      );
      setTrips(user_history.data.bookingHistory);

    } catch (err) {
      console.error("Error Fetching user history!", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTrips();
  }, []);

  return (
    <div className="mytrips-container">
      <h2>My Trips</h2>
      {loading ? (
        <div className="mytrips-loading">Loading your trips...</div>
      ) : trips.length === 0 ? (
        <div className="mytrips-empty">You have no trip history yet.</div>
      ) : (
        <div className="mytrips-list">
          {trips.map((trip, idx) => (
            <div className="mytrips-card" key={trip.id || idx}>
              <div className="mytrips-card-header">
                <span className="mytrips-date-professional">
                  {(() => {
                    const rawDate = trip.schedule || trip.dateTime || trip.scheduleTime || trip.createdAt;
                    if (!rawDate) return 'Trip';
                    return format(new Date(rawDate), 'dd/MM/yyyy');
                  })()}
                </span>
                <span className="mytrips-reserved-at">
                  Reserved at: {(() => {
                    const reservedDate = trip.createdAt;
                    if (!reservedDate) return '-';
                    return format(new Date(reservedDate), 'dd/MM/yyyy, hh:mm a');
                  })()}
                </span>
              </div>
              <hr className="mytrips-divider" />
              <div className="mytrips-card-route">
                <div className="mytrips-route-line">
                  <span className="mytrips-dot green"></span>
                  <span>{trip.from}</span>
                </div>
                <div className="mytrips-route-line">
                  <span className="mytrips-dot orange"></span>
                  <span>{trip.to}</span>
                </div>
                <div className = "mytrips-status">
                  {trip.bookingStatus}
                </div>
              </div>
              {trip.route && (
                <div className="mytrips-card-extra">{trip.route}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
