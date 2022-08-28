import getCharacterLighnessValues from "./get-character-lightness-values";
import getClosestNumberInArray from "./get-closest-number-in-array";

/**
 * Get an array of characters with a length of 256, which corresponds to the
 * values of an rgb value (0-255)
 * @returns {String[]}
 */
export default function getCharacterLightnessMap(): string[] {
  const characterLightnessValues = getCharacterLighnessValues();
  const characterLightnessMap: Record<number, string> = {};

  const minLightness = Math.min(...Object.values(characterLightnessValues));
  const maxLightness = Math.max(...Object.values(characterLightnessValues));

  const originalLightnessRange = maxLightness - minLightness;
  const newLightnessRange = 255;

  Object.entries(characterLightnessValues).forEach(([character, lightness]) => {
    const scaledLightness = Math.round(
      ((lightness - minLightness) / originalLightnessRange) * newLightnessRange
    );
    characterLightnessMap[scaledLightness] = character;
  });

  const scaledLightnessValues = Object.keys(characterLightnessMap).map((v) =>
    parseInt(v)
  );

  const characters = new Array(256).fill(0);

  return characters.map((_value, index) => {
    return characterLightnessMap[
      getClosestNumberInArray(index, scaledLightnessValues)
    ];
  });
}
