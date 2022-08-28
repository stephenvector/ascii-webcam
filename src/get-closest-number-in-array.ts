export default function getClosestNumberInArray(
  targetNumber: number,
  numberArray: number[]
) {
  return numberArray.reduce((prev, curr) => {
    return Math.abs(curr - targetNumber) < Math.abs(prev - targetNumber)
      ? curr
      : prev;
  });
}
