import { useEffect } from "react";
import { ServerToClientEvents, socket } from "../socket";

export function useSocket<T extends keyof ServerToClientEvents>(
  event?: keyof ServerToClientEvents | T,
  handler?: ServerToClientEvents[T]
) {
  useEffect(() => {
    if (!event || !handler) {
      return;
    }

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);

  return socket;
}
