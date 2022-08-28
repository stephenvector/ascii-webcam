import { Dimensions } from "./types";

export function getMultiplier(
  dimensionsContainer: Dimensions,
  dimensionsChild: Dimensions
) {
  const aspectRatioContainer =
    dimensionsContainer.width / dimensionsContainer.height;
  const aspectRatioChild = dimensionsChild.width / dimensionsChild.height;

  if (aspectRatioContainer <= aspectRatioChild) {
    return dimensionsContainer.width / dimensionsChild.width;
  }

  return dimensionsContainer.height / dimensionsChild.height;
}
