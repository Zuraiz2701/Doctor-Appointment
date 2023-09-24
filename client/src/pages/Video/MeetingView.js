const LOCAL_SERVER_URL = "http://localhost:3000";
export const getToken = async () => {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/get-token`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const { token } = await response.json();
    // console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};
export const getMeetingId = async (token) => {
  try {
    const VIDEOSDK_API_ENDPOINT = `${LOCAL_SERVER_URL}/create-meeting`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    };
    const response = await fetch(VIDEOSDK_API_ENDPOINT, options).then(async (result) => {
      const { meetingId } = await result.json();
      return meetingId;
    }).catch((err) => {
      console.log("aa", err.message);
    });
    return response;
  } catch (error) {
    console.log("bb", error.message);
  }
}

//Auth token we will use to generate a meeting and connect to it
//export const authToken = "5eb65562f5ff23c6bf554fe6a742b933e9b6ba435d7585ec468cff53f8974147"
//"2b5a62a8-8104-4ed6-9a22-a4ec96498fcd"
//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyYjVhNjJhOC04MTA0LTRlZDYtOWEyMi1hNGVjOTY0OThmY2QiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5NTU0OTAyNCwiZXhwIjoxNjk1NjM1NDI0fQ.drIYDwLvBCqxtAXWOUcJiELJIHZcnonaElblLNTqhSc";
// API call to create meeting
// export const createMeeting = async ({ token }) => {
//   const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
//     method: "POST",
//     headers: {
//       authorization: `${authToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}),
//   });
//   //Destructuring the roomId from the response
//   const { roomId } = await res.json();
//   return roomId;
// };


// import React, { useState } from "react";
// import { useMeeting } from "@videosdk.live/react-sdk";
// import ParticipantView from "./ParticipantView";

// function MeetingView() {
//   const [joined, setJoined] = useState(null);
//   const { join, participants } = useMeeting({
//     onMeetingJoined: () => {
//       setJoined("JOINED");
//     }
//   });
//   const joinMeeting = () => {
//     setJoined("JOINING");
//     join();
//   };

//   return (
//     <div className="container">
//       {joined && joined === "JOINED" ? (
//         <div>
//           {Array.from(participants).map(([participantId, participant]) => (
//             <ParticipantView
//               key={participantId}
//               participantId={participantId}
//               participant={participant}
//             />
//           ))}
//         </div>
//       ) : joined && joined === "JOINING" ? (
//         <p>Joining the meeting...</p>
//       ) : (
//         <button onClick={joinMeeting}>Join the meeting</button>
//       )}
//     </div>
//   );
// }

// export default MeetingView;


// import React, { useState } from "react";
// import { useMeeting } from "@videosdk.live/react-sdk";
// import ParticipantView from "./ParticipantView";

// function MeetingView() {
//   const [joined, setJoined] = useState(null);
//   //Get the method which will be used to join the meeting.
//   //We will also get the participants list to display all participants
//   const { join, participants } = useMeeting({
//     //callback for when meeting is joined successfully
//     onMeetingJoined: () => {
//       setJoined("JOINED");
//     }
//   });
//   const joinMeeting = () => {
//     setJoined("JOINING");
//     join();
//   };

//   return (
//     <div className="container">
//       {joined && joined === "JOINED" ? (
//         <div>
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
//         <button onClick={joinMeeting}>Join the meeting</button>
//       )}
//     </div>
//   );
// }

// export default MeetingView;

// MeetingView.js
// import React, { useState } from "react";
// import { useMeeting } from "@videosdk.live/react-sdk";
// import ParticipantView from "./ParticipantView";

// function MeetingView() {
//   const [joined, setJoined] = useState(null);
//   const { join, participants } = useMeeting({
//     onMeetingJoined: () => {
//       setJoined("JOINED");
//     },
//   });

//   const joinMeeting = () => {
//     setJoined("JOINING");
//     join();
//   };

//   return (
//     <div className="container">
//       {joined === "JOINED" ? (
//         <div>
//           {[...participants.keys()].map((participantId) => (
//             <ParticipantView
//               participantId={participantId}
//               key={participantId}
//             />
//           ))}
//         </div>
//       ) : joined === "JOINING" ? (
//         <p>Joining the meeting...</p>
//       ) : (
//         <button onClick={joinMeeting}>Join the meeting</button>
//       )}
//     </div>
//   );
// }

// export default MeetingView;
