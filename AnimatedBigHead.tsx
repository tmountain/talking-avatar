import React from 'react';
import { BigHead } from 'react-native-bigheads';
import { Viseme, MouthType } from './Types';
import { AvatarProps } from "react-native-bigheads"


// https://docs.aws.amazon.com/polly/latest/dg/ph-table-english-us.html
// https://melindaozel.com/viseme-cheat-sheet/
// These are a little arbitrary, but they seem to work well enough
// You can tune them by experimenting with different sentences and doing a console log
// on the viseme argument
function mapVisemeToMouth(viseme: string) {
  const mouths: Record<string, MouthType> = {
    'p': 'serious',
    't': 'serious',
    'S': 'serious',
    'T': 'open',
    'f': 'openSmile',
    'k': 'serious',
    'i': 'open',
    'r': 'openSmile',
    's': 'serious',
    '@': 'open',
    'a': 'open',
    'e': 'open',
    'E': 'open',
    'o': 'open',
    'O': 'open',
    'u': 'open',
  };

  // Check if the viseme key exists in the mapping
  if (viseme in mouths) {
    return mouths[viseme];
  }

  // Return the default mouth shape
  return 'serious';
}

function AnimatedBigHead({ currentVisemeIndex, visemeData, bigHeadConfig }: { currentVisemeIndex: number; visemeData: Viseme[], bigHeadConfig: AvatarProps }) {
  const viseme = currentVisemeIndex < visemeData.length ? visemeData[currentVisemeIndex].value : 'p';
  const mouthValue = mapVisemeToMouth(viseme);

  return (
    <BigHead
      {...bigHeadConfig}
      mouth={mouthValue}
      size={300}
      bgColor='blue'
      bgShape='circle'
    />
  );
}


export default AnimatedBigHead;
