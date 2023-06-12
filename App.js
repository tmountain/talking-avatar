import React, { useRef, useState } from 'react';
import { TextInput, View, Button } from 'react-native';
import axios from 'axios';
import AnimatedBigHead from './AnimatedBigHead'; // Import the AnimatedBigHead component
import AudioPlayer from './AudioPlayer'; // Import the AudioPlayer component


// https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html
const defaultSSML = `
<speak>
How are you today?
</speak>
`

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

// Main component

export default function App() {
  const [audioUri, setAudioUri] = useState(null);
  const playbackCallback = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentVisemeIndex, setCurrentVisemeIndex] = useState(0);
  const [visemeData, setVisemeData] = useState([]);
  const [ssml, setSsml] = useState(defaultSSML);

  // This handles incoming audio playback events
  const handlePlayAudio = async () => {
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

    // FIXME: Probably need to solve for interrupts (new user input before speech is finished)
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AnimatedBigHead currentVisemeIndex={currentVisemeIndex} visemeData={visemeData} />
      <AudioPlayer audioUri={audioUri} playbackCallback={playbackCallback} />
      <Button title="Play Audio" onPress={handlePlayAudio} disabled={isLoading} />
      <TextInput
        style={{
          height: 200, // Increased height for a bigger text area
          width: 500,
          borderColor: 'gray',
          borderWidth: 1,
          marginTop: 20,
          paddingHorizontal: 10,
        }}
        onChangeText={text => setSsml(text)}
        value={ssml}
        placeholder="Enter SSML"
        multiline={true} // Enable multiline input
        numberOfLines={8} // Specify the number of visible lines
      />
    </View>
  );
}