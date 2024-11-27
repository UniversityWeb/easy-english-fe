import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscribers = {};
    this.url = null;
    this.reconnectDelay = 5000;
    this.connected = false;
    this.subscriptionHandles = {};
    this.onConnectedCallback = null;
  }

  connect(onConnected) {
    this.url = process.env.REACT_APP_WEBSOCKET_URL;
    this.onConnectedCallback = onConnected;
    this.createClient();
  }

  createClient() {
    const socket = new SockJS(this.url);
    this.client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.connected = true;
        this.onConnect();

        // Execute the onConnected callback if provided
        if (this.onConnectedCallback) {
          this.onConnectedCallback();
        }
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        this.connected = false;
        this.scheduleReconnect();
      },
      onStompError: (frame) => {
        console.error('Error: ' + frame.headers.message);
      },
    });

    this.client.activate();
  }

  scheduleReconnect() {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.createClient();
    }, this.reconnectDelay);
  }

  onConnect() {
    Object.keys(this.subscribers).forEach((destination) => {
      this.subscribe(destination, this.subscribers[destination]);
    });
  }

  subscribe(destination, callback) {
    if (this.client && this.client.connected) {
      this.subscribers[destination] = callback;
      const subscription = this.client.subscribe(destination, (message) => {
        if (callback) {
          const payload = JSON.parse(message.body);
          callback(payload);
        }
      });

      this.subscriptionHandles[destination] = subscription;
      this.subscribers[destination] = callback;
      console.log(`Subscribed to ${destination}`);
    } else {
      console.error('WebSocket client not connected. Unable to subscribe.');
    }
  }

  unsubscribe(destination) {
    if (this.subscriptionHandles[destination]) {
      this.subscriptionHandles[destination].unsubscribe();
      delete this.subscriptionHandles[destination];
      delete this.subscribers[destination];
      console.log(`Unsubscribed from ${destination}`);
    } else {
      console.error(`No subscription found for destination: ${destination}`);
    }
  }

  send(destination, body) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
      console.log(`Message sent to ${destination}:`, body);
    } else {
      console.error('WebSocket client not connected. Unable to send message.');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
