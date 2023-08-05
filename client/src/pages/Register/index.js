import { Link, useNavigate } from "react-router-dom"
import React from 'react';
import { Form, Input, message } from 'antd';
import "./styles.css"
import axios from "axios";
import { useDispatch } from "react-redux"
import { showLoading, hideLoading } from "../../redux/features/alterSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //form submit handler
    const onFinishHandler = async (values) => {

        console.log(values);
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/v1/user/register', values);
            dispatch(hideLoading());
            if (response.data.success) {
                message.success("User registered successfully");
                navigate('/login');
            }
            else {
                message.error(response.data.message);
            }


        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("something went wrong");
        }
    }
    return (

        <div className='form-container'>
            <Form className="register-form" layout='vertical' onFinish={onFinishHandler}>
                <h3 className="text-center">Register Form</h3>
                <Form.Item label="Name" name="name">
                    <Input type='text' required />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type='email' required />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type='password' required />
                </Form.Item>
                <Link to='/login' className="m-2  ">Already user Login here</Link>
                <button className='btn btn-primary' type='submit'>Register</button>
            </Form>
        </div>

    );
}

export default Register;