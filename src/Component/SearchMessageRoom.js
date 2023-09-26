import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchMessageRoom() {
  return (
    <div className="search-bar">
      <FontAwesomeIcon className="icon" icon={faSearch} />
      <input type="text" placeholder="Find a conversation" />
      <FontAwesomeIcon className="icon" icon={faFilter} />
    </div>
  );
}

export default SearchMessageRoom;
