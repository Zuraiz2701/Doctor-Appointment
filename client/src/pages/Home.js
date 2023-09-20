// Home.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import DoctorSearchBar from "../components/DoctorSearchBar";
import "./Home.css"; // Import the CSS file

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedOption, setSelectedOption] = useState("lastName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/user/get-all-approved-doctors", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
          setDoctors(response.data.data);
          setFilteredDoctors(response.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
      }
    };
    getData();
  }, [dispatch]);

  const handleSearch = () => {
    let filteredResults = doctors.filter((doctor) =>
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredResults.sort((a, b) => {
      if (selectedOption === "firstName" || selectedOption === "lastName") {
        return sortOrder === "asc"
          ? a[selectedOption].localeCompare(b[selectedOption])
          : b[selectedOption].localeCompare(a[selectedOption]);
      } else if (selectedOption === "feePerCunsultation") {
        // Sort by feePerConsultation
        return sortOrder === "asc"
          ? a[selectedOption] - b[selectedOption]
          : b[selectedOption] - a[selectedOption];
      }
      return 0; // No sorting for other attributes
    });

    setFilteredDoctors(filteredResults);
  };

  const handleSort = (option) => {
    if (option === selectedOption) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSelectedOption(option);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedOption, sortOrder]);

  const getSortLabel = (option) => {
    if (option === selectedOption) {
      return sortOrder === "asc" ? "Ascending" : "Descending";
    }
    return "";
  };

  return (
    <Layout>
      <div className="top-container">
        <DoctorSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <div className="button-container">
          <button onClick={() => handleSort("firstName")} className="sort-button">
            Sort by First Name {getSortLabel("firstName")}
          </button>
          <button onClick={() => handleSort("lastName")} className="sort-button">
            Sort by Last Name {getSortLabel("lastName")}
          </button>
          <button
            onClick={() => handleSort("feePerCunsultation")}
            className="sort-button"
          >
            Sort by Fee Per Consultation {getSortLabel("feePerCunsultation")}
          </button>
        </div>
      </div>
      <Row gutter={20}>
        {filteredDoctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8} key={doctor._id}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;




//import React, { useEffect, useState } from "react";
//import axios from "axios";
//import Layout from "../components/Layout";
//import { Col, Row } from "antd";
//import Doctor from "../components/Doctor";
//import { useDispatch } from "react-redux";
//import { showLoading, hideLoading } from "../redux/alertsSlice";
//
//function Home() {
//  const [doctors, setDoctors] = useState([]);
//  const dispatch = useDispatch();
//
//  useEffect(() => {
//    const getData = async () => {
//      try {
//        dispatch(showLoading());
//        const response = await axios.get("/api/user/get-all-approved-doctors", {
//          headers: {
//            Authorization: "Bearer " + localStorage.getItem("token"),
//          },
//        });
//        dispatch(hideLoading());
//        if (response.data.success) {
//          setDoctors(response.data.data);
//        }
//      } catch (error) {
//        dispatch(hideLoading());
//        console.log(error);
//      }
//    };
//    getData();
//  }, [dispatch]);
//
//  return (
//    <Layout>
//      <Row gutter={20}>
//        {doctors.map((doctor) => (
//          <Col span={8} xs={24} sm={24} lg={8} key={doctor._id}>
//            {/* Pass the doctor data to the Doctor component */}
//
//            <Doctor doctor={doctor} />
//          </Col>
//        ))}
//      </Row>
//    </Layout>
//  );
//}
//
//export default Home;
//