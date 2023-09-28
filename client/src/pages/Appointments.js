import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import "./Appointments.css";
import { useNavigate } from "react-router-dom";

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("/api/user/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setAppointments(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };


  const handleVideoButtonClick = (isDoctor, id) => {
    console.log("id", id);
    navigate(`/video/${id}?isDoctor=${isDoctor}`);
    window.location.reload();
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <span>
          {record.doctorInfo.phoneNumber}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Video ID",
      dataIndex: "videoId",
      render: (text, record) => (
        <span>
          {record.videoId !== "" && record.videoId !== "videoId will be available at appointment date and time when doctor starts the video call" ? (
            <button onClick={() => handleVideoButtonClick(false, record._id)}>
              View Video
            </button>
          ) : null}
        </span>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr />
      <Table
        columns={columns}
        dataSource={appointments}
        style={{
          border: '1px solid #e8e8e8',
          borderRadius: '4px',
          padding: '16px',
          background: 'linear-gradient(#005555, #007777)',
          color: '#linear-gradient(#005555, #007777)', // Set text color to white
        }}
      />

    </Layout>
  )
}

export default Appointments;
