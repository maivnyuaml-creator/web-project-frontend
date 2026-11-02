import { io, Socket } from 'socket.io-client';
import { ChatMessage, TipEvent, StreamStatus, TipGoal } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class SocketManager {
  private socket: Socket | null = null;
  private currentRoomId: string | null = null;

  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        if (this.currentRoomId) {
          this.socket?.emit('join-room', { roomId: this.currentRoomId });
        }
      });
    }

    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public joinRoom(roomId: string): void {
    const s = this.connect();
    this.currentRoomId = roomId;
    s.emit('join-room', { roomId });
  }

  public leaveRoom(roomId: string): void {
    if (this.socket && this.currentRoomId === roomId) {
      this.socket.emit('leave-room', { roomId });
      this.currentRoomId = null;
    }
  }

  public sendMessage(roomId: string, content: string): void {
    const s = this.connect();
    s.emit('send-message', { roomId, content });
  }

  public onNewMessage(callback: (msg: ChatMessage) => void): () => void {
    const s = this.connect();
    s.on('new-message', callback);
    return () => s.off('new-message', callback);
  }

  public onTip(callback: (tip: TipEvent) => void): () => void {
    const s = this.connect();
    s.on('tip-sent', callback);
    return () => s.off('tip-sent', callback);
  }

  public onViewerCount(callback: (data: { count: number }) => void): () => void {
    const s = this.connect();
    s.on('viewer-count', callback);
    return () => s.off('viewer-count', callback);
  }

  public onRoomStatus(callback: (data: { status: StreamStatus; viewerCount: number }) => void): () => void {
    const s = this.connect();
    s.on('room-status-changed', callback);
    return () => s.off('room-status-changed', callback);
  }

  public onGoalUpdate(callback: (data: { tipGoal: TipGoal }) => void): () => void {
    const s = this.connect();
    s.on('goal-updated', callback);
    return () => s.off('goal-updated', callback);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRoomId = null;
    }
  }
}

export const socketService = new SocketManager();
