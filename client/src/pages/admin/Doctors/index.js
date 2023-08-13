import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { Table, message } from 'antd';

const Doctors = () => {
    const [doctors, setDoctors] = useState([])

    //get all users
    const getDoctors = async () => {
        try {
            const res = await axios.get('/api/v1/admin/getAllDoctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAccountStatus = async (record, status) => {
        try {
            const res =
                await axios.post('/api/v1/admin/changeAccountStatus', {
                    doctorId: record._id,
                    userId: record.userId,
                    status: status
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
            if (res.data.success) {
                message.success('account status changed successfully');
                window.location.reload();
            }
        } catch (error) {
            message.error('error while changing account status');
        }
    }

    useEffect(() => {
        getDoctors();
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <div className="d-flex">

                    <span className='mt-2 ms-2'>{record.firstName} {record.lastName}</span>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'phone',
            dataIndex: 'phone',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className="d-flex">
                    {
                        record.status === 'pending' ?
                            <button
                                className='btn btn-success' onClick={() => {
                                    handleAccountStatus(record, "approved")
                                }}>Approve
                            </button> :
                            <button
                                className='btn btn-danger'
                            >
                                Block
                            </button>
                    }
                </div>
            )
        }
    ]

    return (
        <Layout>
            <h1 className='text-center m-2'>Doctors List</h1>
            <Table columns={columns} dataSource={doctors} />
        </Layout>
    );
}

export default Doctors;

//<img src={record.avatar} alt={record.name} width='50' height='50' className='rounded-circle' />