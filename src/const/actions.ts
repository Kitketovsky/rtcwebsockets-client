export const ACTIONS = {
  RTC_OFFER: "rtc:offer", // Sending an SDP offer
  RTC_ANSWER: "rtc:answer", // Sending an SDP answer
  RTC_ICE: "rtc:ice", // Exchange of ICE candidates
  ROOM_LIST: "room:list", // Send a list of non-sockets rooms
  ROOM_CREATE: "room:create", // Create a new room and join it
  ROOM_JOIN: "room:join", // Client joins an existing room
  ROOM_NEW_CLIENT_NOTIFICATION: "room:new_client", // Notify about a new client in the room
  ROOM_CLIENT_LEAVE_NOTIFICATION: "room:client_leave", // Someone left the room
};
