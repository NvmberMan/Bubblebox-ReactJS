import React from "react";
import { apiURL, hit_logout } from "../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
function Profil(props) {


  return (
    <div className="profil-bar">
      {props.webData.user_image && (
        <img
          className="profil-display"
          src={apiURL + "/user/profil/" + props.webData.user_image + `?v=${props.webData.user_image_key}`}
          key={props.webData.user_image_key}
          alt="server"
        />
      )}
      <div className="profil-data">
        <p className="username">{props.webData.user_name}</p>
        <p className="description">Do not disturb</p>
      </div>
      <FontAwesomeIcon
        onClick={props.HandleLeftUser}
        className="icon"
        icon={faEllipsisV}
      />
    </div>
  );
}

export default Profil;
