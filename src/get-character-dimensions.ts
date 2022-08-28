import { FONT_STRING } from "./constants";
import { Dimensions } from "./types";

/**
 * Get the dimensions of a character by rendering it in a <span> element and
 * then getting it's bounding client rectangle dimensions.
 *
 * @returns {Dimensions} An object with the `width` & `height` of a
 * character
 */
export default function getCharacterDimensions(): Dimensions {
  const span = document.createElement("span");
  span.style.font = FONT_STRING;
  span.innerText = "A";
  document.body.appendChild(span);
  const { width, height } = span.getBoundingClientRect();
  document.body.removeChild(span);
  return { width, height };
}
