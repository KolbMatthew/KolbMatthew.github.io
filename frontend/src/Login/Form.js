import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./Form.css";

function Form() {
  const navigate = useNavigate();
  
  //signup form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, username, password, confirmEmail, password2 } = inputValues;

    // Simple validation
    if (email !== confirmEmail) {
      alert("Emails do not match!");
      event.preventDefault();
      return;
    }
    if (password !== password2) {
      alert("Passwords do not match!");
      event.preventDefault();
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

    let output = document.getElementById("user-exists");
   
    if (!output) {
      output = document.createElement("h2");
      output.setAttribute("id", "user-exists");
      document.getElementById("sign-up").appendChild(output);
    }

    if (response.ok) {
      const jsonResponse = await response.json();
      output.innerText = jsonResponse.success === 0
      ? "User already registered with this email."
      : "Registration Successful";

      if (jsonResponse.success === 1) {
        setInputValues({
          username: "",
          email: "",
          confirmEmail: "",
          password: "",
          password2: "",
        });
      }
    } else {
      const errorText = await response.text();
      console.error("POST request failed:", response.status, errorText);
      alert(`Error: ${response.status} - ${errorText}`);
    }
  };

  const [activeTab, setActiveTab] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginStatus, setLoginStatus] = useState("");
  const [inputValues, setInputValues] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    password2: "",
  });

  //to differentiate the signup and login email and password fields
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //login form submit
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

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
      const jsonResponse = await response.json();
      setLoginStatus("Logged in!");
      setLoginValues({
        email: "",
        password: "",
      });

      // Redirect to game page
      navigate('/game');
    } else {
      setLoginStatus("Invalid email or password.");
    }
  };

  return (
    <div className="form">
      <ul className="tab-group">
        <li className={`tab ${activeTab === "signup" ? "active" : ""}`}>
          <a href="#signup" onClick={() => handleTabClick("signup")}>
            Sign Up
          </a>
        </li>
        <li className={`tab ${activeTab === "login" ? "active" : ""}`}>
          <a href="#login" onClick={() => handleTabClick("login")}>
            Log In
          </a>
        </li>
      </ul>

      <div className="tab-content">
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
              <div className="eye-container">
                <button
                  type="button"
                  className="eye"
                  onClick={togglePasswordVisibility}
                >
                  <i
                    className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                  ></i>
                </button>
              </div>

              <label className={inputValues.password ? "active highlight" : ""}>
                Password<span className="req">*</span>
              </label>

              <input
                type={showPassword ? "text" : "password"}
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
                type={showPassword ? "text" : "password"}
                name="password2"
                id="password2"
                value={inputValues.password2}
                required
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="button button-block">
              Get Started
            </button>
          </form>
        </div>

        <div
          id="login"
          style={{ display: activeTab === "login" ? "block" : "none" }}
        >
          <h1>Welcome Back!</h1>
          <form id="login-form" onSubmit={handleLoginSubmit}>
            <div className="field-wrap">
              <label className={loginValues.email ? "active highlight" : ""}>
                Email Address<span className="req">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="login-email"
                value={loginValues.email}
                required
                autoComplete="off"
                onChange={handleLoginChange}
              />
            </div>

            <div className="field-wrap">
              <label className={loginValues.password ? "active highlight" : ""}>
                Password<span className="req">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="login-password"
                value={loginValues.password}
                required
                autoComplete="off"
                onChange={handleLoginChange}
              />
            </div>

            <h2>{showLoginStatus}</h2>

            <p className="forgot">
              <a href="#">Forgot Password?</a>
            </p>

            <button className="button button-block">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
