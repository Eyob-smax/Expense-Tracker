export function getCalculatedDate(
  type: "today" | "after" | "before",
  amount?: number
) {
  if (type === "after" && amount) {
    return new Date(
      Date.now() + amount * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (type === "before" && amount) {
    return new Date(
      Date.now() - amount * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function sum(a: number, b: number): number {
  return a + b;
}
