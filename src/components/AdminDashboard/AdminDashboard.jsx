import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () =>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Check if the admin is authenticated on page load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // Redirect to login if no token is found
      navigate("/AdminLogin");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove token from localStorage
    setIsAuthenticated(false); // Update the state
    navigate("/AdminLogin"); // Redirect to login page
  };

  const moveSchedule = ()=>{
    navigate("/AdminManageSchedules");
  }

  const moveBlogs = ()=>{
    navigate("/AdminManageBlogs");
  }


    return (
        <div className={styles.dashboard}>
          <h1 className={styles.header}>Welcome to the Admin Dashboard</h1>
          <div className={styles.cardsContainer}>
            <div className={styles.card} onClick={moveSchedule} >  
                <h1 className={styles.cardTitle}>Schedules</h1>
                <p>Manage schedules and Update </p>
            </div>
            <div className={styles.card}>
                <h1 className={styles.cardTitle}>Speaker Profiles </h1>
                <p>Manage Speakers Profiles </p>
                </div>
            <div className={styles.card}>
                <h1 className={styles.cardTitle}>Ticketing Information</h1>
                <p>Manage all the tickets</p>
                </div>
            <div className={styles.card}>
                <h1 className={styles.cardTitle} onClick={moveBlogs}>Blog Posts</h1>
                <p>Manage and Update Blog Post</p>
                </div>
            <div className={styles.card}>
                <h1 className={styles.cardTitle}>On-Demand Videos</h1>
                <p>Upload and Manage On-Demand Videos</p>
                </div>
            <div className={styles.card}>
                <h1 className={styles.cardTitle}>User Details</h1>
                <p>Manage Users</p>
                </div>
          </div>
          <button className={styles.button} onClick={handleLogout} >
            LogOut
          </button>
        </div>
      );

}

export default AdminDashboard