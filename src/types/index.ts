// Core type definitions for Photobooth app

export type Screen =
  | 'welcome'
  | 'capture'
  | 'review'
  | 'thanks';

export interface Photo {
  dataUrl: string;
  timestamp: number;
  index: number; // 0-3
}

export interface PhotoStrip {
  photos: Photo[];
  stripUrl: string;
  createdAt: Date;
}

export interface CameraStream {
  stream: MediaStream;
  videoTrack: MediaStreamTrack;
  deviceId?: string;
}

export interface AppState {
  screen: Screen;
  photos: Photo[];
  photoStrip: PhotoStrip | null;
  cameraStream: CameraStream | null;
  isCapturing: boolean;
  error: string | null;
}

