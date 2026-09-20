import { describe, it, expect } from "vitest";
import { sortSources } from "./utilities";
import { Source } from "../types/drawref";

describe("sortSources", () => {
  it("places sample sources at the top and non-sample sources underneath in case-sensitive alphabetical order", () => {
    const input: Source[] = [
      { name: "zebra", source_type: "local", root_path: "/zebra", enabled: true },
      { name: "Beta", source_type: "local", root_path: "/beta", enabled: true },
      { name: "Sample Data", source_type: "samples", root_path: "internal://samples", enabled: true },
      { name: "Alpha", source_type: "local", root_path: "/alpha", enabled: true },
      { name: "apple", source_type: "local", root_path: "/apple", enabled: true },
    ];

    const sorted = sortSources(input);

    expect(sorted.map((s) => s.name)).toEqual(["Sample Data", "Alpha", "Beta", "apple", "zebra"]);
  });

  it("handles source_type 'sample' as well as 'samples'", () => {
    const input: Source[] = [
      { name: "My Local", source_type: "local", root_path: "/local", enabled: true },
      { name: "Sample Two", source_type: "sample", root_path: "internal://sample2", enabled: true },
      { name: "Sample One", source_type: "samples", root_path: "internal://sample1", enabled: true },
    ];

    const sorted = sortSources(input);

    expect(sorted.map((s) => s.name)).toEqual(["Sample One", "Sample Two", "My Local"]);
  });

  it("sorts multiple sample sources case-sensitive alphabetically among themselves", () => {
    const input: Source[] = [
      { name: "sample B", source_type: "samples", root_path: "/b", enabled: true },
      { name: "Sample A", source_type: "samples", root_path: "/a", enabled: true },
      { name: "Sample C", source_type: "samples", root_path: "/c", enabled: true },
    ];

    const sorted = sortSources(input);

    expect(sorted.map((s) => s.name)).toEqual(["Sample A", "Sample C", "sample B"]);
  });

  it("does not mutate the original array", () => {
    const input: Source[] = [
      { name: "Z", source_type: "local", root_path: "/z", enabled: true },
      { name: "A", source_type: "samples", root_path: "/a", enabled: true },
    ];
    const copy = [...input];

    sortSources(input);

    expect(input).toEqual(copy);
  });

  it("handles empty array and sources with missing names", () => {
    expect(sortSources([])).toEqual([]);

    const input: Source[] = [
      { name: "B", source_type: "local", root_path: "/b", enabled: true },
      { name: "", source_type: "local", root_path: "/empty", enabled: true },
      { name: "A", source_type: "samples", root_path: "/a", enabled: true },
    ];

    const sorted = sortSources(input);
    expect(sorted.map((s) => s.name)).toEqual(["A", "", "B"]);
  });
});
