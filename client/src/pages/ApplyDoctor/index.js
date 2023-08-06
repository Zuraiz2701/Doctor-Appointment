import React from 'react';
import Layout from '../../components/Layout';
import { Col, Form, Input, Row, TimePicker } from 'antd'
import './styles.css';

const ApplyDoctor = () => {

    //handle form
    const handleFinish = (values) => {
        console.log(values);
    }
    return (
        <Layout>
            <h1 className='text-center'>Apply Doctor</h1>

            <Form layout='vertical' onFinish={handleFinish} className='m-3'>
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
                        <Form.Item label='Timings' name='timings' required rules={[{ required: true, message: 'Please input your timings' }]} >
                            <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>

                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <button className='btn btn-primary form-btn' type='submit'>Submit</button>
                    </Col>
                </Row>
            </Form>
        </Layout>
    );
}

export default ApplyDoctor;