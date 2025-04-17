import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");

  const [activeForm, setActiveForm] = useState(null); // Track which form is active
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInput = () => {
    if (activeForm === "username" && (!formData.username || formData.username.trim().length < 3)) {
      setMessage("Username must be at least 3 characters long.");
      return false;
    }

    if (
      activeForm === "email" &&
      (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    ) {
      setMessage("Please enter a valid email address.");
      return false;
    }

    if (activeForm === "password") {
      if (!formData.password || formData.password.length < 6) {
        setMessage("Password must be at least 6 characters long.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match!");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userID: userID,
          username: activeForm === "username" ? formData.username : undefined,
          email: activeForm === "email" ? formData.email : undefined,
          password: activeForm === "password" ? formData.password : undefined,
        }),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setActiveForm(null);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setMessage("An error occurred while updating your profile.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-menu">
        <button className="button" onClick={() => setActiveForm("username")}>
          Change Username
        </button>
        <button className="button" onClick={() => setActiveForm("email")}>
          Change Email
        </button>
        <button className="button" onClick={() => setActiveForm("password")}>
          Change Password
        </button>
      </div>
      {activeForm && (
        <form className="profile-form" onSubmit={handleSubmit}>
          {activeForm === "username" && (
            <div className="field-wrap">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter new username"
              />
            </div>
          )}
          {activeForm === "email" && (
            <div className="field-wrap">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter new email"
              />
            </div>
          )}
          {activeForm === "password" && (
            <>
              <div className="field-wrap">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="field-wrap">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}
          <button type="submit" className="button button-block">
            Update {activeForm.charAt(0).toUpperCase() + activeForm.slice(1)}
          </button>
          <button
            type="button"
            className="button button-block cancel-button"
            onClick={() => setActiveForm(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
      <div className="bottom-left-container">
        <button className="button" onClick={() => navigate("/landing")}>
          Return to Home Page
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;