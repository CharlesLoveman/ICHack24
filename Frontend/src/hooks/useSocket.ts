import { useEffect } from "react";
import { socket } from "../socket";

export function useSocket<T>(event?: string, handler?: (data: T) => void) {
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
