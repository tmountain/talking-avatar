import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

// The playbackCallback is a function that is called when the audio player
// updates its playback status. This is useful for updating the UI when the
// audio player starts or stops playing.
// See this example for context: https://docs.expo.dev/versions/latest/sdk/av/#example-setonplaybackstatusupdate
const AudioPlayer = ({ audioUri, playbackCallback }: { audioUri: string; playbackCallback: any }) => {
  const [sound, setSound] = useState(new Audio.Sound());

  useEffect(() => {
    const initAudio = async () => {
      console.log('Initializing audio');
      // Prevents a crash when the audioUri is null (initial state)
      if (!audioUri) {
        return;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri }, { shouldPlay: true });
      setSound(sound);
      if (playbackCallback.current) {
        sound.setOnPlaybackStatusUpdate(playbackCallback.current);
      }
      await sound.playAsync();
    };

    initAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri, playbackCallback]);

  // No component rendered
  return null;
};

export default AudioPlayer;
