import React, { useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import DoctorForm from "../components/DoctorForm";
import moment from "moment";
import { Button, Col, Form, Input, Row, TimePicker, Select } from "antd";


function ApplyDoctor() {
  const [initialValues] = useState();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);


      // Format the timings field within the values object
      // values.timings = [
      //   moment(values.timings[0]).format("HH:mm"),
      //   moment(values.timings[1]).format("HH:mm"),
      // ];

      // Format the timings field within the values object
      const timings = values.timings.map((time, index) => ({
        [`timings.${index}`]: moment(time).format("HH:mm"),
      }));

      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          if (key === "timings") {
            timings.forEach((timing) => {
              formData.append(Object.keys(timing)[0], timing[Object.keys(timing)[0]]);
            });
          } else {
            formData.append(key, values[key]);
          }
        }
      }
      formData.append("userId", user._id);
      dispatch(showLoading());

      const response = await axios.post(
        "/api/user/apply-doctor-account",

        // Send the formatted values object

        formData,
        {

          userId: user._id,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };


  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />

      {/*  <DoctorForm onFinish={onFinish} />*/}


      <Form
        layout="vertical"
        onFinish={onFinish}
        encType="multipart/form-data"
        initialValues={{
          ...initialValues,
          ...(initialValues && {
            timings: [
              moment(initialValues?.timings[0], "HH:mm"),
              moment(initialValues?.timings[1], "HH:mm"),
            ],
          }),
        }}
      >
        <h1 className="card-title mt-3">Personal Information</h1>
        <Row gutter={20}>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "First Name is required" },
                {
                  pattern: /^[A-Za-z]+$/,
                  message: "First Name must contain only alphabets",
                },
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Last Name is required" },
                {
                  pattern: /^[A-Za-z]+$/,
                  message: "Last Name must contain only alphabets",
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Phone Number is required" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Phone Number must contain only numbers",
                },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Col>


          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label='Profile Picture'
              name='photo'
              rules={[{ required: true, message: 'Profile Picture is required' }]}
            >
              <Input type="file" name="photo" placeholder="Profile Picture" onChange={(e) => {
                setFile(e.target.files[0])
              }} />
            </Form.Item>
          </Col>

        </Row>

        <hr />
        <h1 className="card-title mt-3">Professional Information</h1>
        <Row gutter={20}>


          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Timings"
              name="timings"
              rules={[{ required: true, message: "Timings are required" }]}
            >
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>

            <Form.Item
              required
              label="Specialization"
              name="specialization"
              rules={[{ required: true, message: "Specialization is required" }]}
            >
              <Select placeholder="Select Specialization">

                <Select.Option value="Cardiologist">Cardiologist</Select.Option>
                <Select.Option value="Dermatologist">Dermatologist</Select.Option>
                <Select.Option value="Gastroenterologist">Gastroenterologist</Select.Option>
                <Select.Option value="Endocrinologist">Endocrinologist</Select.Option>
                <Select.Option value="Neurologist">Neurologist</Select.Option>
                <Select.Option value="Ophthalmologist">Ophthalmologist</Select.Option>
                <Select.Option value="Orthopedic Surgeon">Orthopedic Surgeon</Select.Option>
                <Select.Option value="Pediatrician">Pediatrician</Select.Option>
                <Select.Option value="Psychiatrist">Psychiatrist</Select.Option>
                <Select.Option value="Pulmonologist">Pulmonologist</Select.Option>
                <Select.Option value="Urologist">Urologist</Select.Option>
                <Select.Option value="Obstetrician-Gynecologist">Obstetrician-Gynecologist</Select.Option>
                <Select.Option value="Oncologist">Oncologist</Select.Option>
                <Select.Option value="Rheumatologist">Rheumatologist</Select.Option>
                <Select.Option value="Nephrologist">Nephrologist</Select.Option>
                <Select.Option value="Otolaryngologist">Otolaryngologist (ENT Specialist)</Select.Option>
                <Select.Option value="General Surgeon">General Surgeon</Select.Option>
                <Select.Option value="Family Medicine Physician">Family Medicine Physician</Select.Option>
                <Select.Option value="Infectious Disease Specialist">Infectious Disease Specialist</Select.Option>
                <Select.Option value="Allergist/Immunologist">Allergist/Immunologist</Select.Option>
                <Select.Option value="Emergency Medicine Physician">Emergency Medicine Physician</Select.Option>
                <Select.Option value="Anesthesiologist">Anesthesiologist</Select.Option>
                <Select.Option value="Plastic Surgeon">Plastic Surgeon</Select.Option>
                <Select.Option value="Gynecologic Oncologist">Gynecologic Oncologist</Select.Option>
                <Select.Option value="Neonatologist">Neonatologist</Select.Option>
                <Select.Option value="Neonatologist">Other</Select.Option>


              </Select>
            </Form.Item>

          </Col>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Experience in Years"
              name="experience"
              rules={[
                { required: true, message: "Experience is required" },
                { pattern: /^[0-9]+$/, message: "Only numbers are allowed for Experience" },
              ]}
            >
              <Input placeholder="Experience" />
            </Form.Item>
          </Col>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Fee Per Cunsultation"
              name="feePerCunsultation"
              rules={[
                { required: true, message: "Fee Per Consultation is required" },
                { pattern: /^[0-9]+$/, message: "Only numbers are allowed for Fee Per Consultation" },
              ]}
            >
              <Input placeholder="Fee Per Cunsultation" type="number" />
            </Form.Item>
          </Col>

        </Row>

        <div className="d-flex justify-content-end">
          <Button className="primary-button" htmlType="submit">
            SUBMIT
          </Button>
        </div>
      </Form>
    </Layout>
  );
}

export default ApplyDoctor;