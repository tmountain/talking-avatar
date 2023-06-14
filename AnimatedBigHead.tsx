import React from 'react';
import { BigHead } from 'react-native-bigheads';

// https://docs.aws.amazon.com/polly/latest/dg/ph-table-english-us.html
// https://melindaozel.com/viseme-cheat-sheet/
// These are a little arbitrary, but they seem to work well enough
// You can tune them by experimenting with different sentences and doing a console log
// on the viseme argument
function mapVisemeToMouth(viseme) {
  const mouths = {
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

function AnimatedBigHead({ currentVisemeIndex, visemeData }) {
  const viseme = currentVisemeIndex < visemeData.length ? visemeData[currentVisemeIndex].value : 'p';
  const mouthValue = mapVisemeToMouth(viseme);

  return (
    <BigHead
      accessory="shades"
      bgColor="blue"
      bgShape="circle"
      body="chest"
      clothing="tankTop"
      clothingColor="black"
      eyebrows="angry"
      eyes="wink"
      facialHair="mediumBeard"
      graphic="vue"
      hair="short"
      hairColor="black"
      hat="none"
      hatColor="green"
      lashes={false}
      mouth={mouthValue}
      size={300}
      skinTone="brown"
    />
  );
}

export default AnimatedBigHead;
