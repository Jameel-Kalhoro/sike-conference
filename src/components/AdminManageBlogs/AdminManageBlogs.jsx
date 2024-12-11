import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../AdminManageSchedules/AdminManageSchedules.module.css";
import { useNavigate } from "react-router-dom";

const AdminManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    author: "",
    thumbnailPhoto: null,
  });
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    formData.append("author", newBlog.author);
    formData.append("thumbnailPhoto", newBlog.thumbnailPhoto);

    try {
      const response = await axios.post("http://localhost:5000/api/blogs/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setBlogs([...blogs, response.data]);
      setNewBlog({
        title: "",
        content: "",
        author: "",
        thumbnailPhoto: null,
      });
    } catch (error) {
      setError("Error creating blog.");
      console.error(error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog) {
      setError("Please select a blog to delete.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${selectedBlog}`);
      setBlogs(blogs.filter((blog) => blog.id !== selectedBlog));
      setSelectedBlog(null);
    } catch (error) {
      setError("Error deleting blog.");
      console.error(error);
    }
  };

  const handleUpdateBlog = async () => {
    if (!selectedBlog) {
      setError("Please select a blog to update.");
      return;
    }

    navigate(`/AdminUpdateBlog/${selectedBlog}`);
  };

  const handleBlogSelect = (blogId) => {
    const blog = blogs.find((b) => b.id === blogId);
    if (blog) {
      setSelectedBlog(blogId);
    }
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setNewBlog({
      title: "",
      content: "",
      author: "",
      thumbnailPhoto: null,
    });
    setError("");
  };

  return (
    <div className={styles.container}>
      <h1>Admin Manage Blogs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.createSection}>
        <h2>Create Blog</h2>
        <form onSubmit={handleCreateBlog}>
          <input
            type="text"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            placeholder="Title"
            required
          />
          <textarea
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            placeholder="Content"
            required
          ></textarea>
          <input
            type="text"
            value={newBlog.author}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
            placeholder="Author"
            required
          />
          <input
            type="file"
            onChange={(e) => setNewBlog({ ...newBlog, thumbnailPhoto: e.target.files[0] })}
          />
          <button type="submit">Create Blog</button>
        </form>
      </div>

      <div className={styles.manageSection}>
        <h2>Manage Blogs</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs"
        />
        <ul>
          {blogs
            .filter((blog) =>
              blog.title?.toLowerCase()?.includes(searchTerm.toLowerCase())
            )
            .map((blog) => (
              <li key={blog.id}>
                <input
                  type="radio"
                  name="blog"
                  value={blog.id}
                  checked={selectedBlog === blog.id}
                  onChange={() => handleBlogSelect(blog.id)}
                />
                {blog.title}
              </li>
            ))}
        </ul>

        <button onClick={handleDeleteBlog}>Delete Selected Blog</button>
        <button onClick={handleUpdateBlog}>Update Selected Blog</button>
        <button onClick={resetForm}>Cancel</button>
      </div>
    </div>
  );
};

export default AdminManageBlogs;
