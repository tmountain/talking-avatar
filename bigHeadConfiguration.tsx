import { AvatarProps } from "react-native-bigheads"

import {
    theme,
    eyesMap,
    eyebrowsMap,
    mouthsMap,
    hairMap,
    facialHairMap,
    clothingMap,
    accessoryMap,
    graphicsMap,
    hatMap,
    bodyMap
} from "react-native-bigheads"

function selectRandomKey(object: { [key: string]: any }) {
    return Object.keys(object)[
        Math.floor(Math.random() * Object.keys(object).length)
    ];
}

export function getRandomBigHeadConfiguration(): AvatarProps {
    const skinTone = selectRandomKey(theme.colors.skin) as keyof typeof theme.colors.skin;
    const eyes = selectRandomKey(eyesMap) as keyof typeof eyesMap;
    const eyebrows = selectRandomKey(eyebrowsMap) as keyof typeof eyebrowsMap;
    const mouth = selectRandomKey(mouthsMap) as keyof typeof mouthsMap;
    const hair = selectRandomKey(hairMap) as keyof typeof hairMap;
    const facialHair = selectRandomKey(facialHairMap) as keyof typeof facialHairMap;
    const clothing = selectRandomKey(clothingMap) as keyof typeof clothingMap;
    const accessory = selectRandomKey(accessoryMap) as keyof typeof accessoryMap;
    const graphic = selectRandomKey(graphicsMap) as keyof typeof graphicsMap;
    const hat = selectRandomKey(hatMap) as keyof typeof hatMap;
    const body = selectRandomKey(bodyMap) as keyof typeof bodyMap;

    const hairColor = selectRandomKey(theme.colors.hair) as keyof typeof theme.colors.hair;
    const clothingColor = selectRandomKey(theme.colors.clothing) as keyof typeof theme.colors.clothing;
    const bgShape = 'circle';
    const bgColor = selectRandomKey(theme.colors.bgColors) as keyof typeof theme.colors.bgColors;
    const lipColor = selectRandomKey(theme.colors.lipColors) as keyof typeof theme.colors.lipColors;
    const hatColor = selectRandomKey(theme.colors.clothing) as keyof typeof theme.colors.clothing;
    const showBackground = true;
    const lashes = Math.random() > 0.5;
    const size = 300;
    const noMask = (accessory: keyof typeof accessoryMap): keyof typeof accessoryMap => accessory === "faceMask" ? "none" : accessory;


    return {
        accessory: noMask(accessory),
        body,
        clothing,
        clothingColor,
        eyebrows,
        eyes,
        facialHair,
        graphic,
        hair,
        hairColor,
        hat,
        hatColor,
        lashes,
        mouth,
        skinTone,
        bgShape,
        bgColor,
        lipColor,
        showBackground,
        size,
    };
}

export const BigHeadConfiguration: Record<string, AvatarProps> = {
    eugene: {
        accessory: "none",
        body: "chest",
        clothing: "dressShirt",
        clothingColor: "blue",
        eyebrows: "serious",
        eyes: "normal",
        facialHair: "mediumBeard",
        graphic: "gatsby",
        hair: "balding",
        hairColor: "orange",
        hat: "none",
        hatColor: "black",
        lashes: false,
        mouth: "serious",
        skinTone: "brown",
    },
    johnny: {
        accessory: "shades",
        bgColor: "blue",
        bgShape: "circle",
        body: "chest",
        clothing: "tankTop",
        clothingColor: "black",
        eyebrows: "angry",
        eyes: "wink",
        facialHair: "mediumBeard",
        graphic: "vue",
        hair: "short",
        hairColor: "black",
        hat: "none",
        hatColor: "green",
        lashes: false,
        mouth: "serious",
        skinTone: "brown",
    },
}