import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams, } from "react-router-dom"

import { Col, Form, Input, Row, TimePicker, message } from 'antd'
//import './styles.css';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../../../redux/features/alterSlice';
import moment from 'moment';




const Profile = () => {
    const { user } = useSelector(state => state.user)
    const [doctor, setDoctor] = useState(null);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleFinish = async (values) => {
        console.log(values);
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/doctor/updateProfile', {
                ...values, userId: user._id, timings:
                    //values.timings
                    [
                        moment(values.timings[0]).format('HH:mm'),
                        moment(values.timings[1]).format('HH:mm'),
                        //moment(values.timings[0], 'HH:mm'),
                        //moment(values.timings[1], 'HH:mm'),
                    ]
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDoctor(res.data.data)
            console.log(doctor);

            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Error while applying doctor');
        }
    }

    //get doc details
    const getDoctorInfo = async () => {
        try {
            const res = await axios.post('/api/v1/doctor/getDoctorInfo', { userId: params.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            })
            if (res.data.success) {
                setDoctor(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDoctorInfo()
        //eslint-disable-next-line
    }, [])
    return (
        <div>
            <Layout>
                <h1>Profile</h1>
                {doctor && (
                    <Form layout='vertical' onFinish={handleFinish} className='m-3' initialValues={{
                        ...doctor,
                        timings: [
                            //  moment(doctor.timings[0]).format('HH:mm'),
                            //  moment(doctor.timings[1]).format('HH:mm'),
                            moment(doctor.timings[0], 'HH:mm'),
                            moment(doctor.timings[1], 'HH:mm'),
                        ]
                    }}
                    >
                        <h4 className=''>Personal Details :</h4>
                        <Row gutter={20}>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='First Name' name='firstName' required rules={[{ required: true, message: 'Please input your first name' }]} >
                                    <Input placeholder='Enter your first name' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Last Name' name='lastName' required rules={[{ required: true, message: 'Please input your last name' }]} >
                                    <Input placeholder='Enter your last name' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Phone No' name='phone' required rules={[{ required: true, message: 'Please input your phone no' }]} >
                                    <Input placeholder='Enter your phone no' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Email' name='email' required rules={[{ required: true, message: 'Please input your email' }]} >
                                    <Input placeholder='Enter your email' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Website' name='website' required rules={[{ required: true, message: 'Please input your website' }]} >
                                    <Input placeholder='Enter your website' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Address' name='address' required rules={[{ required: true, message: 'Please input your address' }]} >
                                    <Input placeholder='Enter your address' />
                                </Form.Item>
                            </Col>
                        </Row>



                        <h4 className=''>Professional Details :</h4>
                        <Row gutter={20}>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Specialization' name='specialization' required rules={[{ required: true, message: 'Please input your specialization' }]} >
                                    <Input placeholder='Enter your specialization' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Experience' name='experience' required rules={[{ required: true, message: 'Please input your experience' }]} >
                                    <Input placeholder='Enter your experience' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Fee Per Minute' name='feePerMinute' required rules={[{ required: true, message: 'Please input your Fee Per Minute' }]} >
                                    <Input placeholder='Enter your Fee Per Minute' />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                <Form.Item label='Timings' name='timings' required>
                                    <TimePicker.RangePicker format="HH:mm" value={[moment(doctor.timings[0], "HH:mm"), moment(doctor.timings[1], "HH:mm")]} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={8}>

                            </Col>
                            <Col xs={24} md={24} lg={8}>
                                <button className='btn btn-primary form-btn' type='submit'>Update</button>
                            </Col>
                        </Row>
                    </Form>
                )
                    // : (
                    //     <p>Loading...</p>
                    // )
                }
            </Layout>

        </div>
    );
}

export default Profile;
