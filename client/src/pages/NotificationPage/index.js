import Layout from '../../components/Layout';
import React from 'react';
import { Tabs, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from "../../redux/features/alterSlice";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading);
            const res = await axios.post('/api/v1/user//get-all-notification', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading);
            if (res.data.success) {
                message.success(res.data.message);
                console.log(res.data.data);
            } else {
                message.error(res.data.message);
            }

        } catch (error) {
            dispatch(hideLoading);
            console.log(error);
            message.error('Something went wrong');
        }
    }
    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading);
            const res = await axios.post('/api/v1/user/delete-all-notification', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading);
            if (res.data.success) {
                message.success(res.data.message);
                //console.log(res.data.data);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error('Something went wrong');
        }
    }
    return (
        <Layout>
            <h4 className='p-3 text-center'>Notification</h4>
            <Tabs>
                <Tabs.TabPane tab="unRead" key={0}>
                    <div className='d-flex justify-content-end' style={{ cursor: "pointer" }}>
                        <h4 className='p-2' onClick={handleMarkAllRead}>Mark All Read</h4>
                    </div>

                    {user?.notification.map((notificationMgs) => (
                        <div className='card' style={{ cursor: "pointer" }}>
                            <div className='card-text' onClick={navigate(notificationMgs.onclickPath)}>
                                {notificationMgs.message}
                            </div>
                        </div>
                    ))}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Read" key={1}>
                    <div className='d-flex justify-content-end' style={{ cursor: "pointer" }}>
                        <h4 className='p-2 text-primary' onClick={handleDeleteAllRead}>Delete All Read</h4>
                    </div>

                    {user?.seennotification.map((notificationMgs) => (
                        <div className='card' style={{ cursor: "pointer" }}>
                            <div className='card-text' onClick={notificationMgs.onclickPath}>
                                {notificationMgs.message}
                            </div>
                        </div>
                    ))}
                </Tabs.TabPane>
            </Tabs>



        </Layout>
    );
}

export default NotificationPage;