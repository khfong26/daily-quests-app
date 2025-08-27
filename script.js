const { useState, useEffect } = React;

// Rank structure
const ranks = [
  "Iron", "Bronze", "Silver", "Gold",
  "Platinum", "Diamond", "Emerald"
];
const levelsPerRank = 3;

// Progressive XP system - increases with rank
function getXpPerLevel(rank) {
  const rankIndex = ranks.indexOf(rank);
  return 100 + (rankIndex * 50); // 100, 150, 200, 250, 300, 350, 400
}

// QuestCard component
function QuestCard({ quest, index, isEditing, onToggle, onDelete, onEdit, onStartEdit, onCancelEdit }) {
  return (
    <div
      className={`quest-card p-4 rounded-xl border-l-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        quest.done ? "bg-green-800/50 border-green-400" : "bg-gray-800/80 border-gray-600"
      } ${quest.type === "main" ? "main-quest" : "side-quest"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          {quest.attribute && (
            <span className={`attribute-tag ${quest.attribute} mr-3`}>
              {quest.attribute}
            </span>
          )}
          {isEditing ? (
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                defaultValue={quest.name}
                className="p-2 rounded-lg bg-gray-700 text-white flex-1 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors"
                id={`editName-${index}`}
              />
              <select defaultValue={quest.type} className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors" id={`editType-${index}`}>
                <option value="main">Main</option>
                <option value="side">Side</option>
              </select>
              <select defaultValue={quest.attribute} className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors" id={`editAttribute-${index}`}>
                <option value="physical">Physical</option>
                <option value="mental">Mental</option>
                <option value="career">Career</option>
                <option value="studying">Studying</option>
              </select>
            </div>
          ) : (
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{quest.name}</h3>
              <p className="text-sm text-gray-400">{quest.type} quest</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  const newName = document.getElementById(`editName-${index}`).value.trim();
                  const newType = document.getElementById(`editType-${index}`).value;
                  const newAttribute = document.getElementById(`editAttribute-${index}`).value;
                  if (newName) {
                    onEdit(index, newName, newType, newAttribute);
                  }
                  onCancelEdit();
                }}
                className="bg-green-500 px-3 py-2 rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="bg-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(index)}
                className="bg-yellow-500 px-3 py-2 rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(index)}
                className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => onToggle(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              quest.done 
                ? "bg-orange-500 hover:bg-orange-600" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {quest.done ? "Undo" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [quests, setQuests] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [dailyMainQuestCompleted, setDailyMainQuestCompleted] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyQuestsApp"));
    if (saved) {
      setQuests(saved.quests || []);
      setXp(saved.xp || 0);
      setStreak(saved.streak || 0);
      setCombo(saved.combo || 1);
      setLastCompletedDate(saved.lastCompletedDate || null);
      setDailyMainQuestCompleted(saved.dailyMainQuestCompleted || false);
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("dailyQuestsApp", JSON.stringify({
      quests, xp, streak, combo, lastCompletedDate, dailyMainQuestCompleted
    }));
  }, [quests, xp, streak, combo, lastCompletedDate, dailyMainQuestCompleted]);

  // Check if it's a new day
  function isNewDay() {
    if (!lastCompletedDate) return true;
    const today = new Date().toDateString();
    return lastCompletedDate !== today;
  }

  function addQuest(name, type, attribute) {
    setQuests([...quests, { name, type, attribute, done: false }]);
  }

  function toggleQuest(index) {
    const updated = [...quests];
    const today = new Date().toDateString();
    
    if (!updated[index].done) {
      // Award XP when completing a quest (reduced amounts)
      let gained = updated[index].type === "main" ? 20 : 8; // Reduced from 30/10
      gained *= combo;
      setXp(prev => prev + gained);
      setCombo(prev => prev + 1);
      
      // Handle streak logic - only increment once per day for main quest completion
      if (updated[index].type === "main" && !dailyMainQuestCompleted) {
        if (isNewDay()) {
          setStreak(prev => prev + 1);
          setLastCompletedDate(today);
          setDailyMainQuestCompleted(true);
        }
      }
    } else {
      // Remove XP when undoing a completed quest
      let lost = updated[index].type === "main" ? 20 : 8;
      lost *= (combo > 1 ? combo - 1 : 1); // Use previous combo value
      setXp(prev => Math.max(0, prev - lost));
      setCombo(prev => Math.max(1, prev - 1));
      
      // Handle streak logic when undoing
      if (updated[index].type === "main") {
        const completedMainQuests = updated.filter((q, i) => i !== index && q.done && q.type === "main");
        if (completedMainQuests.length === 0) {
          setDailyMainQuestCompleted(false);
        }
      }
    }
    updated[index].done = !updated[index].done;
    setQuests(updated);
  }

  function deleteQuest(index) {
    const updated = [...quests];
    updated.splice(index, 1);
    setQuests(updated);
  }

  function editQuest(index, newName, newType, newAttribute) {
    const updated = [...quests];
    updated[index] = { ...updated[index], name: newName, type: newType, attribute: newAttribute };
    setQuests(updated);
  }

  function startEdit(index) {
    setEditingIndex(index);
  }

  function cancelEdit() {
    setEditingIndex(null);
  }

  function resetDay() {
    setQuests(prev => prev.map(q => ({ ...q, done: false })));
    setCombo(1);
    setDailyMainQuestCompleted(false);
    // Note: streak is not reset here - it should only decrease if no main quests completed
  }

  function getRankInfo() {
    // Calculate total levels across all ranks
    let remainingXp = xp;
    let totalLevels = 0;
    
    for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
      const xpForThisRank = getXpPerLevel(ranks[rankIndex]) * levelsPerRank;
      if (remainingXp >= xpForThisRank) {
        remainingXp -= xpForThisRank;
        totalLevels += levelsPerRank;
      } else {
        const levelsInCurrentRank = Math.floor(remainingXp / getXpPerLevel(ranks[rankIndex]));
        totalLevels += levelsInCurrentRank;
        break;
      }
    }
    
    const rankIndex = Math.floor(totalLevels / levelsPerRank);
    const levelInRank = (totalLevels % levelsPerRank) + 1;
    
    return {
      rank: ranks[Math.min(rankIndex, ranks.length - 1)],
      level: levelInRank,
      totalLevels
    };
  }

  const { rank, level } = getRankInfo();
  const xpPerLevel = getXpPerLevel(rank);
  const currentLevelXp = xp % xpPerLevel;
  const xpProgress = (currentLevelXp / xpPerLevel) * 100;

  return (
    <div className="p-6 font-['Roboto'] bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Daily Quests
      </h1>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">Rank</p>
          <p className="text-2xl font-bold rank-badge">{rank} {level}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">Streak</p>
          <p className={`text-2xl font-bold transition-all duration-500 ${streak > 0 ? 'text-yellow-400 streak-animation' : 'text-white'}`}>
            {streak}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">Combo</p>
          <p className={`text-2xl font-bold transition-all duration-300 ${combo > 1 ? 'text-green-400 transform scale-110' : 'text-white'}`}>
            x{combo}
          </p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${Math.max(xpProgress, 2)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span>{currentLevelXp} / {xpPerLevel} XP</span>
          <span className="text-gray-400">Next: {rank} {level + 1}</span>
        </div>
      </div>

      {/* Quest List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Quests</h2>
        {quests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No quests yet. Add your first quest below!</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {quests.map((q, i) => (
              <QuestCard
                key={i}
                quest={q}
                index={i}
                isEditing={editingIndex === i}
                onToggle={toggleQuest}
                onDelete={deleteQuest}
                onEdit={editQuest}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Quest */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Add New Quest</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Quest name"
            className="p-3 rounded-lg bg-gray-700 flex-1 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors lg:col-span-2"
            id="questName"
          />
          <select id="questType" className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors">
            <option value="main">Main Quest</option>
            <option value="side">Side Quest</option>
          </select>
          <select id="questAttribute" className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors">
            <option value="physical">Physical</option>
            <option value="mental">Mental</option>
            <option value="career">Career</option>
            <option value="studying">Studying</option>
          </select>
          <button
            onClick={() => {
              const name = document.getElementById("questName").value.trim();
              const type = document.getElementById("questType").value;
              const attribute = document.getElementById("questAttribute").value;
              if (name) {
                addQuest(name, type, attribute);
                document.getElementById("questName").value = "";
              }
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 font-medium transition-all transform hover:scale-105"
          >
            Add Quest
          </button>
        </div>
      </div>

      {/* End of Day */}
      <div className="mt-8 text-center">
        <button
          onClick={resetDay}
          className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 font-medium transition-all transform hover:scale-105"
        >
          End Day (Reset Quests)
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
