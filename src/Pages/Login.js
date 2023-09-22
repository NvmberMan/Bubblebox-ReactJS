import React from "react";
import bunny from "../Assets/Img/Application/bunny-ballon2.png";

function Login() {


    const LoginButton = (e) => {
        e.preventDefault();

        window.location = '/';
    }

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
            <div className="alert-form danger hidden">
                <p>Invalid username or password</p>
            </div>
            <div className="input-form">
              <label htmlFor="email">EMAIL</label>
              <input type="email" id="email" />
            </div>
            <div className="input-form">
              <label htmlFor="password">PASSWORD</label>
              <input type="password" id="password" />
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
