// Welcome.js
import React from 'react';
import './Welcome.css';
import Layout from '../components/Layout';

const Welcome = () => {
    return (
        <Layout>
            <div className="welcome-container">
                <div className="welcome-content">
                    <h1 className="welcome-heading">Discover and Connect</h1>
                    <p className="welcome-subtitle">with the Best Doctors in Town</p>
                </div>
            </div>
        </Layout>
    );
}

export default Welcome;
