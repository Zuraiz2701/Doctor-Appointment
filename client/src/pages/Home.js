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
import SpecializationSearchBar from "../components/SpecializationSearchBar";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedOption, setSelectedOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationQuery, setSpecializationQuery] = useState("");

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

  const applyFilters = () => {
    let filteredResults = doctors.filter((doctor) => {
      const fullName = `${doctor.firstName} ${doctor.lastName}`;
      const specialization = `${doctor.specialization}`;

      return (
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        specialization.toLowerCase().includes(specializationQuery.toLowerCase())
      );
    });

    filteredResults.sort((a, b) => {
      if (selectedOption === "name") {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (selectedOption === "feePerCunsultation") {
        return sortOrder === "asc"
          ? a[selectedOption] - b[selectedOption]
          : b[selectedOption] - a[selectedOption];
      } else if (selectedOption === "experience") {
        return sortOrder === "asc" ? a[selectedOption] - b[selectedOption] : b[selectedOption] - a[selectedOption];
      }
      return 0;
    });

    setFilteredDoctors(filteredResults);
  };

  const handleSpecializationSearch = () => {
    applyFilters();
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleSort = (option) => {
    if (option === selectedOption) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSelectedOption(option);
      setSortOrder("asc");
    }

    applyFilters();
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedOption, sortOrder, specializationQuery]);

  const getSortLabel = (option) => {
    if (option === selectedOption) {
      return sortOrder === "asc" ? "Ascending" : "Descending";
    }
    return "";
  };
  return (
    <Layout>
      <div className="top-container">
        <div className="search-bars-container">
          <DoctorSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          <SpecializationSearchBar
            specializationQuery={specializationQuery}
            setSpecializationQuery={setSpecializationQuery}
            handleSearch={handleSpecializationSearch}
          />
        </div>
        <div className="button-container">
          <button onClick={() => handleSort("name")} className="sort-button">
            Sort by Name {getSortLabel("name")}
          </button>
          <button onClick={() => handleSort("feePerCunsultation")} className="sort-button">
            Sort by Fee Per Consultation {getSortLabel("feePerCunsultation")}
          </button>
          <button onClick={() => handleSort("experience")} className="sort-button">
            Sort by Experience {getSortLabel("experience")}
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
