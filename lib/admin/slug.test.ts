import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Ultimate Battlestation")).toBe("ultimate-battlestation");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("£25,000 Cash!")).toBe("25-000-cash");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  --Cool Prize--  ")).toBe("cool-prize");
  });
});
