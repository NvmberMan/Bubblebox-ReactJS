import React, { useEffect, useState } from "react";
import bunny from "../Assets/Img/Application/bunny-ballon2.png";
import { hit_login } from "../Api";
import { useNavigate } from "react-router-dom";

function Login() {
  let win = sessionStorage;
  const [Password, SetPassword] = useState("");
  const [Email, SetEmail] = useState("");
  const [AlertError, SetAlertError] = useState("");
  const navigate = useNavigate();

  const LoginButton = (e) => {
    e.preventDefault();

    hit_login(Email, Password)
      .then((data) => {
        win.setItem("token", data.data.token);

        navigate("/")

      })
      .catch((err) => {
        console.log(err.response);
        SetAlertError(err.response.data.message);
        console.log(AlertError)
      });

  };


  useEffect(() => {
    if (win.getItem("token")) {
      window.location = "/";
      
    }
  }, [win]);

  return (
    <div>
      <div className="content">
        <div className="container auth-page login-page">
          <img src={bunny} alt="" />
          <form onSubmit={LoginButton}>
            <div className="title">
              <h1>Welcome Back!</h1>
              <p>We’re so excited to see you again!</p>
            </div>
            {AlertError !== "" ? (
              <div className="alert-form success">
                <p>{AlertError}</p>
              </div>
            ) : (
              <div></div>
            )}
            <div className="alert-form danger hidden">
              <p>Invalid username or password</p>
            </div>
            <div className="input-form">
              <label htmlFor="email">EMAIL</label>
              <input
                onChange={(e) => SetEmail(e.target.value)}
                type="email"
                id="email"
              />
            </div>
            <div className="input-form">
              <label htmlFor="password">PASSWORD</label>
              <input
                onChange={(e) => SetPassword(e.target.value)}
                type="password"
                id="password"
              />
            </div>
            <a href="/">Reset Password?</a>
            <div className="input-form button">
              <button type="submit">Log In</button>
              <p>
                Need Account? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
