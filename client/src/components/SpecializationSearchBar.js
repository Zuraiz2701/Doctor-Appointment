// DoctorSearchBar.js

import React from "react";
import "./DoctorSearchBar.css"; // Import the CSS file

function SpecializationSearchBar({ specializationQuery, setSpecializationQuery, handleSpecializationSearch }) {
    const handleSpecializationQuery = (e) => {
        setSpecializationQuery(e)
    }
    return (
        <div className="search-bar-container">
            <h6>Specialization</h6>
            <input
                type="text"
                placeholder="Search by specialization"
                value={specializationQuery}
                onChange={(e) => handleSpecializationQuery(e.target.value)}
                className="search-input" />
            {/* <button onClick={handleSpecializationSearch} className="search-button">
                Search
            </button> */}
        </div>
    );
}

export default SpecializationSearchBar;
