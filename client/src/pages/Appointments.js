import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table, Modal, Button } from "antd";
import moment from "moment";
import "./Appointments.css";
import { useNavigate } from "react-router-dom";

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(
    false
  );
  const [currentPrescription, setCurrentPrescription] = useState("");
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/user/get-appointments-by-user-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const handleVideoButtonClick = (isDoctor, id) => {
    navigate(`/video/${id}?isDoctor=${isDoctor}`);
    window.location.reload();
  };

  const openPrescriptionModal = (prescription) => {
    setCurrentPrescription(prescription);
    setPrescriptionModalVisible(true);
  };

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
        <span>{record.doctorInfo.phoneNumber}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Join Video",
      dataIndex: "joinVideo",
      render: (text, record) => (
        <span>
          {record.videoId ? (
            // Show "Join Video" button only when videoId is not null and isVideoEnded is false
            record.status === "approved" && !record.isVideoEnded && (
              <button onClick={() => handleVideoButtonClick(false, record._id)}>
                Join Video
              </button>
            )
          ) : (
            // Show message when videoId is null
            <span>Join Video button will be available at the scheduled appointment time when the doctor starts the video call.</span>
          )}
          {record.isVideoEnded && (
            // Show message when video consultation is completed
            <span>Video Consultation completed</span>
          )}
        </span>
      ),
    },

    // Add a new column for Prescriptions
    {
      title: "Prescription",
      dataIndex: "prescription",
      render: (text, record) => (
        <div>
          {record.isVideoEnded ? (
            // Show prescription if video is ended
            record.prescription && (
              <>
                <button onClick={() => openPrescriptionModal(record.prescription)}>
                  View Prescription
                </button>
                <Modal
                  title="Prescription"
                  visible={prescriptionModalVisible}
                  onCancel={() => setPrescriptionModalVisible(false)}
                  footer={null}
                >
                  <pre style={{ whiteSpace: "pre-wrap" }}>{currentPrescription}</pre>
                </Modal>
              </>
            )
          ) : (
            // Show message if video is not ended
            <span>Doctor will send prescription after video consultation</span>
          )}
        </div>
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
          border: "1px solid #e8e8e8",
          borderRadius: "4px",
          padding: "16px",
          background: "linear-gradient(#005555, #007777)",
          color: "#linear-gradient(#005555, #007777)", // Set text color to white
        }}
      />
    </Layout>
  );
}

export default Appointments;
