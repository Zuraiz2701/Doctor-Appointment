import React from 'react';
import './styles.css';
import { adminMenu, userMenu } from '../Data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd'
import { useEffect } from 'react';

const Layout = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // rendering menu list
    const sidebarMenu = user?.isAdmin ? adminMenu : userMenu;

    const handleLogout = () => {
        localStorage.clear();
        message.success('Logged out successfully');
        navigate('/login');
    }

    useEffect(() => {

    }, [user]);

    return (
        <>
            <div className='main'>
                <div className='layout'>
                    <div className='sidebar'>
                        <div className='logo'>
                            <h6>Doc App</h6>
                            <hr />
                        </div>
                        <div className='menu'>
                            {sidebarMenu.map((menu) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <>
                                        <div className={`menu-item ${isActive && "active"}`}>
                                            <i className={menu.icon}></i>
                                            <Link href={menu.path}>{menu.name}</Link>
                                        </div>
                                    </>
                                )
                            })
                            }
                            <div className={`menu-item`} onClick={handleLogout}>
                                <Link href="/login">
                                    <i className=" fa-solid fa-right-from-bracket"></i>
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='header'>
                            <div className='header-content'>
                                <i class='fa-solid fa-bell'></i>
                                <Link to='/profile'>{user?.name}</Link>
                            </div>
                        </div>
                        <div className='body'>{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Layout;