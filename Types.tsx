import { AVPlaybackStatus } from 'expo-av';

export interface Viseme {
  time: number;
  type: string;
  value: string;
}

export type PlaybackStatusUpdate = (status: AVPlaybackStatus) => void

export type PlaybackCallbackRef = null | PlaybackStatusUpdate
