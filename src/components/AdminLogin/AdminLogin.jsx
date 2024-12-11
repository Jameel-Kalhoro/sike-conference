import React, { useState } from "react"
import styles from './AdminLogin.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = ()=>{
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          // Make API call for admin login
          const response = await axios.post("http://localhost:5000/admin/login", {
            email,
            password,
          });
    
          // On success, store token in localStorage
          const token = response.data.token;
          localStorage.setItem("adminToken", token);
    
          // Redirect to /AdminDashboard
          navigate("/AdminDashboard");
        } catch (err) {
          // Handle errors
          setError(err.response?.data?.error || "Login failed. Please try again.");
        }
      };


    return (
        <div className={styles.superContainer}>
        <div className={styles.formContainer}>
          <h1>Admin Login</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.container}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                id="email"
                className={styles.input}
                required
              />
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
            </div>
            <div className={styles.container}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className={styles.input}
                required
              />
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <button type="submit" className={styles.submitButton}>
              Login
            </button>
            </div>
          </form>
        </div>
        </div>
      );

}

export default AdminLogin