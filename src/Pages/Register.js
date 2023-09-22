import React from "react";
import bunny from "../Assets/Img/Application/bunny-ballon2.png";

function Register() {

  const SignUpButton = (e) => {
    e.preventDefault();

    window.location = '/';
}

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
            <div className="input-form">
              <label htmlFor="username">USERNAME</label>
              <input type="text" id="username" />
            </div>
            <div className="input-form">
              <label htmlFor="email">EMAIL</label>
              <input type="email" id="email" />
            </div>
            <div className="input-form">
              <label htmlFor="password">PASSWORD</label>
              <input type="password" id="password" />
            </div>
            <div className="input-form">
              <label htmlFor="re-password">RE-PASSWORD</label>
              <input type="password" id="re-password" />
            </div>
            <div className="input-form input-check">
              <input id="police" type="checkbox" />
              <label htmlFor="police">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente omnis explicabo, </label>
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
