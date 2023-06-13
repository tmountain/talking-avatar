import axios from 'axios';

// FIXME: load this from an env var
const svcURL = 'http://localhost:3000';

// FIXME: load this from the UI
const voice = 'Joey';

// Helper functions

async function fetchVisemeData(ssml) {
  try {
    const response = await axios.post(`${svcURL}/visemes`, {
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
async function fetchAudioData(ssml) {
  try {
    const response = await axios.post(`${svcURL}/speech`, {
      ssml: ssml,
      voice
    });

    // This incantation is necessary for expo to work properly
    const audioData = response.data.AudioStream.data;
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
function animateVisemes(visemeData, setCurrentVisemeIndex) {
  let currentIndex = 0;
  visemeData.forEach((viseme) => {
    setTimeout(() => {
      setCurrentVisemeIndex(currentIndex);
      currentIndex++;
    }, viseme.time);
  });
}


// audioUtils.js
export async function handlePlayAudio(
    ssml,
    setVisemeData,
    setAudioUri,
    isPlaying,
    setPlaying,
    setCurrentVisemeIndex,
    setLoading,
    playbackCallback,
  ) {
    setLoading(true);
  
    try {
      const visemeData = await fetchVisemeData(ssml);
      setVisemeData(visemeData);
      const audioUri = await fetchAudioData(ssml);
  
      const onPlaybackStatusUpdate = (status) => {
        if (status.isPlaying && !isPlaying) {
          setPlaying((prevState) => {
            if (!prevState) {
              console.log('Playback status:', status);
              animateVisemes(visemeData, setCurrentVisemeIndex);
            }
            return true;
          });
        }
  
        if (status.didJustFinish) {
          setPlaying(false);
          setCurrentVisemeIndex(0);
        }
      };
  
      playbackCallback.current = onPlaybackStatusUpdate;
      setAudioUri(audioUri);
    } catch (error) {
      console.error(error);
    }
  
    setLoading(false);
  }
  