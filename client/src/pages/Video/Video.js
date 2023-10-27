import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import Peer from "simple-peer";
import io from "socket.io-client";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import "./Video.css";

const socket = io.connect('http://localhost:5001');

function VideoConfrence() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isDoctor = new URLSearchParams(location.search).get("isDoctor");

  const [appointment, setAppointment] = useState([]);
  const navigate = useNavigate();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const { user } = useSelector((state) => state.user);

  const [requestingToJoin, setRequestingToJoin] = useState(false);

  const getAppointmentData = async (appointmentId) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `/api/doctor/get-appointment-by-appointment-id?appointmentId=${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointment(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeAppointmentVideoId = async (appId, id) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/store-video-id",
        { appointmentId: appId, videoId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentData(appId);
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    socket.on("me", (ids) => {
      setMe(ids);
      if (isDoctor === "true") {
        changeAppointmentVideoId(id, ids);
      }
      if (isDoctor === "false") {
        getAppointmentData(id);
      }
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    setRequestingToJoin(true);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
      setRequestingToJoin(false);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="app-container">
      {user !== undefined && (
        <div className="sidebar">
          <h1 style={{ textAlign: "center", color: "#fff" }}>E-MEd</h1>
          <h2>{user && user.name}</h2>
          <div className="call-button">
            {requestingToJoin ? (
              <p>Requesting To Join Meeting</p>
            ) : callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                Leave
              </Button>
            ) : isDoctor !== "true" ? (
              <IconButton
                color="primary"
                aria-label="call"
                onClick={() => callUser(appointment.videoId)}
              >
                <PhoneIcon fontSize="large" />
              </IconButton>
            ) : (
              <p>Waiting for the patient to join</p>
            )}
          </div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>Patient Is Requesting TO Join</h1>
              <Button
                variant="contained"
                color="primary"
                onClick={answerCall}
                style={{
                  color: 'white',
                  backgroundColor: ' #013737',
                  padding: '5px',
                  borderRadius: '5px'
                }}
              >
                Accept
              </Button>
            </div>
          ) : null}
        </div>
      )}
      <div className="main-content">
        <div className="video-container">
          <div className="video">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "100%" }}
            />
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "100%" }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoConfrence;
