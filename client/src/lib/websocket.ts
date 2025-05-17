let client: WebSocketClient | null = null;

const createWebSocketClient = () => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimeout: NodeJS.Timeout | null = null;

  const onOpenCallbacks: Array<(event: Event) => void> = [];
  const onMessageCallbacks: Array<(event: MessageEvent) => void> = [];
  const onCloseCallbacks: Array<(event: CloseEvent) => void> = [];
  const onErrorCallbacks: Array<(event: Event) => void> = [];

  const connect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) return;

    socket = new WebSocket(wsUrl);

    socket.onopen = (event) => {
      console.log("WebSocket connected");
      reconnectAttempts = 0;
      onOpenCallbacks.forEach(callback => callback(event));
    };

    socket.onmessage = (event) => {
      onMessageCallbacks.forEach(callback => callback(event));
    };

    socket.onclose = (event) => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      onCloseCallbacks.forEach(callback => callback(event));

      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      reconnectAttempts++;

      reconnectTimeout = setTimeout(() => {
        connect();
      }, delay);
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
      onErrorCallbacks.forEach(callback => callback(event));
    };
  };

  const send = (data: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return false;
    }

    try {
      socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  const addEventListener = (type: string, callback: (event: any) => void) => {
    switch (type) {
      case 'open':
        onOpenCallbacks.push(callback);
        break;
      case 'message':
        onMessageCallbacks.push(callback);
        break;
      case 'close':
        onCloseCallbacks.push(callback);
        break;
      case 'error':
        onErrorCallbacks.push(callback);
        break;
      default:
        console.warn(`Unknown event type: ${type}`);
    }
  };

  const removeEventListener = (type: string, callback: (event: any) => void) => {
    const remove = (arr: any[], cb: any) => {
      const index = arr.indexOf(cb);
      if (index !== -1) arr.splice(index, 1);
    };

    switch (type) {
      case 'open':
        remove(onOpenCallbacks, callback);
        break;
      case 'message':
        remove(onMessageCallbacks, callback);
        break;
      case 'close':
        remove(onCloseCallbacks, callback);
        break;
      case 'error':
        remove(onErrorCallbacks, callback);
        break;
      default:
        console.warn(`Unknown event type: ${type}`);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      socket = null;
    }

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

  return {
    connect,
    disconnect,
    send,
    addEventListener,
    removeEventListener,
    get socket() { return socket; }
  };
};

export const getWebSocketClient = (): WebSocketClient => {
  if (!client) {
    client = createWebSocketClient();
    client.connect(); // Automatically connect on first use
  }
  return client;
};

export type WebSocketClient = ReturnType<typeof createWebSocketClient>;

