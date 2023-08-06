import { Link, useNavigate } from "react-router-dom"
import React from 'react';
import { Form, Input, message } from 'antd';
import "./styles.css"
import axios from 'axios';
import { useDispatch } from "react-redux"
import { showLoading, hideLoading } from "../../redux/features/alterSlice";
import { setUser } from "../../redux/features/userSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //form submit handler
    const onFinishHandler = async (values) => {

        try {
            dispatch(showLoading());
            const response = await axios.post('/api/v1/user/login', values);
            dispatch(hideLoading());
            console.log(response);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                message.success(response.data.message);
                //to update data on layout page
                dispatch(setUser(response.data.data));
                navigate('/');
            }
            else {
                message.error(response.data.message);
            }
        }
        catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something went wrong");
        }
    }
    return (
        <div className='form-container'>
            <Form className="register-form" layout='vertical' onFinish={onFinishHandler}>
                <h3 className="text-center">Login Form</h3>

                <Form.Item label="Email" name="email">
                    <Input type='email' required />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type='password' required />
                </Form.Item>
                <Link to='/register' className="m-2  ">Not a user Register here</Link>
                <button className='btn btn-primary' type='submit'>Login</button>
            </Form>
        </div>

    );
}

export default Login;
