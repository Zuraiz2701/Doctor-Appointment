import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table, Input, Button, Modal } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(
    false
  );
  const [prescriptionInput, setPrescriptionInput] = useState("");
  const [currentRecord, setCurrentRecord] = useState(null);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-appointments-by-doctor-id",
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

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  const openPrescriptionModal = (record) => {
    setCurrentRecord(record);
    setPrescriptionInput(record.prescription || ""); // Set initial value
    setPrescriptionModalVisible(true);
  };

  const handlePrescriptionChange = (event) => {
    // Replace new lines with actual line breaks
    const updatedPrescription = event.target.value.replace(/\n/g, '\n');
    setPrescriptionInput(updatedPrescription);
  };

  const handlePrescriptionModalOk = async () => {
    if (currentRecord) {
      try {
        dispatch(showLoading());
        const response = await axios.post(
          "/api/doctor/store-prescription",
          {
            appointmentId: currentRecord._id,
            prescription: prescriptionInput,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          getAppointmentsData();
        }
      } catch (error) {
        toast.error("Error storing prescription");
        dispatch(hideLoading());
      }
    }
    setPrescriptionModalVisible(false);
  };

  const handleClick = (id, isDoctor) => {
    navigate(`/video/${id}?isDoctor=${isDoctor}`);
    window.location.reload();
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    // {
    //   title: "Phone",
    //   dataIndex: "phoneNumber",
    //   render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    // },
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
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Video Consult",
      dataIndex: "videoConsult",
      render: (text, record) => {
        const appointmentDateTime = moment(record.date);
        appointmentDateTime.set({
          hour: moment(record.time).get("hour"),
          minute: moment(record.time).get("minute"),
        });
        const currentDateTime = moment();

        if (record.isVideoEnded) {
          return <span>Video Consultation completed</span>;
        } else if (
          record.status === "approved" &&
          appointmentDateTime.isSameOrBefore(currentDateTime)
        ) {
          return (
            <button
              className="anchor"
              onClick={() => handleClick(record._id, true)}
            >
              Start Video Consult
            </button>
          );
        } else {
          return <span>Video Consult not available</span>;
        }
      },
    },
    {
      title: "Prescription",
      dataIndex: "prescription",
      render: (text, record) => (
        <div>
          {record.isVideoEnded ? (
            // Show "Add Prescription" button only if isVideoEnded is true
            <Button onClick={() => openPrescriptionModal(record)}>
              Add Prescription
            </Button>
          ) : (
            <span>You can send prescription after Video consultation</span>
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
      <h1 className="page-header">Appointments</h1>
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

      {/* Prescription Modal */}
      <Modal
        title="Add Prescription"
        visible={prescriptionModalVisible}
        onOk={handlePrescriptionModalOk}
        onCancel={() => setPrescriptionModalVisible(false)}
      >
        <Input.TextArea
          placeholder="Enter prescription"
          value={prescriptionInput}
          onChange={handlePrescriptionChange}
          autoSize={{ minRows: 4, maxRows: 8 }} // Auto adjust the height based on content
        />
      </Modal>
    </Layout>
  );
}

export default DoctorAppointments;
