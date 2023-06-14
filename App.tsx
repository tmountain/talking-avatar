import React, { useRef, useState } from 'react';
import { TextInput, View, Button } from 'react-native';
import AnimatedBigHead from './AnimatedBigHead'; // Import the AnimatedBigHead component
import AudioPlayer from './AudioPlayer'; // Import the AudioPlayer component
import { handlePlayAudio } from './audioUtils';
import { Viseme, PlaybackCallbackRef } from './Types';


// https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html
const defaultSSML = `
<speak>
How are you today?
</speak>
`

// Main component

export default function App() {
  const [audioUri, setAudioUri] = useState("");
  const playbackCallback = useRef<PlaybackCallbackRef>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentVisemeIndex, setCurrentVisemeIndex] = useState(0);
  const [visemeData, setVisemeData] = useState<Viseme[]>([]);
  const [ssml, setSsml] = useState(defaultSSML);

  const handlePlayAudioWrapper = () => {
    handlePlayAudio(
      ssml,
      setVisemeData,
      setAudioUri,
      isPlaying,
      setPlaying,
      setCurrentVisemeIndex,
      setLoading,
      playbackCallback,
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AnimatedBigHead currentVisemeIndex={currentVisemeIndex} visemeData={visemeData} />
      <AudioPlayer audioUri={audioUri} playbackCallback={playbackCallback} />
      <Button title="Play Audio" onPress={handlePlayAudioWrapper} disabled={isLoading} />
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