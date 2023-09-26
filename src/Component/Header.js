import React from "react";

function Header(props) {
  return (
    <div>
      <div className="top-bar">
        <div className="server-name">BUBBLEBOX</div>
        <div className="server-description">Lorem ipsum dolor sit</div>
      </div>
      {/* --------absolute--------- */}
      <div className="server-top">
        <div className="earth"></div>
        <div onClick={props.OpenChoosen} className="discover"></div>
      </div>
    </div>
  );
}

export default Header;
