//import { Button, Col, Form, Input, Row, TimePicker } from "antd";
//import moment from "moment";
//import React from "react";
//
//function DoctorForm({ onFinish, initivalValues }) {
//  return (
//    <Form
//      layout="vertical"
//      onFinish={onFinish}
//      initialValues={{
//        ...initivalValues,
//        ...(initivalValues && {
//          timings: [
//            moment(initivalValues?.timings[0], "HH:mm"),
//            moment(initivalValues?.timings[1], "HH:mm"),
//          ],
//        }),
//      }}
//    >
//      <h1 className="card-title mt-3">Personal Information</h1>
//      <Row gutter={20}>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="First Name"
//            name="firstName"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="First Name" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Last Name"
//            name="lastName"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Last Name" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Phone Number"
//            name="phoneNumber"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Phone Number" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Website"
//            name="website"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Website" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Address"
//            name="address"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Address" />
//          </Form.Item>
//        </Col>
//      </Row>
//      <hr />
//      <h1 className="card-title mt-3">Professional Information</h1>
//      <Row gutter={20}>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Specialization"
//            name="specialization"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Specialization" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Experience"
//            name="experience"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Experience" type="number" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Fee Per Cunsultation"
//            name="feePerCunsultation"
//            rules={[{ required: true }]}
//          >
//            <Input placeholder="Fee Per Cunsultation" type="number" />
//          </Form.Item>
//        </Col>
//        <Col span={8} xs={24} sm={24} lg={8}>
//          <Form.Item
//            required
//            label="Timings"
//            name="timings"
//            rules={[{ required: true }]}
//          >
//            <TimePicker.RangePicker format="HH:mm" />
//          </Form.Item>
//        </Col>
//      </Row>
//
//      <div className="d-flex justify-content-end">
//        <Button className="primary-button" htmlType="submit">
//          SUBMIT
//        </Button>
//      </div>
//    </Form>
//  );
//}
//
//export default DoctorForm;


import { Button, Col, Form, Input, Row, TimePicker, Select } from "antd";
import moment from "moment";
import React from "react";

function DoctorForm({ onFinish, initialValues }) {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
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
            label="Website"
            name="website"
            rules={[{ required: true, message: "Website is required" }]}
          >
            <Input placeholder="Website" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>
      <Row gutter={20}>
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


              {/* Add more specialization options here */}
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
          {/*          <Form.Item
            required
            label="Fee Per Consultation in PKR"
            name="feePerConsultation"
            rules={[
              { required: true, message: "Fee Per Consultation is required" },
              { pattern: /^[0-9]+$/, message: "Only numbers are allowed for Fee Per Consultation" },
            ]}
          >
            <Input placeholder="Fee Per Consultation" />
          </Form.Item>
*/}
          <Form.Item
            required
            label="Fee Per Cunsultation"
            name="feePerCunsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Cunsultation" type="number" />
          </Form.Item>
        </Col>

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
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
}

export default DoctorForm;
