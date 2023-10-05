import React from "react";

function Header(props) {
  return (
    <div>
      <div className="top-bar">
        <div className="server-name">BUBBLEBOX</div>
        <div className="server-description">Big Server In the world</div>
      </div>
      {/* --------absolute--------- */}
      <div className="server-top">
        <div onClick={props.OpenChoosen} className="earth"></div>
        <div  className="discover"></div>
      </div>
    </div>
  );
}

export default Header;
