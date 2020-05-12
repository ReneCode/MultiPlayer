import Randomize from "./Randomize";

describe("Randomize", () => {
  it("generateInt", () => {
    for (let i = 0; i < 100; i++) {
      const nr = Randomize.generateInt(6) + 1;
      expect(nr).toBeGreaterThanOrEqual(1);
      expect(nr).toBeLessThanOrEqual(6);
    }
  });

  it("generateId", () => {
    const id = Randomize.generateId(10);
    expect(id).toHaveLength(10);
  });
});
