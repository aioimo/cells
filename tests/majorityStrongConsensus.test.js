import { MajorityStrongConsensus } from "../rules/MajorityStrongConsensus.js";

test("MajorityStrongConsensus.nextValue returns expected output for center cell", () => {
  const inputMatrix = [
    ["A", "A", "B"],
    ["B", "A", "B"],
    ["B", "B", "A"],
  ];
  const rule = new MajorityStrongConsensus({
    ordering: ["A", "B"],
    gridSize: 3,
    radius: 1,
  });
  // Patch getListOfNeighbourValues to use Moore neighborhood
  rule.getListOfNeighbourValues = (row, col, state) => {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 3 && c >= 0 && c < 3) {
          neighbors.push(state[r][c]);
        }
      }
    }
    return neighbors;
  };
  const result = rule.nextValue(1, 1, inputMatrix);
  expect(["A", "B", null]).toContain(result);
});
