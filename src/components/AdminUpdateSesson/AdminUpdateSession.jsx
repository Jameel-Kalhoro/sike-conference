import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../AdminManageSchedules/AdminManageSchedules.module.css";

const AdminUpdateSession = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState({
    eventIntroduction: "",
    description: "",
    speakers: "",
    title: "",
    sessionLink: "",
    thumbnailPhoto: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // Redirect to login if no token is found
      navigate("/AdminLogin");
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sessions/${sessionId}`)
      .then((response) => {
        setSessionData(response.data);
      })
      .catch((error) => {
        setError("Error fetching session data.");
        console.error(error);
      });
  }, [sessionId]);

  const handleUpdateSession = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventIntroduction", sessionData.eventIntroduction);
    formData.append("description", sessionData.description);
    formData.append("speakers", sessionData.speakers);
    formData.append("title", sessionData.title);
    formData.append("sessionLink", sessionData.sessionLink);
    if (sessionData.thumbnailPhoto instanceof File) {
      formData.append("thumbnailPhoto", sessionData.thumbnailPhoto);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/sessions/${sessionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/AdminManageSchedules"); // Redirect back to manage schedules
    } catch (error) {
      setError("Error updating session.");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.createSection}>
      <h1>Update Session</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleUpdateSession}>
        <input
          type="text"
          value={sessionData.eventIntroduction}
          onChange={(e) =>
            setSessionData({
              ...sessionData,
              eventIntroduction: e.target.value,
            })
          }
          placeholder="Event Introduction"
          required
        />
        <input
          type="text"
          value={sessionData.description}
          onChange={(e) =>
            setSessionData({ ...sessionData, description: e.target.value })
          }
          placeholder="Description"
          required
        />
        <input
          type="text"
          value={sessionData.speakers}
          onChange={(e) =>
            setSessionData({ ...sessionData, speakers: e.target.value })
          }
          placeholder="Speakers"
          required
        />
        <input
          type="text"
          value={sessionData.title}
          onChange={(e) =>
            setSessionData({ ...sessionData, title: e.target.value })
          }
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={sessionData.sessionLink}
          onChange={(e) =>
            setSessionData({ ...sessionData, sessionLink: e.target.value })
          }
          placeholder="Session Link"
          required
        />
        {sessionData.thumbnailPhoto && typeof sessionData.thumbnailPhoto === "string" && (
          <img
            src={sessionData.thumbnailPhoto}
            alt="Thumbnail"
            style={{ maxWidth: "100%", height: "auto", marginBottom: "1rem" }}
          />
        )}
        <input
          type="file"
          onChange={(e) =>
            setSessionData({ ...sessionData, thumbnailPhoto: e.target.files[0] })
          }
        />
        <button type="submit">Update Session</button>
      </form>
    </div>
    </div>
  );
};

export default AdminUpdateSession;
