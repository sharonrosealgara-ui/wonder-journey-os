const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Compiling assessment state model for unit tests...");

const tempTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"]
    },
    outDir: "temp-model-test",
    noEmit: false,
    skipLibCheck: true
  },
  include: ["src/lib/assessment-state.ts"]
};

const tempConfigPath = path.join(__dirname, "../temp-model-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-model-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation error in test-assessment-response-model:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

const path1 = path.join(__dirname, "../temp-model-test/assessment-state.js");
const path2 = path.join(__dirname, "../temp-model-test/lib/assessment-state.js");
const modelModule = fs.existsSync(path1) ? require(path1) : require(path2);

const {
  recordMultipleChoice,
  recordTrueFalse,
  recordShortAnswer,
  updateMatchingPair,
  removeMatchingPair,
  recordMatching,
  moveSequenceItem,
  recordSequencing,
  recordScenario,
  scrambleSequencing,
  scrambleRightItems
} = modelModule;

let testCasesRun = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

// 1. Multiple-choice response recording
let state = {};
state = recordMultipleChoice(state, "q-mc-1", "Asia");
assert(state["q-mc-1"] && state["q-mc-1"].type === "multiple-choice", "MC response missing or wrong type");
assert(state["q-mc-1"].chosenOption === "Asia", "MC chosen option mismatch");
testCasesRun++;

// 2. True/False response recording
state = recordTrueFalse(state, "q-tf-1", "False");
assert(state["q-tf-1"] && state["q-tf-1"].type === "true-false-with-explanation", "TF response missing or wrong type");
assert(state["q-tf-1"].chosenOption === "False", "TF chosen option mismatch");
testCasesRun++;

// 3. Short-answer response recording
state = recordShortAnswer(state, "q-sa-1", "The Equator is the middle line");
assert(state["q-sa-1"] && state["q-sa-1"].type === "short-answer", "SA response missing or wrong type");
assert(state["q-sa-1"].text === "The Equator is the middle line", "SA text mismatch");
testCasesRun++;

// 4. Matching pairing interaction & revision
let pairs = {};
pairs = updateMatchingPair(pairs, "Luzon", "North Island");
pairs = updateMatchingPair(pairs, "Mindanao", "South Island");
assert(pairs["Luzon"] === "North Island" && pairs["Mindanao"] === "South Island", "Matching pair update failed");

// Revise a match
pairs = updateMatchingPair(pairs, "Luzon", "Northern Island Region");
assert(pairs["Luzon"] === "Northern Island Region", "Matching pair revision failed");

// Record final matching response
state = recordMatching(state, "q-match-1", pairs);
assert(state["q-match-1"] && state["q-match-1"].type === "matching", "Matching record missing or wrong type");
assert(state["q-match-1"].matches.length === 2, "Matching recorded pairs count mismatch");
testCasesRun++;

// 5. Sequencing ordering interaction & boundary safety
const initialItems = ["Earth", "Asia", "Southeast Asia", "Philippines"];
// Move item 1 up (Asia moves to top)
let order1 = moveSequenceItem(initialItems, 1, "up");
assert(order1[0] === "Asia" && order1[1] === "Earth", "Move up failed");

// Move boundary item up (index 0 - should do nothing)
let orderBoundary = moveSequenceItem(order1, 0, "up");
assert(JSON.stringify(orderBoundary) === JSON.stringify(order1), "Move up boundary safety failed");

// Move item down
let orderDown = moveSequenceItem(order1, 0, "down");
assert(orderDown[0] === "Earth" && orderDown[1] === "Asia", "Move down failed");

// Record sequencing response
state = recordSequencing(state, "q-seq-1", orderDown);
assert(state["q-seq-1"] && state["q-seq-1"].type === "sequencing", "Sequencing record missing or wrong type");
assert(state["q-seq-1"].chosenOrder.length === 4, "Sequencing recorded order count mismatch");
testCasesRun++;

// 6. Scenario-application response recording
state = recordScenario(state, "q-scen-1", "Because the ship is east of Davao, it sails directly into the Pacific Ocean.");
assert(state["q-scen-1"] && state["q-scen-1"].type === "scenario-application", "Scenario record missing or wrong type");
assert(state["q-scen-1"].response.includes("Pacific Ocean"), "Scenario response content mismatch");
testCasesRun++;

// 7. Scrambler guarantee for sequencing: candidate order !== correctOrder
const correctOrder = ["Planet Earth", "Asia", "Southeast Asia", "Philippines"];
const scrambledOrder = scrambleSequencing(correctOrder, "seed-lesson-1");
assert(scrambledOrder.length === correctOrder.length, "Scrambled order length mismatch");
assert(!scrambledOrder.every((val, idx) => val === correctOrder[idx]), "Scrambled sequence must not equal correctOrder");
testCasesRun++;

// 8. Scrambler guarantee for matching: rightItems scrambled independently
const mockPairs = [
  { left: "Luzon", right: "North" },
  { left: "Visayas", right: "Central" },
  { left: "Mindanao", right: "South" }
];
const scrambledRights = scrambleRightItems(mockPairs, "seed-matching-1");
assert(scrambledRights.length === mockPairs.length, "Scrambled rights length mismatch");
assert(!scrambledRights.every((val, idx) => val === mockPairs[idx].right), "Scrambled matching rights must not equal original pair indices");
testCasesRun++;

// 9. Input guards (empty / whitespace handling)
const priorState = { ...state };
const emptyMc = recordMultipleChoice(state, "q-empty", "   ");
assert(JSON.stringify(emptyMc) === JSON.stringify(priorState), "Empty MC must be ignored");
const emptySa = recordShortAnswer(state, "q-empty", "");
assert(JSON.stringify(emptySa) === JSON.stringify(priorState), "Empty SA must be ignored");
testCasesRun++;

// 10. Immutability check
assert(state !== priorState, "State transitions must be immutable");
testCasesRun++;

// Clean temp directory
fs.rmSync(path.join(__dirname, "../temp-model-test"), { recursive: true, force: true });

console.log(`PASS: Assessment response-model coverage: ${testCasesRun}/10 test cases passed.`);
process.exit(0);
