import { ISocketContext } from "../../types";
import React from "react";

interface Props {
  username: ISocketContext["username"];
}
export const Header: React.FC<Props> = ({ username }) => {
  return (
    <div>
      <h1>Login Page</h1>
      <span>Welcome, {username}!</span>
    </div>
  );
};
