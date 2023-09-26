import React, { useEffect, useState } from "react";

function ServerRoom(props) {
  let win = sessionStorage;


  
  return (
    <div className="room-bar">
      <div className="server-list" id="server-list">
        {props.serverData.map((row, index) => {

          if(!win.getItem("selected-server"))
          {
            win.setItem("selected-server", row._id);
            props.SelectServer(row._id);
          }else
          {
            if(row._id === win.getItem("selected-server"))
            {
              props.SelectServer(row._id)
            }
          }

          return (
            <div
              className="server-item unselected"
              onContextMenu={(e) => props.HandleRightServerDetail(e, row)}
              onClick={() => props.SelectServer(row._id)}
              key={index}
              id={`server-` + row._id}
            >
              <div className="bubble">
                <img src={row.image_url} alt="" className="server-display" />
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
