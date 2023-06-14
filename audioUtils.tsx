import axios, { AxiosResponse } from 'axios';
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Viseme, PlaybackCallbackRef, PlaybackStatusUpdate } from './Types';

// FIXME: load this from an env var
const svcURL = 'http://localhost:3000';

// FIXME: load this from the UI
const voice = 'Joey';

// Helper functions

async function fetchVisemeData(ssml: string): Promise<Viseme[]> {
  try {
    const response: AxiosResponse<Viseme[]> = await axios.post(`${svcURL}/visemes`, {
      ssml: ssml,
      voice
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching viseme data:', error);
    throw error;
  }
}

// Fetch the audio data from the backend
async function fetchAudioData(ssml: string): Promise<string> {
  try {
    const response: AxiosResponse = await axios.post(`${svcURL}/speech`, {
      ssml: ssml,
      voice
    });

    // This incantation is necessary for expo to work properly
    const audioData: number[] = response.data.AudioStream.data;
    const blob = new Blob([new Uint8Array(audioData)], { type: 'audio/mpeg' });
    const audioUri = URL.createObjectURL(blob);
    return audioUri;
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error('Error fetching audio data:', error);
    // You might want to throw the error or return an error message here
    throw error;
  }
}

// Animate the visemes by scheduling timers for each successive viseme
// The viseme data contains the time delay in milliseconds for each viseme
function animateVisemes(visemeData: Viseme[], setCurrentVisemeIndex: (index: number) => void) {
  let currentIndex = 0;
  visemeData.forEach((viseme) => {
    setTimeout(() => {
      setCurrentVisemeIndex(currentIndex);
      currentIndex++;
    }, viseme.time);
  });
}

export async function handlePlayAudio(
  ssml: string,
  setVisemeData: React.Dispatch<React.SetStateAction<Viseme[]>>,
  setAudioUri: React.Dispatch<React.SetStateAction<string>>,
  isPlaying: boolean,
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentVisemeIndex: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  playbackCallback: React.MutableRefObject<PlaybackCallbackRef>,
) {
  setLoading(true);

  try {
    const visemeData = await fetchVisemeData(ssml);
    setVisemeData(visemeData);
    const audioUri = await fetchAudioData(ssml);

    const onPlaybackStatusUpdate: PlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      const avStatus = status as AVPlaybackStatusSuccess;

      if (avStatus.isPlaying && !isPlaying) {
        setPlaying((prevState: boolean): boolean => {
          if (!prevState) {
            console.log('Playback status:', status);
            animateVisemes(visemeData, setCurrentVisemeIndex);
          }
          return true;
        });
      }

      if (avStatus.didJustFinish) {
        setPlaying(false);
        setCurrentVisemeIndex(0);
      }
    };

    playbackCallback.current = onPlaybackStatusUpdate
    setAudioUri(audioUri);
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
}
