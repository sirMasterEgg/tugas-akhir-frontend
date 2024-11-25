import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/index.store.ts";
import { io, Socket } from "socket.io-client";
import { customLogger, LogType } from "../helpers/logger.ts";
import { toast } from "react-toastify";

let socketInstance: Socket | null = null;
const getSocketInstance = (token: string): Socket => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_WEBSOCKET_URL as string, {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

export default function useWebsocket({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  events = (_current: Socket) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cleanup = (_current: Socket | null) => {},
  isInitial = false,
} = {}) {
  const auth = useSelector((state: RootState) => state.auth);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    /*socket.current = io(import.meta.env.VITE_WEBSOCKET_URL as string, {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!socket.current.connected) {
      socket.current.connect();
    }

    socket.current.on("connect", () => {
      customLogger("[Websocket] Socket is connected!", LogType.SUCCESS);
    });

    socket.current.on("disconnect", () => {
      customLogger("[Websocket] Socket is disconnected!", LogType.WARNING);
    });

    socket.current.on("exception", (data) => {
      customLogger(`[Websocket] Exception: ${data}`, LogType.ERROR);
    });

    events(socket.current);

    return () => {
      socket.current?.off("disconnect");
      socket.current?.off("connect");
      socket.current?.off("exception");
      cleanup(socket.current);
    };*/

    socket.current = getSocketInstance(auth.token);

    if (socket.current) {
      if (isInitial) {
        socket.current.on("connect", () => {
          customLogger(
            "[WebsocketInstance] Socket is connected!",
            LogType.SUCCESS
          );
          socket.current?.emit("join", auth?.user?.id as string);
        });

        socket.current.on("disconnect", () => {
          customLogger(
            "[WebsocketInstance] Socket is disconnected!",
            LogType.WARNING
          );
          socket.current?.emit("leave", auth?.user?.id as string);
        });

        socket.current.on("exception", (data) => {
          toast.error("An error occurred, please try again later.", {
            containerId: "global",
          });
          toast.error("An error occurred, please try again later.", {
            containerId: "local",
          });
          customLogger(`[WebsocketInstance] Exception: ${data}`, LogType.ERROR);
          console.error(data);
        });
      }

      events(socket.current);
    }

    return () => {
      if (socket.current) {
        if (isInitial) {
          socket.current.off("disconnect");
          socket.current.off("connect");
          socket.current.off("exception");
        }
        cleanup(socket.current);
      }
    };
  }, [auth.token]);

  return socket;
}
