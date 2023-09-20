// DoctorSearchBar.js

import React from "react";
import "./DoctorSearchBar.css"; // Import the CSS file

function DoctorSearchBar({ searchQuery, setSearchQuery, handleSearch }) {
    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input" // Apply a CSS class to the input
            />
            <button onClick={handleSearch} className="search-button">
                Search
            </button>
        </div>
    );
}

export default DoctorSearchBar;
