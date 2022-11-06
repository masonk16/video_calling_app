import { useEffect, useState } from "react";
import Join from "./Join";
import Meeting from "./Meeting";

// Initializing Metered Video SDK
const meteredMeeting = new window.Metered.Meeting();

function App() {
  // Will be set to true when user joins the meeting and update the UI
  const [meetingJoined, setMeetingJoined] = useState(false);
  // Storing onlineUsers, updating when a user joins or leaves the meeting
  const [onlineUsers, setOnlineUsers] = useState([]);

  // This useEffect hook will contain all event handlers
  // like participantJoined, participantLeft, etc.
  useEffect(() => {}, []);

  // Calls the API to create a new room and join the user.
  function handleCreateMeeting(username) {}

  // Calls API to validate the room and join the user
  function handleJoinMeeting(roomName, username) {}

  return (
    <div className="App">
      {meetingJoined ? (
        <Meeting onlineUsers={onlineUsers}/>
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