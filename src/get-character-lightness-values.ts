import getCharacters from "./get-characters";
import { FONT_STRING } from "./constants";

const CHARACTER_CANVAS_WIDTH = 20;
const CHARACTER_CANVAS_HEIGHT = 28;
const CHARACTER_VERTICAL_OFFSET = 2;

/**
 * Cycle through every character that's returned by `getCharacters`, then render
 * the character onto a canvas element. Once the character is rendered,
 * calculate the average pixel lightness value.
 *
 * @returns {Record<string, value>} An object where each character's brightness
 * is mapped to a brightness value
 */
export default function getCharacterLighnessValues() {
  const characterCanvas = document.createElement("canvas");
  characterCanvas.width = CHARACTER_CANVAS_WIDTH;
  characterCanvas.height = CHARACTER_CANVAS_HEIGHT;
  const characterCanvasContext = characterCanvas.getContext("2d");
  document.body.appendChild(characterCanvas);

  const characterLightness: Record<string, number> = {};

  if (characterCanvasContext === null) {
    document.body.removeChild(characterCanvas);
    return characterLightness;
  }

  getCharacters().forEach((character) => {
    characterCanvasContext.fillStyle = "#fff";
    characterCanvasContext.fillRect(
      0,
      0,
      characterCanvas.width,
      characterCanvas.height
    );
    characterCanvasContext.fillStyle = "#000";
    characterCanvasContext.textAlign = "center";
    characterCanvasContext.textBaseline = "middle";
    characterCanvasContext.font = FONT_STRING;
    characterCanvasContext.fillText(
      character,
      CHARACTER_CANVAS_WIDTH / 2,
      CHARACTER_CANVAS_HEIGHT / 2 + CHARACTER_VERTICAL_OFFSET
    );

    const canvasData = characterCanvasContext.getImageData(
      0,
      0,
      CHARACTER_CANVAS_WIDTH,
      CHARACTER_CANVAS_HEIGHT
    );

    const lightnesses = [];

    for (let i = 0; i < canvasData.data.length; i += 4) {
      const r = canvasData.data[i];
      const g = canvasData.data[i + 1];
      const b = canvasData.data[i + 2];

      const average = (r + g + b) / 3;

      lightnesses.push(average);
    }

    const average = Math.round(
      lightnesses.reduce((acc, v) => acc + v) / lightnesses.length
    );

    characterLightness[character] = average;
  });

  document.body.removeChild(characterCanvas);

  return characterLightness;
}
