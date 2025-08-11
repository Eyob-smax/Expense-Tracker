import { sum } from "./util";
test("should return the sum of two numbers", () => {
  expect(sum(1, 2)).toBe(3);
  expect(sum(-1, 1)).toBe(0);
  expect(sum(0, 0)).toBe(0);
});

import { getCalculatedDate } from "./util";

test("should return today's date in the correct format", () => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  expect(getCalculatedDate("today")).toBe(today);
});
