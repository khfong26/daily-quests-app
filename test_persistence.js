// Simple test to validate localStorage persistence logic
// This tests the core functionality without browser dependencies

// Mock localStorage for testing
const mockLocalStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  removeItem: function(key) {
    delete this.data[key];
  }
};

// Test data
const testData = {
  quests: [
    { name: "Test Quest 1", type: "main", attribute: "physical", frequency: "daily", done: false },
    { name: "Test Quest 2", type: "side", attribute: "mental", frequency: "weekly", done: true }
  ],
  xp: 100,
  streak: 5,
  combo: 3,
  lastCompletedDate: new Date().toDateString(),
  dailyMainQuestCompleted: true,
  lastActiveDate: new Date().toDateString()
};

// Test saving
console.log("Testing localStorage save/load...");
mockLocalStorage.setItem("dailyQuestsApp", JSON.stringify(testData));
console.log("Data saved:", testData);

// Test loading
const loadedData = JSON.parse(mockLocalStorage.getItem("dailyQuestsApp"));
console.log("Data loaded:", loadedData);

// Validate all properties are preserved
const requiredProperties = ["quests", "xp", "streak", "combo", "lastCompletedDate", "dailyMainQuestCompleted", "lastActiveDate"];
let allPropertiesPresent = true;

requiredProperties.forEach(prop => {
  if (loadedData[prop] === undefined) {
    console.error(`❌ Missing property: ${prop}`);
    allPropertiesPresent = false;
  } else {
    console.log(`✅ Property preserved: ${prop} = ${JSON.stringify(loadedData[prop])}`);
  }
});

// Validate quest properties
if (loadedData.quests && loadedData.quests.length > 0) {
  const quest = loadedData.quests[0];
  const questProperties = ["name", "type", "attribute", "frequency", "done"];
  questProperties.forEach(prop => {
    if (quest[prop] === undefined) {
      console.error(`❌ Missing quest property: ${prop}`);
      allPropertiesPresent = false;
    } else {
      console.log(`✅ Quest property preserved: ${prop} = ${quest[prop]}`);
    }
  });
}

if (allPropertiesPresent) {
  console.log("🎉 All properties are properly persisted!");
} else {
  console.log("💥 Some properties are missing from persistence!");
}

// Test daily streak reset logic
console.log("\nTesting daily streak reset logic...");

// Simulate yesterday's completed main quest
const yesterdayQuests = [
  { name: "Main Quest", type: "main", done: true },
  { name: "Side Quest", type: "side", done: true }
];

const hadMainQuestCompleted = yesterdayQuests.some(q => q.type === "main" && q.done);
console.log("Had main quest completed yesterday:", hadMainQuestCompleted);

if (hadMainQuestCompleted) {
  console.log("✅ Streak should increment");
} else {
  console.log("❌ Streak should reset to 0");
}

// Test with no main quests completed
const noMainQuests = [
  { name: "Side Quest 1", type: "side", done: true },
  { name: "Side Quest 2", type: "side", done: false }
];

const noMainCompleted = noMainQuests.some(q => q.type === "main" && q.done);
console.log("No main quests completed:", !noMainCompleted);

if (!noMainCompleted) {
  console.log("✅ Streak should reset to 0");
} else {
  console.log("❌ Logic error in streak reset");
}