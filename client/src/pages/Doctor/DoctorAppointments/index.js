import React from 'react';
import Layout from '../../../components/Layout';
import { Table, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const getAppointments = async () => {
        try {
            const res = await axios.get('/api/v1/doctor/doctor-appointments', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post('/api/v1/doctor/update-status', { appointmentsId: record._id, status }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            if (res.data.success) {
                message.success(res.data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error.message);
            message.error("Something went wrong");
        }
    }

    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
        },
        //     {
        //         title: 'Name',
        //         dataIndex: 'name',
        //         render: (text, record) => (
        //             <span>
        //                 {record.doctorId.firstName} {record.doctorId.lastName}
        //             </span>
        //         )
        //     },
        //     {
        //         title: 'Phone',
        //         dataIndex: 'phone',
        //         render: (text, record) => (
        //             <span>
        //                 {record.doctorInfo.phone}
        //             </span>
        //         )
        //     },
        {
            title: 'Date & Time',
            dataIndex: 'date ',
            render: (text, record) => (
                <span>
                    {moment(record.date).format('DD-MM-YYYY')} &nbsp;
                    {moment(record.time).format('HH:mm')}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <div className='d-flex'>
                            <button className='btn btn-success m-2' onClick={() => handleStatus(record, 'approved')}>Approve</button>
                            <button className='btn btn-danger m-2' onClick={() => handleStatus(record, 'reject')}>Reject</button>
                        </div>
                    )
                    }
                </div>
            )
        },
    ]
    return (
        <Layout>
            <h1>Appointments</h1>
            <Table columns={columns} dataSource={appointments}></Table>
        </Layout>
    );
}

export default DoctorAppointments;
