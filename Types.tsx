import { AVPlaybackStatus } from 'expo-av';

// API

export interface Viseme {
  time: number;
  type: string;
  value: string;
}

// Playback

export type PlaybackStatusUpdate = (status: AVPlaybackStatus) => void

export type PlaybackCallbackRef = null | PlaybackStatusUpdate

// Big Head

export type MouthType = 'grin' | 'sad' | 'openSmile' | 'lips' | 'open' | 'serious' | 'tongue' | 'piercedTongue' | 'vomitingRainbow';
