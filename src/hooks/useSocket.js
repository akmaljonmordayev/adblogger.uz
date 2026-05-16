import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Socket.io server URL (strip /api/v1 suffix if present)
const SOCKET_URL = (import.meta.env.VITE_API_URL || "https://adblogger-uz.onrender.com/api/v1")
  .replace("/api/v1", "");

let sharedSocket = null;

export function getSocket() {
  if (!sharedSocket) {
    sharedSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
  }
  return sharedSocket;
}

export function disconnectSocket() {
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
  }
}

/**
 * Connects to socket, joins a room, and handles cleanup.
 * @param {string|null} room — e.g. "user_<id>" or "admin_room"
 * @param {Object} handlers — { eventName: handler }
 */
export function useSocket(room, handlers = {}) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!room) return;

    const socket = getSocket();

    const onConnect = () => {
      socket.emit("join_user_room", room.replace("user_", ""));
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    // Register event handlers
    const registeredEvents = Object.keys(handlersRef.current);
    registeredEvents.forEach((event) => {
      socket.on(event, (...args) => handlersRef.current[event]?.(...args));
    });

    return () => {
      socket.off("connect", onConnect);
      registeredEvents.forEach((event) => {
        socket.off(event);
      });
    };
  }, [room]);
}

/**
 * Admin hook — joins admin_room to receive new application notifications
 */
export function useAdminSocket(handlers = {}) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const socket = getSocket();

    // "admin" → server joins socket to admin_room
    const onConnect = () => {
      socket.emit("join_user_room", "admin");
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    const registeredEvents = Object.keys(handlersRef.current);
    registeredEvents.forEach((event) => {
      socket.on(event, (...args) => handlersRef.current[event]?.(...args));
    });

    return () => {
      socket.off("connect", onConnect);
      registeredEvents.forEach((event) => socket.off(event));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
