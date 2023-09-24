import { useEffect, useState } from "react";
import { getMeetingId, getToken } from './MeetingView'
function VideoConfrence() {
  const [token, setToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const getMeetingToken = async () => {
    const token1 = await getToken();
    //console.log("token", token1);
    setToken(token1);
    const ID = await getMeetingId(token);
    //console.log("id", ID);
    setMeetingId(ID);
  }
  console.log("meetingId", meetingId);
  useEffect(() => {

    getMeetingToken()
  }, [token])
  return token ? (
    <h1>{meetingId}</h1>
  ) : null
}
export default VideoConfrence;
//In this step, we will Initialise VideoSDK meeting.
// import React from "react";
// import { MeetingProvider, } from "@videosdk.live/react-sdk";
// import MeetingView from "./MeetingView";


// const VideoConfrence = () => {
//   return (
//     <MeetingProvider
//       config={{
//         meetingId: "qtfq-vo56-6a82",
//         micEnabled: true,
//         webcamEnabled: true,
//         name: "Muhammad's Org",
//       }}
//       token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyYjVhNjJhOC04MTA0LTRlZDYtOWEyMi1hNGVjOTY0OThmY2QiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5NTU0OTAyNCwiZXhwIjoxNjk1NjM1NDI0fQ.drIYDwLvBCqxtAXWOUcJiELJIHZcnonaElblLNTqhSc"
//     >
//       <MeetingView />
//     </MeetingProvider>
//   )
// };
// export default VideoConfrence;

// VideoConfrence.js
// import React from "react";
// import { MeetingProvider } from "@videosdk.live/react-sdk";
// import MeetingView from "./MeetingView";

// const VideoConference = () => {
//   return (
//     <MeetingProvider
//       config={{
//         meetingId: "qtfq-vo56-6a82",
//         micEnabled: true,
//         webcamEnabled: true,
//         name: "Muhammad's Org",
//       }}
//       token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyYjVhNjJhOC04MTA0LTRlZDYtOWEyMi1hNGVjOTY0OThmY2QiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5NTU0OTAyNCwiZXhwIjoxNjk1NjM1NDI0fQ.drIYDwLvBCqxtAXWOUcJiELJIHZcnonaElblLNTqhSc"
//     >
//       <MeetingView />
//     </MeetingProvider>
//   );
// };

// export default VideoConference;




///////////////////////////////////////////////////////////////////////////////*css*/`


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   MeetingProvider,
//   MeetingConsumer,
//   useMeeting,
//   useParticipant,
// } from "@videosdk.live/react-sdk";
// import { authToken, createMeeting } from "./MeetingView";
// import ReactPlayer from "react-player";

// function JoinScreen({ getMeetingAndToken }) {
//   const [meetingId, setMeetingId] = useState(null);
//   const onClick = async () => {
//     await getMeetingAndToken(meetingId);
//   };
//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter Meeting Id"
//         onChange={(e) => {
//           setMeetingId(e.target.value);
//         }}
//       />
//       <button onClick={onClick}>Join</button>
//       {" or "}
//       <button onClick={onClick}>Create Meeting</button>
//     </div>
//   );
// }

// function MeetingView(props) {
//   const [joined, setJoined] = useState(null);
//   //Get the method which will be used to join the meeting.
//   //We will also get the participants list to display all participants
//   const { join, participants } = useMeeting({
//     //callback for when meeting is joined successfully
//     onMeetingJoined: () => {
//       setJoined("JOINED");
//     },
//     //callback for when meeting is left
//     onMeetingLeft: () => {
//       props.onMeetingLeave();
//     },
//   });
//   const joinMeeting = () => {
//     setJoined("JOINING");
//     join();
//   };

//   return (
//     <div className="container">
//       <h3>Meeting Id: {props.meetingId}</h3>
//       {joined && joined === "JOINED" ? (
//         <div>
//           <Controls />
//           {/* For rendering all the participants in the meeting */}
//           {[...participants.keys()].map((participantId) => (
//             <ParticipantView
//               participantId={participantId}
//               key={participantId}
//             />
//           ))}
//         </div>
//       ) : joined && joined === "JOINING" ? (
//         <p>Joining the meeting...</p>
//       ) : (
//         <button onClick={joinMeeting}>Join</button>
//       )}
//     </div>
//   );
// }

// function Controls() {
//   const { leave, toggleMic, toggleWebcam } = useMeeting();
//   return (
//     <div>
//       <button onClick={() => leave()}>Leave</button>
//       <button onClick={() => toggleMic()}>toggleMic</button>
//       <button onClick={() => toggleWebcam()}>toggleWebcam</button>
//     </div>
//   );
// }

// function ParticipantView(props) {
//   const micRef = useRef(null);
//   const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
//     useParticipant(props.participantId);

//   const videoStream = useMemo(() => {
//     if (webcamOn && webcamStream) {
//       const mediaStream = new MediaStream();
//       mediaStream.addTrack(webcamStream.track);
//       return mediaStream;
//     }
//   }, [webcamStream, webcamOn]);

//   useEffect(() => {
//     if (micRef.current) {
//       if (micOn && micStream) {
//         const mediaStream = new MediaStream();
//         mediaStream.addTrack(micStream.track);

//         micRef.current.srcObject = mediaStream;
//         micRef.current
//           .play()
//           .catch((error) =>
//             console.error("videoElem.current.play() failed", error)
//           );
//       } else {
//         micRef.current.srcObject = null;
//       }
//     }
//   }, [micStream, micOn]);

//   return (
//     <div>
//       <p>
//         Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
//         {micOn ? "ON" : "OFF"}
//       </p>
//       <audio ref={micRef} autoPlay playsInline muted={isLocal} />
//       {webcamOn && (
//         <ReactPlayer
//           //
//           playsinline // very very imp prop
//           pip={false}
//           light={false}
//           controls={false}
//           muted={true}
//           playing={true}
//           //
//           url={videoStream}
//           //
//           height={"300px"}
//           width={"300px"}
//           onError={(err) => {
//             console.log(err, "participant video error");
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function VideoConference() {
//   const [meetingId, setMeetingId] = useState(null);

//   //Getting the meeting id by calling the api we just wrote
//   const getMeetingAndToken = async (id) => {
//     const meetingId =
//       id == null ? await createMeeting({ token: authToken }) : id;
//     setMeetingId(meetingId);
//   };

//   //This will set Meeting Id to null when meeting is left or ended
//   const onMeetingLeave = () => {
//     setMeetingId(null);
//   };

//   return authToken && meetingId ? (
//     <MeetingProvider
//       config={{
//         meetingId,
//         micEnabled: true,
//         webcamEnabled: true,
//         name: "C.V. Raman",
//       }}
//       token={authToken}
//     >
//       <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
//     </MeetingProvider>
//   ) : (
//     <JoinScreen getMeetingAndToken={getMeetingAndToken} />
//   );
// }

// export default VideoConference;