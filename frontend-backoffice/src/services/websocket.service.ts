import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) return;
    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinRoom(room: string): void {
    this.socket?.emit('join', room);
  }

  on<T = unknown>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback as (...args: unknown[]) => void);
  }

  off(event: string): void {
    this.socket?.off(event);
  }

  emit(event: string, data: object): void {
    this.socket?.emit(event, data);
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const webSocketService = new WebSocketService();
