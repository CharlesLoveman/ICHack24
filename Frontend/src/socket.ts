import { io } from "socket.io-client";
import { backendAddress } from "./env";

export const socket = io(backendAddress, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});
