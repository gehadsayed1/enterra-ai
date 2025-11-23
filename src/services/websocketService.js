import { CONFIG } from "@/config";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.listeners = {
      onOpen: [],
      onMessage: [],
      onError: [],
      onClose: [],
    };
  }

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    console.log("🔄 Connecting to WebSocket...");
    this.socket = new WebSocket(CONFIG.WEBSOCKET_URL);

    this.socket.onopen = () => {
      console.log("✅ WebSocket connected successfully");
      this.reconnectAttempts = 0;
      this.notify("onOpen");
    };

    this.socket.onmessage = (event) => {
      this.notify("onMessage", event);
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      this.notify("onError", error);
    };

    this.socket.onclose = (event) => {
      console.log("🔌 WebSocket closed", event.code, event.reason);
      this.socket = null;
      this.notify("onClose", event);

      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`🔄 Reconnecting... ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        setTimeout(() => this.connect(), 2000);
      }
    };
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
      return true;
    } else if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.addEventListener("open", () => this.socket.send(data), { once: true });
        return true;
    } else {
      console.warn("⚠️ WebSocket not connected. Attempting to connect...");
      this.connect();
      return false;
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

export const websocketService = new WebSocketService();
