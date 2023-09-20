import React from "react";
import { useNavigate } from "react-router-dom";



const cardStyle = {
  border: "2px solid #007777",
  borderRadius: "15px !important", // Added !important to enforce the border radius
  width: "280px",
  height: "400px",
  margin: "10px",
  padding: "15px",
  textAlign: "center",
  background: "#005555",
  color: "#ffffff",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};


const imageContainerStyle = {
  height: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  overflow: "hidden",
  background: "#007777",
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "cover",
  borderRadius: "50%",
};

const cardHoverStyle = {
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  transform: "translateY(-5px)",
};

const titleStyle = {
  fontSize: "1.5rem",
  marginBottom: "10px",
};

const infoStyle = {
  marginTop: "auto", // Move the info section to the bottom
  background: "#007777", // Change background color to that of the text
  padding: "10px",
  borderRadius: "0 0 15px 15px",
};

function Doctor({ doctor }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book-appointment/${doctor._id}`);
  };

  return (
    <div
      className="card"
      style={{ ...cardStyle, ...cardHoverStyle, borderRadius: "15px !important" }}
      onClick={handleCardClick}
    >
      <div style={imageContainerStyle}>
        <img
          src={doctor.photo}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          style={imageStyle}
        />
      </div>
      <div>
        <h1 className="card-title" style={titleStyle}>
          {doctor.firstName} {doctor.lastName}
        </h1>
        <div style={infoStyle}>
          <p>
            <b>Phone Number:</b>{" "}
            <span style={{ color: "#ffffff" }}>{doctor.phoneNumber}</span>
          </p>
          <p>
            <b>Fee per Visit:</b>{" "}
            <span style={{ color: "#ffffff" }}>{doctor.feePerCunsultation}</span>
          </p>
          <p>
            <b>Timings:</b>{" "}
            <span style={{ color: "#ffffff" }}>
              {doctor.timings[0]} - {doctor.timings[1]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Doctor;


