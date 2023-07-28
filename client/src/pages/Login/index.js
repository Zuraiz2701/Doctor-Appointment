import { Link } from "react-router-dom"
import React from 'react';
import { Form, Input } from 'antd';
import "./styles.css"
const Login = () => {

    //form submit handler
    const onFinishHandler = (values) => {
        console.log(values);
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
