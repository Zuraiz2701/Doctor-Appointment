import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./Video.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";


const socket = io.connect('http://localhost:5001');

function VideoConfrence() {

  const dispatch = useDispatch();
  const { id } = useParams();
  console.log("id", id);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();




  const changeAppointmentVideoId = async (appId, id) => {
    try {
      dispatch(showLoading());
      const resposne = await axios.post(
        "/api/doctor/store-video-id",
        { appointmentId: appId, videoId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.success) {
        toast.success(resposne.data.message);
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
        console.log('Media stream retrieved:', stream);
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
      console.log("me", id);
      changeAppointmentVideoId(id, ids)
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
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
      <div className="sidebar">
        <h1 style={{ textAlign: "center", color: "#fff" }}>E-MEd</h1>
        <TextField
          id="filled-basic"
          label="Name"
          variant="filled"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AssignmentIcon fontSize="large" />}
          >
            Copy ID
          </Button>
        </CopyToClipboard>
        <TextField
          id="filled-basic"
          label="ID to call"
          variant="filled"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
        />
        <div className="call-button">
          {callAccepted && !callEnded ? (
            <Button variant="contained" color="secondary" onClick={leaveCall}>
              End Call
            </Button>
          ) : (
            <IconButton
              color="primary"
              aria-label="call"
              onClick={() => callUser(idToCall)}
            >
              <PhoneIcon fontSize="large" />
            </IconButton>
          )}
          {idToCall}
        </div>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1>{name} is calling...</h1>
            <Button variant="contained" color="primary" onClick={answerCall} style={{
              color: 'white',
              background_color: ' #013737',
              padding: '5px',
              border_radius: '5px'
            }}>
              Answer
            </Button>
          </div>
        ) : null}
      </div>
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
