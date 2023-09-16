import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  // Validation rules
  const validateName = (rule, value, callback) => {
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/; // Regex for names with the first character as an alphabet
    if (!value) {
      callback("Name is required");
    } else if (!nameRegex.test(value)) {
      callback("Invalid name. It must start with an alphabet and contain only letters and spaces.");
    } else {
      callback(); // Pass validation
    }
  };


  const validateEmail = (rule, value, callback) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/; // Regex for Gmail addresses
    if (!value) {
      callback("Email is required");
    } else if (!emailRegex.test(value)) {
      callback("Invalid email address. Only Gmail addresses are allowed.");
    } else {
      callback(); // Pass validation
    }
  };

  const validatePassword = (rule, value, callback) => {
    if (!value) {
      callback("Password is required");
    } else if (value.length < 8) {
      callback("Password must be at least 8 characters long");
    } else {
      callback(); // Pass validation
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Nice To Meet U</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                validator: validateName,
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                validator: validateEmail,
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                validator: validatePassword,
              },
            ]}
          >
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit"
          >
            REGISTER
          </Button>

          <Link to="/login" className="anchor mt-2">
            CLICK HERE TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;