import React, { useEffect, useState } from "react";
import bunny from "../Assets/Img/Application/bunny-ballon2.png";
import { hit_register } from "../Api";
import { useNavigate } from "react-router-dom";

function Register() {
  let win = sessionStorage;
  const navigate = useNavigate();
  const [Username, SetUsername] = useState("");
  const [Password, SetPassword] = useState("");
  const [RePassword, SetRePassword] = useState("");
  const [ChekBox, SetCheckBox] = useState(false);
  const [Email, SetEmail] = useState("");
  const [AlertError, SetAlertError] = useState("");

  const SignUpButton = (e) => {
    e.preventDefault();

    hit_register(Username, Email, Password, RePassword, ChekBox)
      .then((data) => {
        navigate("/")

      })
      .catch((err) => {
        SetAlertError(err.response.data.message);
      });
  };

  const handleCheckBoxChange = (e) => {
    SetCheckBox(e.target.checked);
  };

  useEffect(() => {
    if (win.getItem("token")) {
      window.location = "/";
    }
  }, [win]);

  return (
    <div>
      <div className="content">
        <div className="container auth-page register-page">
          <img src={bunny} alt="" />
          <form onSubmit={SignUpButton}>
            <div className="title">
              <h1>Create an account</h1>
              <p>We’re so excited to see you again!</p>
            </div>
            {AlertError !== "" ? (
              <div className="alert-form success">
                <p>{AlertError}</p>
              </div>
            ) : (
              <div></div>
            )}
            <div className="input-form">
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                id="username"
                onChange={(e) => SetUsername(e.target.value)}
                value={Username}
              />
            </div>
            <div className="input-form">
              <label htmlFor="email">EMAIL</label>
              <input
                onChange={(e) => SetEmail(e.target.value)}
                type="email"
                id="email"
                value={Email}
              />
            </div>
            <div className="input-form">
              <label htmlFor="password">PASSWORD</label>
              <input
                onChange={(e) => SetPassword(e.target.value)}
                type="password"
                id="password"
                value={Password}
              />
            </div>
            <div className="input-form">
              <label htmlFor="re-password">RE-PASSWORD</label>
              <input
                onChange={(e) => SetRePassword(e.target.value)}
                type="password"
                id="re-password"
                value={RePassword}
              />
            </div>
            <div className="input-form input-check">
              <input
                id="police"
                type="checkbox"
                checked={ChekBox}
                onChange={handleCheckBoxChange}
              />
              <label htmlFor="police">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente omnis explicabo,{" "}
              </label>
            </div>

            <div className="input-form button">
              <button type="submit">Sign Up</button>
              <p>
                Have Account? <a href="/login">Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
