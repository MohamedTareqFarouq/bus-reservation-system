import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaPhone } from "react-icons/fa"; // Import icons
import "./UserProfile.css";
import Dashboard from "../dashboard/Dashboard";
import LoadingPage from "../loadingPage/loadingPage";

const backEndUrl = import.meta.env.VITE_BACK_END_URL;

const UserProfile = () => {
  const [busDetails, setBusDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const req_user = await axios.get(`${backEndUrl}/auth`, {
          withCredentials: true,
        });
        setUserId(req_user.data.userId);

        // Check if busId exists in the user data
        const busId = req_user.data.busId;
        if (busId) {
          const response = await axios.get(
            `${backEndUrl}/seatselection/${busId}`
          );
          if (response.data) {
            setBusDetails(response.data);
          } else {
            setError("No bus details found.");
          }
        } else {
          setError("No busId associated with this user.");
        }
      } catch (err) {
        console.error("Error fetching bus details:", err);
        setError("Failed to fetch bus details.");
      }
    };

    // const fetchUsers = async () => {
    //   try {
    //     const req_user = await axios.get(`${backEndUrl}/auth`, { withCredentials: true });
    //     setUserId(req_user.data.userId);
    //     const userId = req_user.data.userId;
    //     const res = await axios.get(`${backEndUrl}/user/profile/${userId}`);
    //     setUserDetails(res.data);
    //   } catch (err) {
    //     console.error("Error fetching user details:", err);
    //     setError("Failed to fetch user details.");
    //   }
    // };
    const fetchUsers = async () => {
      try {
        const req_user = await axios.get(`${backEndUrl}/auth`, {
          withCredentials: true,
        });
        setUserId(req_user.data.userId);
        const userId = req_user.data.userId;
        setUserId(userId);

        // Fetch user details
        const res = await axios.get(`${backEndUrl}/user/profile/${userId}`);
        setUserDetails(res.data);

        const userDetails = res.data;
        const busIds = userDetails.bookedBuses.buses;

        const response = await axios.get(`${backEndUrl}/buses/userBuses`, {
          params: { ids: busIds?.length ? busIds.join(",") : [] },
        });
        const buses = response.data;

        setBusDetails((prevBuses) =>
          Array.isArray(prevBuses) ? [...prevBuses, ...buses] : [...buses]
        );
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch bus details.");
        if (busIds.length > 0) {
          const response = await axios.get(`${backEndUrl}/buses/userBuses`, {
            params: { ids: busIds.join(",") },
          });
          setBusDetails(response.data);
        } else {
          setError("No booked buses found.");
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    fetchUsers();
    fetchBusDetails();
  }, []);

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let period = "AM";
    let hour12 = parseInt(hour, 10);

    if (hour12 >= 12) {
      period = "PM";
      if (hour12 > 12) hour12 -= 12;
    }
    if (hour12 === 0) hour12 = 12;

    return `${hour12}:${minute} ${period}`;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="profile-container">
      <div className="user-profile">
        <div className="avatar"></div>

        {/* Name inside a bordered box */}
        <h1 className="user-name-box">{userDetails?.name}</h1>

        {/* Email & Phone with Icons */}
        <p className="user-detail">
          <FaEnvelope className="icon" /> {userDetails?.email}
        </p>
        <p className="user-detail">
          <FaPhone className="icon" /> {userDetails?.phoneNumber}
        </p>
      </div>

      <Dashboard error={error} busDetails={busDetails} userId={userId} />
    </div>
  );
};

export default UserProfile;
