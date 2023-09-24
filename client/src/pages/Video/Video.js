import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from 'react-simple-flex-grid';
import "react-simple-flex-grid/lib/main.css";
import { MeetingProvider, MeetingConsumer, useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { getMeetingId, getToken } from "./MeetingView";

const chunk = (arr) => {
  const newArr = [];
  while (arr.length)
    newArr.push(arr.splice(0, 3));
  return newArr;

}

function JoinScreen({ updateMeetingId, getMeetingAndToken }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          updateMeetingId(e.target.value);
        }}
      />
      <button onClick={getMeetingAndToken}>Join</button>
      <button onClick={getMeetingAndToken}>Create Meeting</button>
    </div>
  )
}

function MeetingGrid({ meetingId, getMeetingAndToken }) {
  const [joined, setJoined] = useState(false);
  const { join, leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting()

  const { participants } = useMeeting()
  const joinMeeting = () => {
    setJoined(true);
    join();
  }
  return (
    <div>
      <header>Meeting Id: {meetingId}</header>
      {
        joined ?
          (
            <div>
              <button onClick={leave}>
                Leave
              </button>
              <button onClick={toggleMic}>
                Mic
              </button>
              <button onClick={toggleWebcam}>
                Webcam
              </button>
              <button onClick={toggleScreenShare}>
                Toggle Screen Share
              </button>
            </div>
          ) : (
            <button onClick={joinMeeting}>
              Join
            </button>
          )
      }

      <div>
        {chunk([...participants.keys()]).map((k) => (
          <Row>
            {k.map((participantId) => (
              <Col span={4}>
                <ParticipantView
                  participantId={participantId}
                  key={participantId}
                />
              </Col>
            ))}
          </Row>
        ))}
      </div>

    </div>
  )
}

function ParticipantView(props) {
  const webcamRef = useRef(null);
  const screenShareRef = useRef(null);
  const micRef = useRef(null);

  const {
    displayName,
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
  } = useParticipant(props.participantId);

  useEffect(() => {
    if (webcamRef.current) {
      if (webcamOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);

        webcamRef.current.srcObject = mediaStream;
        webcamRef.current
          .play()
          .catch((err) =>
            console.log('videoElem.current.play() failed: ', err)
          )
      }
      else {
        webcamRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((err) =>
            console.log('videoElem.current.play() failed: ', err)
          )
      }
      else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  useEffect(() => {
    if (screenShareRef.current) {
      if (screenShareOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareStream.track);

        screenShareRef.current.srcObject = mediaStream;
        screenShareRef.current
          .play()
          .catch((err) =>
            console.log('videoElem.current.play() failed: ', err)
          )
      }
      else {
        screenShareRef.current.srcObject = null;
      }
    }
  }, [screenShareStream, screenShareOn]);

  return (
    <div key={props.participantId}>
      <audio ref={micRef} autoPlay />
      {webcamRef || micOn ? (
        <div>
          <h2>{displayName}</h2>
          <video
            height={'100%'}
            width={'100%'}
            ref={webcamRef}
            autoPlay
          />
        </div>) : (null)
      }
      {screenShareOn ? (
        <div>
          <h2>Screen Shared</h2>
          <video
            height={'100%'}
            width={'100%'}
            ref={screenShareRef}
            autoPlay
          />
        </div>) : (null)
      }
      <br />
      <span>
        Mic: {micOn ? 'On' : 'Off'},

        Webcam: {webcamOn ? 'On' : 'Off'},
        Screen Share: {screenShareOn ? 'On' : 'Off'},
      </span>
    </div>
  )
}

function VideoConfrence() {
  const [token, setToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async () => {
    const token = await getToken();
    setToken(token);
    const fetchedMeetingId = await getMeetingId(token);
    setMeetingId(fetchedMeetingId);
    //setMeetingId(meetingId ? meetingId : (await getMeetingId({ token })));
  }

  const updateMeetingId = (meetingId) => {
    setMeetingId(meetingId);
  }

  return token && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Muhammad's Org",
      }}
      token={token}
    >
      <MeetingConsumer>
        {() => <MeetingGrid
          meetingId={meetingId}
          getMeetingAndToken={getMeetingAndToken} />
        }
      </MeetingConsumer>
    </MeetingProvider>
  ) : (<JoinScreen updateMeetingId={updateMeetingId} getMeetingAndToken={getMeetingAndToken} />)
}
export default VideoConfrence;