import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminManageSchedules.module.css";
import { useNavigate } from "react-router-dom";

const AdminManageSchedules = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    eventIntroduction: "",
    description: "",
    speakers: "",
    title: "",
    sessionLink: "",
    thumbnailPhoto: null,
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sessions")
      .then((response) => setSessions(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Check if the admin is authenticated on page load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // Redirect to login if no token is found
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("eventIntroduction", newSession.eventIntroduction);
    formData.append("description", newSession.description);
    formData.append("speakers", newSession.speakers);
    formData.append("title", newSession.title);
    formData.append("sessionLink", newSession.sessionLink);
    formData.append("thumbnailPhoto", newSession.thumbnailPhoto); // No need for [0]
  
    try {
      const response = await axios.post("http://localhost:5000/api/sessions/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSessions([...sessions, response.data]);
      setNewSession({
        eventIntroduction: "",
        description: "",
        speakers: "",
        title: "",
        sessionLink: "",
        thumbnailPhoto: null,
      });
    } catch (error) {
      setError("Error creating session.");
      console.error(error);
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) {
      setError("Please select a session to delete.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/sessions/${selectedSession}`);
      setSessions(sessions.filter((session) => session.id !== selectedSession));
      setSelectedSession(null);
    } catch (error) {
      setError("Error deleting session.");
      console.error(error);
    }
  };

  const handleUpdateSession = async () => {
    if (!selectedSession) {
      setError("Please select a session to update.");
      return;
    }
  
    navigate(`/AdminUpdateSession/${selectedSession}`);
  };
  


  const handleSessionSelect = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSelectedSession(sessionId);
    }
  };
  

  const resetForm = () => {
    setSelectedSession(null);
    setNewSession({
      eventIntroduction: "",
      description: "",
      speakers: "",
      title: "",
      sessionLink: "",
      thumbnailPhoto: null,
    });
    setError("");
  };

  return (
    <div className={styles.container}>
      <h1>Admin Manage Schedules</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.createSection}>
        <h2>Create Session</h2>
        <form
          onSubmit={handleCreateSession}
        >
          <input
            type="text"
            value={newSession.eventIntroduction}
            onChange={(e) =>
              setNewSession({ ...newSession, eventIntroduction: e.target.value })
            }
            placeholder="Event Introduction"
            required
          />
          <input
            type="text"
            value={newSession.description}
            onChange={(e) =>
              setNewSession({ ...newSession, description: e.target.value })
            }
            placeholder="Description"
            required
          />
          <input
            type="text"
            value={newSession.speakers}
            onChange={(e) =>
              setNewSession({ ...newSession, speakers: e.target.value })
            }
            placeholder="Speakers"
            required
          />
          <input
            type="text"
            value={newSession.title}
            onChange={(e) =>
              setNewSession({ ...newSession, title: e.target.value })
            }
            placeholder="Title"
            required
          />
          <input
            type="text"
            value={newSession.sessionLink}
            onChange={(e) =>
              setNewSession({ ...newSession, sessionLink: e.target.value })
            }
            placeholder="Session Link"
            required
          />
          <input
            type="file"
            onChange={(e) =>
              setNewSession({ ...newSession, thumbnailPhoto: e.target.files[0] })
            }
            required={!selectedSession}
          />
          <button type="submit">
            Create Session
          </button>
        </form>
      </div>

      <div className={styles.manageSection}>
        <h2>Manage Sessions</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sessions"
        />
        <ul>
          {sessions
            .filter((session) =>
              session.title?.toLowerCase()?.includes(searchTerm.toLowerCase())
            )
            .map((session) => (
              <li key={session.id}>
                <input
                  type="radio"
                  name="session"
                  value={session.id}
                  checked={selectedSession === session.id}
                  onChange={() => handleSessionSelect(session.id)}
                />
                {session.title}
              </li>
            ))}
        </ul>

        <button onClick={handleDeleteSession}>Delete Selected Session</button>
        <button onClick={handleUpdateSession}>Update Selected Session</button>
        <button onClick={resetForm}>Cancel</button>
      </div>
    </div>
  );
};

export default AdminManageSchedules;
