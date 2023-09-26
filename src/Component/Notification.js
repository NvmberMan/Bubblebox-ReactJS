import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle as faError,
  faCheckCircle as faCheck,
} from "@fortawesome/free-solid-svg-icons";
function Notification(props) {
  return (
    <div className="notification-container">
      <div className={`notification error ${props.Toaster.type === "Error" ? "" : "hidden"}`}>
        <FontAwesomeIcon className="exit icon" icon={faError} />
        <h1>{props.Toaster.message}</h1>
        <div className="loading"></div>
      </div>

      <div className={`notification success ${props.Toaster.type === "Success" ? "" : "hidden"}`}>
        <FontAwesomeIcon className="exit icon" icon={faCheck} />
        <h1>{props.Toaster.message}</h1>
        <div className="loading"></div>
      </div>
    </div>
  );
}

export default Notification;
