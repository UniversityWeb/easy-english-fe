import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from '@/utils/authUtils';

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private client: Client | null = null;
  private subscribers: Record<string, (payload: any) => void> = {};
  private url: string | null = null;
  private reconnectDelay = 5000;
  private connected = false;
  private subscriptionHandles: Record<string, StompSubscription> = {};
  private onConnectedCallback: (() => void) | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    if (WebSocketService.instance) {
      return WebSocketService.instance;
    }

    this.url = import.meta.env.VITE_WEBSOCKET_URL || null;
    WebSocketService.instance = this;
  }

  /**
   * Get the singleton instance of WebSocketService.
   * Ensures connection readiness before returning the instance.
   */
  static async getIns(): Promise<WebSocketService> {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    // Wait for connection readiness
    await WebSocketService.instance.ensureConnected();

    return WebSocketService.instance;
  }

  /**
   * Ensure the WebSocket is connected.
   * Returns a promise that resolves when connected.
   */
  async ensureConnected(): Promise<void> {
    if (this.connected) {
      return;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        this.connect(() => {
          resolve();
        });

        // Handle connection timeout
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000); // 10 seconds timeout
      });
    }

    return this.connectionPromise;
  }

  /**
   * Connect to the WebSocket server.
   */
  connect(onConnected?: () => void): void {
    this.onConnectedCallback = onConnected || this.onConnectedCallback;

    if (this.connected) {
      console.log('WebSocket is already connected.');
      return;
    }

    if (!this.url) {
      console.error('WebSocket URL is not defined.');
      return;
    }

    this.createClient();
  }

  /**
   * Create the WebSocket client and set up event handlers.
   */
  createClient(): void {
    const token = getToken();
    const fullUrl = this.url + (token ? '?token=' + token : '');
    const socket = new SockJS(fullUrl);
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
        this.subscriptionHandles = {};
        this.connected = false;
        this.scheduleReconnect();
      },
      onStompError: (frame) => {
        console.error('Error: ' + frame.headers.message);
      },
    });

    this.client.activate();
  }

  /**
   * Schedule a reconnect attempt after a delay.
   */
  scheduleReconnect(): void {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.createClient();
    }, this.reconnectDelay);
  }

  /**
   * Handle WebSocket connection and resubscribe to topics.
   */
  onConnect(): void {
    Object.keys(this.subscribers).forEach((destination) => {
      this.subscribe(destination, this.subscribers[destination]);
    });
  }

  /**
   * Subscribe to a WebSocket topic.
   */
  subscribe(destination: string, callback: (payload: any) => void): void {
    if (this.subscriptionHandles[destination]) {
      console.warn(`Already subscribed to ${destination}`);
      return;
    }

    if (this.client && this.client.connected) {
      this.subscribers[destination] = callback;
      const subscription = this.client.subscribe(destination, (message) => {
        if (callback) {
          try {
            const payload = JSON.parse(message.body);
            callback(payload);
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
            callback(message.body);
          }
        }
      });

      this.subscriptionHandles[destination] = subscription;
      console.log(`Subscribed to ${destination}`);
    } else {
      console.error('WebSocket client not connected. Unable to subscribe.');
    }
  }

  /**
   * Unsubscribe from a WebSocket topic.
   */
  unsubscribe(destination: string): void {
    if (this.subscriptionHandles[destination]) {
      this.subscriptionHandles[destination].unsubscribe();
      delete this.subscriptionHandles[destination];
      delete this.subscribers[destination];
      console.log(`Unsubscribed from ${destination}`);
    } else {
      console.error(`No subscription found for destination: ${destination}`);
    }
  }

  /**
   * Send a message to a WebSocket topic.
   */
  send(destination: string, body: any): void {
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

  /**
   * Disconnect the WebSocket client.
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.subscriptionHandles = {};
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
  }
}

export default WebSocketService;
