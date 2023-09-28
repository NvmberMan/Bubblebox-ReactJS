import React from "react";
import { hit_logout } from "../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
function Profil(props) {
    let win = sessionStorage;


  function logoutHandler() {
    hit_logout(win.getItem("token"))
      .then(() => {
        win.removeItem("token");
        window.location = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="profil-bar">
      <img
        className="profil-display"
        src={props.webData.user_image}
        alt="server"
      />
      <div className="profil-data">
        <p className="username">{props.webData.user_name}</p>
        <p className="description">Do not disturb</p>
      </div>
      <FontAwesomeIcon
        onClick={logoutHandler}
        className="icon"
        icon={faEllipsisV}
      />
    </div>
  );
}

export default Profil;
