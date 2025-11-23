import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = (props) => {
  return (
    <div className="search-bar">
      <FaSearch className="text-gray-400 text-lg" />
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
