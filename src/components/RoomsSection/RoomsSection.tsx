import React from "react";
import { Room } from "../Room/Room";
import { ISocketContext } from "../../types";

interface Props {
  rooms: ISocketContext["rooms"];
  onJoinRoom: (id: string) => void;
}
export const RoomsSection: React.FC<Props> = ({ onJoinRoom, rooms }) => {
  return (
    <div>
      {rooms?.length ? (
        rooms?.map((id) => <Room key={id} id={id} onJoinRoom={onJoinRoom} />)
      ) : (
        <span>There's no rooms right now :(</span>
      )}
    </div>
  );
};
