import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle as faError,
  faCheckCircle as faCheck,
} from "@fortawesome/free-solid-svg-icons";
function Notification(props) {
  return (
    <div className="notification-container">
      <div
        className={`notification error ${
          props.toaster.type === "Error" ? "" : "hidden"
        }`}
      >
        <FontAwesomeIcon className="exit icon" icon={faError} />
        <h1>{props.toaster.message}</h1>
        <div className="loading"></div>
      </div>

      <div
        className={`notification success ${
          props.toaster.type === "Success" ? "" : "hidden"
        }`}
      >
        <FontAwesomeIcon className="exit icon" icon={faCheck} />
        <h1>{props.toaster.message}</h1>
        <div className="loading"></div>
      </div>
      
      <div className={`notification success server_message ${props.messageServerNotification.title !== "" ? "" : "hidden"}`}>
        <img src={props.messageServerNotification.image} alt="" />
        <div className="data">
          <h1>{props.messageServerNotification.title}</h1>
          <p><span>{props.messageServerNotification.username} : </span> {props.messageServerNotification.message}</p>
        </div>
        <div className="loading"></div>
      </div>
    </div>
  );
}

export default Notification;
