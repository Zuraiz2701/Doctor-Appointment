import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DatePicker, TimePicker, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from "../../redux/features/alterSlice";

const BookingPage = () => {
    const { user } = useSelector(state => state.user);
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    //const [isLoading, setIsLoading] = useState(true);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const dispatch = useDispatch();

    const getUserData = async () => {
        try {
            const res = await axios.post('/api/v1/doctor/getDoctorById', {
                doctorId: params.doctorId
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            if (res.data.success) {
                setDoctor(res.data.data);
            }
            //setIsLoading(false);
            //setIsAvailable(true);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleBooking = async () => {
        try {
            if (!date && !time) {
                return alert('Please select date and time');
            }
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/book-appointment', {
                doctorId: params.doctorId,
                userId: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error.message);
        }
    }

    const handleAvailability = async () => {
        try {
            if (!date && !time) {
                return alert('Please select date and time');
            }
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/booking-availability', {
                doctorId: params.doctorId,
                date,
                time
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            dispatch(hideLoading());
            if (res.data.success) {
                setIsAvailable(true);
                console.log(res.data.message);
                message.success(res.data.message);

            }
            else {
                setIsAvailable(false);
                message.error(res.data.message);
            }
            console.log(isAvailable)
        } catch (error) {
            dispatch(hideLoading());
            console.log(error.message);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <Layout>
            <h3>Booking Page</h3>
            <div className='container'>
                {
                    //     isLoading ? (
                    //     <p>Loading...</p>
                    // ) :
                    //     (
                    doctor && (
                        <div className=''>
                            <h4>
                                Dr. {doctor.firstName} {doctor.lastName}
                            </h4>
                            <h4>
                                Fees: {doctor.feePerMinute}
                            </h4>
                            {doctor.timings && (
                                <h4>
                                    Timings: {doctor.timings[0]} - {doctor.timings[1]}
                                </h4>
                            )}
                            <div className='d-flex flex-column w-50'>
                                <DatePicker
                                    className='m-2'
                                    format={"DD:MM:YYYY"}
                                    onChange={(value) => {
                                        //    setIsAvailable(false);
                                        setDate(moment(value).format("DD-MM-YYY"))
                                    }}
                                />
                                <TimePicker
                                    className='m-2'
                                    format={"HH:mm"}
                                    onChange={(value) => {
                                        //  setIsAvailable(false);
                                        setTime(moment(value).format("HH:mm"))
                                    }}
                                />
                                <button className='btn btn-primary mt-2' onClick={handleAvailability}>
                                    Check Availability
                                </button>
                                {
                                    isAvailable ? (
                                        <button className='btn btn-dark mt-2' onClick={handleBooking}>
                                            Book Now
                                        </button>
                                    ) :
                                        (<></>)
                                }
                            </div>
                        </div>
                    )
                    // )
                }
            </div>
        </Layout>
    );
}

export default BookingPage;
