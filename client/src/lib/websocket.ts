// WebSocket client for real-time updates

export const createWebSocketClient = () => {
  // Determine the WebSocket protocol based on the current page protocol
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  // WebSocket URL (using the same host but different path to avoid conflicts with Vite's HMR)
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimeout: NodeJS.Timeout | null = null;
  
  // Create event callbacks
  const onOpenCallbacks: Array<(event: Event) => void> = [];
  const onMessageCallbacks: Array<(event: MessageEvent) => void> = [];
  const onCloseCallbacks: Array<(event: CloseEvent) => void> = [];
  const onErrorCallbacks: Array<(event: Event) => void> = [];
  
  // Create WebSocket connection
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
      
      // Attempt to reconnect with exponential backoff
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
  
  // Send message
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
  
  // Add event listeners
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
  
  // Remove event listeners
  const removeEventListener = (type: string, callback: (event: any) => void) => {
    switch (type) {
      case 'open':
        const openIndex = onOpenCallbacks.indexOf(callback);
        if (openIndex !== -1) onOpenCallbacks.splice(openIndex, 1);
        break;
      case 'message':
        const messageIndex = onMessageCallbacks.indexOf(callback);
        if (messageIndex !== -1) onMessageCallbacks.splice(messageIndex, 1);
        break;
      case 'close':
        const closeIndex = onCloseCallbacks.indexOf(callback);
        if (closeIndex !== -1) onCloseCallbacks.splice(closeIndex, 1);
        break;
      case 'error':
        const errorIndex = onErrorCallbacks.indexOf(callback);
        if (errorIndex !== -1) onErrorCallbacks.splice(errorIndex, 1);
        break;
      default:
        console.warn(`Unknown event type: ${type}`);
    }
  };
  
  // Disconnect WebSocket
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
  
  // Return WebSocket client
  return {
    connect,
    disconnect,
    send,
    addEventListener,
    removeEventListener,
    get socket() { return socket; }
  };
};

export type WebSocketClient = ReturnType<typeof createWebSocketClient>;
