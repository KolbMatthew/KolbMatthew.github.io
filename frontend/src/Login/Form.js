import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import "../styles/global.css";

function Form() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, username, password, confirmEmail, password2 } = inputValues;

    if (email !== confirmEmail) {
      alert("Emails do not match!");
      return;
    }
    if (password !== password2) {
      alert("Passwords do not match!");
      return;
    }

    const urlData = new URLSearchParams();
    urlData.append("email", email);
    urlData.append("username", username);
    urlData.append("password", password);

    const response = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlData,
    });

    const responseText = await response.text();
    if (response.ok) {
      alert("Registration successful!");
      setInputValues({
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        password2: "",
      });
      navigate("/login");
    } else {
      alert(`Error: ${responseText}`);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = inputValues;

    const urlData = new URLSearchParams();
    urlData.append("email", email);
    urlData.append("password", password);

    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlData,
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("userID", user.id); // Save userID to local storage
      navigate("/landing");
    } else {
      const responseText = await response.text();
      alert(`Error: ${responseText}`);
    }
  };

  const [activeTab, setActiveTab] = useState("signup");
  const [inputValues, setInputValues] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    password2: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="form border-style">
      <ul className="tab-group">
        <li className={`tab ${activeTab === "signup" ? "active" : ""}`}>
          <button
            className="button"
            onClick={() => handleTabClick("signup")}
          >
            Sign Up
          </button>
        </li>
        <li className={`tab ${activeTab === "login" ? "active" : ""}`}>
          <button
            className="button"
            onClick={() => handleTabClick("login")}
          >
            Log In
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Sign Up Tab */}
        <div
          id="signup"
          style={{ display: activeTab === "signup" ? "block" : "none" }}
        >
          <h1>Sign Up for Free.</h1>
          <form id="sign-up" onSubmit={handleSubmit}>
            <div className="field-wrap">
              <label className={inputValues.username ? "active highlight" : ""}>
                Username<span className="req">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={inputValues.username}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-wrap">
              <label className={inputValues.email ? "active highlight" : ""}>
                Email Address<span className="req">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={inputValues.email}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-wrap">
              <label
                className={inputValues.confirmEmail ? "active highlight" : ""}
              >
                Confirm Email Address<span className="req">*</span>
              </label>
              <input
                type="email"
                name="confirmEmail"
                id="confirmEmail"
                value={inputValues.confirmEmail}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-wrap">
              <label className={inputValues.password ? "active highlight" : ""}>
                Password<span className="req">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={inputValues.password}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-wrap">
              <label
                className={inputValues.password2 ? "active highlight" : ""}
              >
                Confirm Password<span className="req">*</span>
              </label>
              <input
                type="password"
                name="password2"
                id="password2"
                value={inputValues.password2}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="button button-block">
              Sign Up
            </button>
          </form>
        </div>

        {/* Log In Tab */}
        <div
          id="login"
          style={{ display: activeTab === "login" ? "block" : "none" }}
        >
          <h1>Welcome Back!</h1>
          <form id="log-in" onSubmit={handleLoginSubmit}>
            <div className="field-wrap">
              <label className={inputValues.email ? "active highlight" : ""}>
                Email Address<span className="req">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={inputValues.email}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-wrap">
              <label className={inputValues.password ? "active highlight" : ""}>
                Password<span className="req">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={inputValues.password}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="button button-block">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;