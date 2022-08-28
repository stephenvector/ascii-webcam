import { test, expect } from "vitest";
import getClosestNumberInArray from "./get-closest-number-in-array";

test("getClosestNumberInArray", () => {
  expect(getClosestNumberInArray(0, [1, 2, 3, 4, 5])).toBe(1);
  expect(getClosestNumberInArray(10, [1, 2, 3, 4, 5])).toBe(5);
});
