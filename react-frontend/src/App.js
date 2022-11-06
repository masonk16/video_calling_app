import { useEffect, useState } from "react";
import Join from "./Join";
import Meeting from "./Meeting";
import MeetingEnded from "./MeetingEnded";

// Initializing Metered Video SDK
const meteredMeeting = new window.Metered.Meeting();

const API_LOCATION = "https://localhost:5000";

function App() {
  // Will be set to true when user joins the meeting and update the UI
  const [meetingJoined, setMeetingJoined] = useState(false);
  // Storing onlineUsers, updating when a user joins or leaves the meeting
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [remoteTracks, setRemoteTracks] = useState([]);

  const [username, setUsername] = useState("");

  const [localVideoStream, setLocalVideoStream] = useState(null);

  const [micShared, setMicShared] = useState(false);
  const [cameraShared, setCameraShared] = useState(false);
  const [screenShared, setScreenShared] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState({});

  // This useEffect hook will contain all event handlers
  // like participantJoined, participantLeft, etc.
  useEffect(() => {
    meteredMeeting.on("remoteTrackStarted", (trackItem) => {
      remoteTracks.push(trackItem);
      setRemoteTracks([...remoteTracks]);
    });

    meteredMeeting.on("remoteTrackStopped", (trackItem) => {
      for (let i = 0; i < remoteTracks.length; i++) {
        if (trackItem.streamId === remoteTracks[i].streamId) {
          remoteTracks.splice(i, 1);
        }
      }
      setRemoteTracks([...remoteTracks]);
    });

    meteredMeeting.on("participantJoined", (localTrackItem) => {});

    meteredMeeting.on("participantLeft", (localTrackItem) => {});

    meteredMeeting.on("onlineParticipants", (onlineParticipants) => {});

    return () => {
      meteredMeeting.removeListener("remoteTrackStarted");
      meteredMeeting.removeListener("remoteTrackStopped");
      meteredMeeting.removeListener("participantJoined");
      meteredMeeting.removeListener("participantLeft");
      meteredMeeting.removeListener("onlineParticipants");
    };
  });

  // Calls the API to create a new room and join the user.
  async function handleCreateMeeting(username) {
    // Call create room API
    const { data } = await axios.post(API_LOCATION + "/api/create/room");
    // Get metered domain and roomName from response
    const METERED_DOMAIN = response.data.METERED_DOMAIN;
    const roomName = data.roomName;

    // Call join() method of the SDK
    const joinResponse = await meteredMeeting.join({
      name: username,
      roomURL: METERED_DOMAIN + "/" + roomName,
    });

    //Update meetingJoined state to true
    setMeetingJoined(true);
  }

  // Calls API to validate the room and join the user
  async function handleJoinMeeting(roomName, username) {
    // Call API to validate the roomName
    const response = await axios.get(API_LOCATION + "/api/validate-meeting?roomName=" + roomName);

    if (response.data.roomFound) {
      // Call API to fetch Metered Domain
      const { data } = await axios.get(API_LOCATION + "/api/metered-domain");

      // Extract Metered Domain and roomName from response
      const METERED_DOMAIN = data.METERED_DOMAIN;

      // Call join() method of the SDK
      const joinResponse = await meteredMeeting.join({
        name: username,
        roomURL: METERED_DOMAIN + "/" + roomName,
      });
      setMeetingJoined(true);
    } else {
      alert("Invalid roomName");
    }
  }

  // Handling Microphone Button
  async function handleMicBtn() {
    if (micShared) {
      await meteredMeeting.stopAudio();
      setMicShared(false);
    } else {
      await meteredMeeting.startAudio();
      setMicShared(true);
    }
  }
  // handles Camer button
  async function handleCameraBtn() {
    if (cameraShared) {
      await meteredMeeting.stopVideo();
      setLocalVideoStream(null);
      setCameraShared(false);
    } else {
      await meteredMeeting.getLocalVideoStream();
      setLocalVideoStream(stream);
      setCameraShared(true);
    }
  }

  // Handles Screen button
  async function handelScreenBtn() {
    if (!screenShared) {
      await meteredMeeting.startScreenShare();
      setScreenShared(false);
    } else {
      await meteredMeeting.stopVideo();
      setCameraShared(false);
      setScreenShared(true);
    }
  }

  // handles leave button
  async function handleLeaveBtn() {
    await meteredMeeting.leaveMeeting();
    setMeetingEnded(true)
  }

  return (
    <div className="App">
      {meetingJoined ? (
        <Meeting 
          onlineUsers={onlineUsers}
          handleMicBtn={handleMicBtn}
          handleCameraBtn={handleCameraBtn}
          handleScreenBtn={handleScreenBtn}
          handleLeaveBtn={handleLeaveBtn}
          localVideoStream={localVideoStream}
          remoteTracks={remoteTracks}
          username={username}
          roomName={roomName}
          meetingInfo={meetingInfo}
        />
      ) : (
        <Join 
          handleCreateMeeting={handleCreateMeeting}
          handleJoinMeeting={handleJoinMeeting}
        />
      )}
    </div>
  );

}

export default App;