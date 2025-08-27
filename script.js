const { useState, useEffect } = React;

// Rank structure
const ranks = [
  "Iron", "Bronze", "Silver", "Gold",
  "Platinum", "Diamond", "Emerald"
];
const levelsPerRank = 3;
const xpPerLevel = 100;

// QuestCard component
function QuestCard({ quest, index, isEditing, onToggle, onDelete, onEdit, onStartEdit, onCancelEdit }) {
  return (
    <div
      className={`flex items-center justify-between p-3 mb-2 rounded-lg ${quest.done ? "bg-green-700" : "bg-gray-800"}`}
    >
      <div className="flex items-center flex-1">
        {quest.attribute && (
          <span className={`attribute-tag ${quest.attribute}`}>
            {quest.attribute}
          </span>
        )}
        {isEditing ? (
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              defaultValue={quest.name}
              className="p-1 rounded bg-gray-700 text-white flex-1"
              id={`editName-${index}`}
            />
            <select defaultValue={quest.type} className="p-1 rounded bg-gray-700" id={`editType-${index}`}>
              <option value="main">Main</option>
              <option value="side">Side</option>
            </select>
            <select defaultValue={quest.attribute} className="p-1 rounded bg-gray-700" id={`editAttribute-${index}`}>
              <option value="physical">Physical</option>
              <option value="mental">Mental</option>
              <option value="career">Career</option>
              <option value="studying">Studying</option>
            </select>
          </div>
        ) : (
          <span>{quest.name} ({quest.type})</span>
        )}
      </div>
      <div className="flex gap-2">
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
              className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 text-sm"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEdit(index)}
              className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(index)}
              className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </>
        )}
        <button
          onClick={() => onToggle(index)}
          className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          {quest.done ? "Undo" : "Done"}
        </button>
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

  // Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyQuestsApp"));
    if (saved) {
      setQuests(saved.quests || []);
      setXp(saved.xp || 0);
      setStreak(saved.streak || 0);
      setCombo(saved.combo || 1);
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("dailyQuestsApp", JSON.stringify({
      quests, xp, streak, combo
    }));
  }, [quests, xp, streak, combo]);

  function addQuest(name, type, attribute) {
    setQuests([...quests, { name, type, attribute, done: false }]);
  }

  function toggleQuest(index) {
    const updated = [...quests];
    if (!updated[index].done) {
      // Award XP when completing a quest
      let gained = updated[index].type === "main" ? 30 : 10;
      gained *= combo;
      setXp(prev => prev + gained);
      setCombo(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      // Remove XP when undoing a completed quest
      let lost = updated[index].type === "main" ? 30 : 10;
      lost *= combo;
      setXp(prev => Math.max(0, prev - lost));
      setCombo(prev => Math.max(1, prev - 1));
      setStreak(prev => Math.max(0, prev - 1));
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
  }

  function getRankInfo() {
    const totalLevels = Math.floor(xp / xpPerLevel);
    const rankIndex = Math.floor(totalLevels / levelsPerRank);
    const levelInRank = (totalLevels % levelsPerRank) + 1;
    return {
      rank: ranks[Math.min(rankIndex, ranks.length - 1)],
      level: levelInRank
    };
  }

  const { rank, level } = getRankInfo();
  const currentLevelXp = xp % xpPerLevel;
  const xpProgress = (currentLevelXp / xpPerLevel) * 100;

  return (
    <div className="p-6 font-['Roboto'] bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Daily Quests</h1>

      {/* Stats Panel */}
      <div className="flex justify-around bg-gray-800 p-4 rounded-lg mb-6">
        <div>
          <p className="text-sm">Rank</p>
          <p className="text-xl font-bold">{rank} {level}</p>
        </div>
        <div>
          <p className="text-sm">Streak</p>
          <p className="text-xl font-bold">{streak}</p>
        </div>
        <div>
          <p className="text-sm">Combo</p>
          <p className="text-xl font-bold">x{combo}</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
        <p className="text-center mt-1">{currentLevelXp} / {xpPerLevel} XP</p>
      </div>

      {/* Quest List */}
      <div>
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

      {/* Add Quest */}
      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Quest name"
          className="p-2 rounded bg-gray-800 flex-1"
          id="questName"
        />
        <select id="questType" className="p-2 rounded bg-gray-800">
          <option value="main">Main</option>
          <option value="side">Side</option>
        </select>
        <select id="questAttribute" className="p-2 rounded bg-gray-800">
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
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* End of Day */}
      <div className="mt-6 text-center">
        <button
          onClick={resetDay}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          End Day (Reset)
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
