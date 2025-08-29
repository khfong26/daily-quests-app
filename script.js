const { useState, useEffect } = React;

// Rank structure
const ranks = [
  "Iron", "Bronze", "Silver", "Gold",
  "Platinum", "Diamond", "Emerald"
];
const levelsPerRank = 3;

// Rank icons mapping - Consistent progression from basic to elite
const rankIcons = {
  "Iron": "🔩",
  "Bronze": "🥉", 
  "Silver": "🥈",
  "Gold": "🥇",
  "Platinum": "⭐",
  "Diamond": "💎", 
  "Emerald": "👑"
};

// Quadratic XP progression system - XP required = 100 * (rank ^ 2)
function getXpPerLevel(rank) {
  const rankIndex = ranks.indexOf(rank);
  // Quadratic scaling: XP required = 100 * (rank ^ 2)
  // Adding 1 to rankIndex since we want rank 1, 2, 3, etc. not 0, 1, 2
  const rankNumber = rankIndex + 1;
  return 100 * Math.pow(rankNumber, 2);
  // Results: Iron=100, Bronze=400, Silver=900, Gold=1600, Platinum=2500, Diamond=3600, Emerald=4900
}

// Calculate scaled XP amounts based on current rank for both gains and losses
function getScaledXpAmount(currentXp, questType, isGain = true) {
  // Get current rank info to determine scaling
  const { rank } = getRankInfoForXp(currentXp);
  const baseXpForRank = getXpPerLevel(rank);
  
  // Base percentages of rank XP requirement
  const mainQuestPercent = 0.4; // 40% of rank XP requirement
  const sideQuestPercent = 0.16; // 16% of rank XP requirement (40% of main quest)
  
  const scaledAmount = Math.round(
    baseXpForRank * (questType === "main" ? mainQuestPercent : sideQuestPercent)
  );
  
  // Ensure minimum amounts to maintain progression
  const minAmount = questType === "main" ? 10 : 4;
  return Math.max(scaledAmount, minAmount);
}

// Helper function to get rank info for a specific XP amount (used for scaling calculations)
function getRankInfoForXp(xp) {
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

// QuestCard component
function QuestCard({ quest, index, isEditing, onToggle, onDelete, onEdit, onStartEdit, onCancelEdit }) {
  return (
    <div
      className={`quest-card p-4 rounded-xl border-l-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        quest.done ? "bg-green-800/50 border-green-400" : "bg-gray-800/80 border-gray-600"
      } ${quest.type === "main" ? "main-quest" : "side-quest"}`}
    >
      <div className={`flex ${isEditing ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <div className="flex items-center flex-1 min-w-0">
          {quest.attribute && (
            <span className={`attribute-tag ${quest.attribute} mr-3`}>
              {quest.attribute}
            </span>
          )}
          {isEditing ? (
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <input
                type="text"
                defaultValue={quest.name}
                className="p-2 rounded-lg bg-gray-700 text-white w-full border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors text-sm"
                id={`editName-${index}`}
              />
              <div className="flex gap-2 flex-wrap">
                <select defaultValue={quest.type} className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors text-sm flex-1 min-w-0" id={`editType-${index}`}>
                  <option value="main">Main</option>
                  <option value="side">Side</option>
                </select>
                <select defaultValue={quest.attribute} className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors text-sm flex-1 min-w-0" id={`editAttribute-${index}`}>
                  <option value="physical">Physical</option>
                  <option value="mental">Mental</option>
                  <option value="career">Career</option>
                  <option value="studying">Studying</option>
                </select>
                <select defaultValue={quest.frequency || 'normal'} className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors text-sm flex-1 min-w-0" id={`editFrequency-${index}`}>
                  <option value="normal">Normal</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{quest.name}</h3>
              <p className="text-sm text-gray-400">
                {quest.type} quest • {quest.frequency || 'normal'}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4 flex-shrink-0">
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  const newName = document.getElementById(`editName-${index}`).value.trim();
                  const newType = document.getElementById(`editType-${index}`).value;
                  const newAttribute = document.getElementById(`editAttribute-${index}`).value;
                  const newFrequency = document.getElementById(`editFrequency-${index}`).value;
                  if (newName) {
                    const success = onEdit(index, newName, newType, newAttribute, newFrequency);
                    if (success) {
                      onCancelEdit();
                    }
                  } else {
                    onCancelEdit();
                  }
                }}
                className="bg-green-500 px-2 py-1 rounded-lg hover:bg-green-600 text-xs font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="bg-gray-500 px-2 py-1 rounded-lg hover:bg-gray-600 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
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
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation states
  const [xpAnimations, setXpAnimations] = useState([]);
  const [rankChangeAnimation, setRankChangeAnimation] = useState(null);
  const [comboAnimation, setComboAnimation] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [xpBarShine, setXpBarShine] = useState(false);

  // Load saved data
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("dailyQuestsApp");
      if (savedData) {
        const saved = JSON.parse(savedData);
        console.log("Loading saved data:", saved);
        
        setQuests(saved.quests || []);
        setXp(saved.xp || 0);
        setStreak(saved.streak || 0);
        setCombo(saved.combo || 1);
        setLastCompletedDate(saved.lastCompletedDate || null);
        setDailyMainQuestCompleted(saved.dailyMainQuestCompleted || false);
        setLastActiveDate(saved.lastActiveDate || null);
      } else {
        console.log("No saved data found, using defaults");
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save on change (only after initial load to prevent overwriting during load)
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      const dataToSave = {
        quests, 
        xp, 
        streak, 
        combo, 
        lastCompletedDate, 
        dailyMainQuestCompleted, 
        lastActiveDate
      };
      localStorage.setItem("dailyQuestsApp", JSON.stringify(dataToSave));
      console.log("Data saved to localStorage:", dataToSave);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [quests, xp, streak, combo, lastCompletedDate, dailyMainQuestCompleted, lastActiveDate, isLoaded]);

  // Check for new day on app load and update lastActiveDate
  useEffect(() => {
    if (!isLoaded) return;
    
    const today = new Date().toDateString();
    
    // Always update lastActiveDate to today when app loads
    if (lastActiveDate !== today) {
      setLastActiveDate(today);
    }
  }, [lastActiveDate, isLoaded]);

  // Handle new day detection and quest reset (runs when lastActiveDate changes and data is loaded)
  useEffect(() => {
    if (!isLoaded || !lastActiveDate) return;
    
    const today = new Date().toDateString();
    
    if (lastActiveDate !== today) {
      console.log("New day detected! Last active:", lastActiveDate, "Today:", today);
      
      // Check if any main quests were completed the previous day for streak calculation
      // This must be done BEFORE resetting daily quests
      const hadMainQuestCompletedYesterday = quests.some(q => q.type === "main" && q.done);
      
      if (hadMainQuestCompletedYesterday) {
        setStreak(prev => {
          const newStreak = prev + 1;
          triggerStreakAnimation();
          console.log("Streak incremented - main quests were completed yesterday");
          return newStreak;
        });
      } else {
        setStreak(0);
        console.log("Streak reset - no main quests completed yesterday");
        
        // Apply rank decay - now uses progressive scaling based on current rank
        setXp(prev => {
          const decayAmount = getScaledXpAmount(prev, "main", false); // Use main quest scaling for decay
          const newXp = Math.max(0, prev - decayAmount);
          console.log(`🔻 Rank decay applied: -${decayAmount} XP (${prev} → ${newXp}) - scaled to current rank`);
          
          // Placeholder for future decay animation
          // TODO: Trigger XP decay animation/visual feedback
          
          return newXp;
        });
      }
      
      // Automatically reset daily quests on new day
      setQuests(prev => prev.map(q => {
        if (q.frequency === 'daily') {
          return { ...q, done: false };
        }
        return q; // Keep weekly and normal quests unchanged
      }));
      
      // Reset combo and daily main quest tracking for the new day
      setCombo(1);
      setDailyMainQuestCompleted(false);
      
      console.log("Daily quests have been automatically reset for the new day");
    }
  }, [lastActiveDate, quests, isLoaded]);

  // Check if it's a new day
  function isNewDay() {
    if (!lastCompletedDate) return true;
    const today = new Date().toDateString();
    return lastCompletedDate !== today;
  }

  // Animation helper functions
  function triggerXpAnimation(amount, isGain = true) {
    const id = Date.now() + Math.random();
    const animation = {
      id,
      amount,
      isGain,
      timestamp: Date.now()
    };
    
    setXpAnimations(prev => [...prev, animation]);
    
    // Remove animation after 2 seconds
    setTimeout(() => {
      setXpAnimations(prev => prev.filter(a => a.id !== id));
    }, 2000);
  }

  function triggerRankChangeAnimation(newRank, newLevel, isRankUp) {
    setRankChangeAnimation({ 
      rank: newRank, 
      level: newLevel, 
      isRankUp: isRankUp 
    });
    
    // Remove animation after 3 seconds
    setTimeout(() => {
      setRankChangeAnimation(null);
    }, 3000);
  }

  function triggerComboAnimation() {
    setComboAnimation(true);
    setTimeout(() => setComboAnimation(false), 600);
  }

  function triggerStreakAnimation() {
    setStreakAnimation(true);
    setTimeout(() => setStreakAnimation(false), 1000);
  }

  function triggerXpBarShine() {
    setXpBarShine(true);
    setTimeout(() => setXpBarShine(false), 2000);
  }

  function addQuest(name, type, attribute, frequency) {
    // Check for duplicate quest names (case-insensitive)
    const trimmedName = name.trim();
    const existingQuest = quests.find(quest => 
      quest.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingQuest) {
      alert(`A quest named "${trimmedName}" already exists. Please choose a different name.`);
      return false;
    }
    
    const newQuest = { 
      name: trimmedName, 
      type, 
      attribute, 
      frequency: frequency || 'normal', 
      done: false 
    };
    console.log("Adding new quest:", newQuest);
    setQuests([...quests, newQuest]);
    return true;
  }

  function toggleQuest(index) {
    const updated = [...quests];
    const today = new Date().toDateString();
    
    if (!updated[index].done) {
      // Award XP when completing a quest - now uses quadratic scaling without combo bonus
      const currentXp = xp; // Capture current XP for scaling calculation
      const prevRankInfo = getRankInfoForXp(currentXp);
      let gained = getScaledXpAmount(currentXp, updated[index].type, true);
      // Removed combo bonus multiplication for balanced progression
      
      setXp(prev => {
        const newXp = prev + gained;
        const newRankInfo = getRankInfoForXp(newXp);
        
        console.log(`🆙 Quest completed: +${gained} XP (${prev} → ${newXp}) - ${updated[index].type} quest`);
        
        // Trigger XP gain animation
        triggerXpAnimation(gained, true);
        triggerXpBarShine();
        
        // Check for rank up or rank down
        if (newRankInfo.rank !== prevRankInfo.rank || newRankInfo.level !== prevRankInfo.level) {
          const isRankUp = newRankInfo.totalLevels > prevRankInfo.totalLevels;
          triggerRankChangeAnimation(newRankInfo.rank, newRankInfo.level, isRankUp);
        }
        
        return newXp;
      });
      
      setCombo(prev => {
        const newCombo = prev + 1;
        triggerComboAnimation();
        return newCombo;
      });
      
      // Track if a main quest was completed today (for streak logic)
      if (updated[index].type === "main") {
        setDailyMainQuestCompleted(true);
        setLastCompletedDate(today);
      }
      
    } else {
      // Remove XP when undoing a completed quest - now without combo scaling
      const currentXp = xp; // Capture current XP for scaling calculation
      const prevRankInfo = getRankInfoForXp(currentXp);
      let lost = getScaledXpAmount(currentXp, updated[index].type, false);
      // Removed combo multiplication for consistent progression
      
      setXp(prev => {
        const newXp = Math.max(0, prev - lost);
        const newRankInfo = getRankInfoForXp(newXp);
        
        console.log(`🔽 Quest undone: -${lost} XP (${prev} → ${newXp}) - ${updated[index].type} quest`);
        
        // Trigger XP loss animation
        triggerXpAnimation(lost, false);
        
        // Check for rank down
        if (newRankInfo.rank !== prevRankInfo.rank || newRankInfo.level !== prevRankInfo.level) {
          const isRankUp = newRankInfo.totalLevels > prevRankInfo.totalLevels;
          triggerRankChangeAnimation(newRankInfo.rank, newRankInfo.level, isRankUp);
        }
        
        return newXp;
      });
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

  function editQuest(index, newName, newType, newAttribute, newFrequency) {
    // Check for duplicate quest names when editing (case-insensitive, excluding current quest)
    const trimmedName = newName.trim();
    const existingQuest = quests.find((quest, i) => 
      i !== index && quest.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingQuest) {
      alert(`A quest named "${trimmedName}" already exists. Please choose a different name.`);
      return false;
    }
    
    const updated = [...quests];
    // Ensure all properties are preserved when editing
    updated[index] = { 
      ...updated[index], 
      name: trimmedName, 
      type: newType, 
      attribute: newAttribute, 
      frequency: newFrequency || 'normal'
    };
    console.log("Quest edited:", updated[index]);
    setQuests(updated);
    return true;
  }

  function startEdit(index) {
    setEditingIndex(index);
  }

  function cancelEdit() {
    setEditingIndex(null);
  }

  function getRankInfo() {
    return getRankInfoForXp(xp);
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
          <p className="text-2xl font-bold rank-badge flex items-center justify-center">
            <span className="rank-icon">{rankIcons[rank]}</span>
            {rank} {level}
            {rankChangeAnimation && (
              <span className="ml-2 animate-bounce">
                {rankChangeAnimation.isRankUp ? '⭐' : '⬇️'}
              </span>
            )}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">Streak</p>
          <p className={`text-2xl font-bold transition-all duration-500 ${
            streak > 0 ? 'text-yellow-400 streak-animation' : 'text-white'
          } ${streakAnimation ? 'streak-boost' : ''}`}>
            {streak}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">Tasks Completed Today</p>
          <p className={`text-2xl font-bold transition-all duration-300 ${
            combo > 1 ? 'text-green-400 transform scale-110' : 'text-white'
          } ${comboAnimation ? 'combo-boost' : ''}`}>
            x{combo}
          </p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
          <div
            className={`bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-700 ease-out relative ${xpBarShine ? 'xp-bar-shine' : ''}`}
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
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
          <select id="questFrequency" className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors">
            <option value="normal">Normal</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button
            onClick={() => {
              const name = document.getElementById("questName").value.trim();
              const type = document.getElementById("questType").value;
              const attribute = document.getElementById("questAttribute").value;
              const frequency = document.getElementById("questFrequency").value;
              if (name) {
                const success = addQuest(name, type, attribute, frequency);
                if (success) {
                  document.getElementById("questName").value = "";
                }
              }
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 font-medium transition-all transform hover:scale-105"
          >
            Add Quest
          </button>
        </div>
      </div>

      {/* Floating XP Animations */}
      {xpAnimations.map(animation => (
        <div
          key={animation.id}
          className={animation.isGain ? 'xp-gain' : 'xp-loss'}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {animation.isGain ? '+' : '-'}{animation.amount} XP
        </div>
      ))}

      {/* Rank Change Celebration */}
      {rankChangeAnimation && (
        <div className={`rank-change-celebration ${rankChangeAnimation.isRankUp ? 'rank-up' : 'rank-down'}`}>
          <div className="text-6xl mb-4">
            {rankChangeAnimation.isRankUp ? '🎉' : '😔'}
          </div>
          <div className={`text-4xl font-bold mb-2 ${rankChangeAnimation.isRankUp ? 'text-yellow-400' : 'text-red-400'}`}>
            {rankChangeAnimation.isRankUp ? 'RANK UP!' : 'RANK DOWN!'}
          </div>
          <div className="text-2xl rank-badge">
            <span className="rank-icon">{rankIcons[rankChangeAnimation.rank]}</span>
            {rankChangeAnimation.rank} {rankChangeAnimation.level}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
