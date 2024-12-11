const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");

const SECRET_KEY = "SikeConference";


const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost', // Hostname or IP (e.g., your cloud instance)
  database: 'sike_conference', // Database name
  password: 'postgres', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPEG or PNG files are allowed'), false);
      }
      cb(null, true);
    }
  });


// Seed Admin (Run once to create the admin account)
app.post('/seed-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *`;
    const values = [email, hashedPassword];
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Admin seeded successfully', admin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Admin Login Route
app.post('/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const query = `SELECT * FROM admins WHERE email = $1`;
      const result = await pool.query(query, [email]);
  
      if (result.rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
  
      const admin = result.rows[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      // Generate JWT
      const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Middleware for Authorization
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.admin = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };

  

  // Get all sessions
app.get("/api/sessions", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM sessions");
      res.json(result.rows);
    } catch (error) {
      console.error("Error retrieving sessions:", error);
      res.status(500).send("Error retrieving sessions");
    }
  });

  // Create a session
    app.post("/api/sessions/create", upload.single("thumbnailPhoto"), async (req, res) => {
    const { eventIntroduction, description, speakers, title, sessionLink } = req.body;
    const thumbnailPhoto = req.file.buffer;
  
    try {
      const result = await pool.query(
        "INSERT INTO sessions(event_introduction, description, speakers, title, session_link, thumbnail_photo) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [eventIntroduction, description, speakers, title, sessionLink, thumbnailPhoto]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).send("Error creating session");
    }
  });

  app.put("/api/sessions/:id", upload.single("thumbnailPhoto"), async (req, res) => {
    const { id } = req.params;
    const { eventIntroduction, description, speakers, title, sessionLink } = req.body;
    const thumbnailPhoto = req.file ? req.file.buffer : null;
  
    try {
      const query = `
        UPDATE sessions
        SET event_introduction = $1,
            description = $2,
            speakers = $3,
            title = $4,
            session_link = $5,
            thumbnail_photo = COALESCE($6, thumbnail_photo)
        WHERE id = $7
        RETURNING *;
      `;
      const values = [eventIntroduction, description, speakers, title, sessionLink, thumbnailPhoto, id];
      const result = await pool.query(query, values);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).send("Error updating session");
    }
  });
  
  app.get("/api/sessions/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = `
        SELECT id, event_introduction, description, speakers, title, session_link, thumbnail_photo
        FROM sessions
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }
  
      const session = result.rows[0];
  
      // Decode image bytes to Base64 format if an image exists
      const thumbnailPhotoBase64 = session.thumbnail_photo
        ? `data:image/jpeg;base64,${session.thumbnail_photo.toString("base64")}`
        : null;
  
      // Return session data with Base64 image
      res.status(200).json({
        id: session.id,
        eventIntroduction: session.event_introduction,
        description: session.description,
        speakers: session.speakers,
        title: session.title,
        sessionLink: session.session_link,
        thumbnailPhoto: thumbnailPhotoBase64,
      });
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).send("Error fetching session");
    }
  });
  
  

  // Delete a session
app.delete("/api/sessions/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM sessions WHERE id = $1 RETURNING *", [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).send("Session not found");
      }
  
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).send("Error deleting session");
    }
  });
  


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
