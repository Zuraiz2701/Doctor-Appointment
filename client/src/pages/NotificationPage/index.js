import Layout from '../../components/Layout';
import React from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

const NotificationPage = () => {
    const { user } = useSelector((state) => state.user);
    const handleMarkAllRead = () => { }
    const handleDeleteAllRead = () => { }
    return (
        <Layout>
            <h4 className='p-3 text-center'>Notification</h4>
            <Tabs.TabPane tab="unRead" key={0}>
                <div className='d-flex justify-content-end'>
                    <h4 className='p-2' onClick={handleMarkAllRead}>Mark All Read</h4>
                </div>
            </Tabs.TabPane>

            {user?.notification.map((notificationMgs) => (
                <div className='card'>
                    <div className='card-text' onClick={notificationMgs.onclickPath}>
                        {notificationMgs.message}
                    </div>
                </div>
            ))}

            <Tabs.TabPane tab="Read" key={1}>
                <div className='d-flex justify-content-end'>
                    <h4 className='p-2' onClick={handleDeleteAllRead}>Delete All Read</h4>
                </div>
            </Tabs.TabPane>
        </Layout>
    );
}

export default NotificationPage;
