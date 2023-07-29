import { Link, useNavigate } from "react-router-dom"
import React from 'react';
import { Form, Input, message } from 'antd';
import "./styles.css"
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    //form submit handler
    const onFinishHandler = async (values) => {
        //console.log(values);
        try {
            const response = await axios.post('/api/v1/user/login', values);
            console.log(response);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                message.success(response.data.message);
                navigate('/');
            }
            else {
                message.error(response.data.message);
            }
        }
        catch (error) {
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
