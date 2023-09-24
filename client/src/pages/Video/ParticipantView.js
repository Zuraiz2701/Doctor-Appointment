// import { useEffect, useRef, useMemo } from 'react';
// import { useParticipant } from '@videosdk.live/react-sdk';
// import ReactPlayer from 'react-player';

// function ParticipantView(props) {
//     const micRef = useRef(null);
//     const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
//         useParticipant(props.participantId);

//     const videoStream = useMemo(() => {
//         if (webcamOn && webcamStream) {
//             const mediaStream = new MediaStream();
//             mediaStream.addTrack(webcamStream.track);
//             return mediaStream;
//         }
//     }, [webcamStream, webcamOn]);

//     useEffect(() => {
//         if (micRef.current) {
//             if (micOn && micStream) {
//                 const mediaStream = new MediaStream();
//                 mediaStream.addTrack(micStream.track);

//                 micRef.current.srcObject = mediaStream;
//                 micRef.current
//                     .play()
//                     .catch((error) =>
//                         console.error("videoElem.current.play() failed", error)
//                     );
//             } else {
//                 micRef.current.srcObject = null;
//             }
//         }
//     }, [micStream, micOn]);

//     return (
//         <div>
//             <audio ref={micRef} autoPlay playsInline muted={isLocal} />
//             {webcamOn && (
//                 <ReactPlayer
//                     playsinline // very very imp prop
//                     pip={false}
//                     light={false}
//                     controls={false}
//                     muted={true}
//                     playing={true}
//                     url={videoStream}
//                     height={"300px"}
//                     width={"300px"}
//                     onError={(err) => {
//                         console.log(err, "participant video error");
//                     }}
//                 />
//             )}
//         </div>
//     );
// }

// export default ParticipantView;

// ParticipantView.js
import React, { useEffect, useRef, useMemo } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";

function ParticipantView({ participantId }) {
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(
        participantId
    );

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);
    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;

                // Ensure the audio playback starts automatically
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("micRef playback failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div>
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
            {webcamOn && (
                <ReactPlayer
                    playsinline
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    height={"300px"}
                    width={"300px"}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />
            )}
        </div>
    );
}

export default ParticipantView;