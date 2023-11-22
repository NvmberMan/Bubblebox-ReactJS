import React from "react";
import { apiURL } from "../Api";

function ServerRoom(props) {
  // let win = sessionStorage;

  
  
  return (
    <div className="room-bar">
      <div className="server-list" id="server-list">
        {props.webData.server_data.map((row, index) => {
          return (
            <div
              className={"server-item unselected "}
              onContextMenu={(e) => props.HandleRightServerDetail(e, row)}
              onClick={() => props.SelectServer(row._id)}
              key={index}
              id={`server-` + row._id}
            >
              <div className={`unreaded-count ${row.unReadedCount > 0 ? "" : "hidden"}`}>{row.unReadedCount}</div>
              <div className="bubble">
                <img src={`${apiURL}/server/display/${row.image_url}`} alt="" className="server-display" />
                <div className="server-data">
                  <h1>{row.name}</h1>
                  <p>{row.description}</p>
                </div>
              </div>
              <div className="selected-area"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServerRoom;
