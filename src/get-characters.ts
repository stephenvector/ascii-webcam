/**
 * Get a array of characters to use to draw the video image with
 * @returns {String[]} The characters with keycodes in the range of 33 to 126
 */
export default function getCharacters(): string[] {
  const characters: string[] = [];

  for (let i = 33; i < 126; i++) {
    characters.push(String.fromCharCode(i));
  }

  return characters;
}
