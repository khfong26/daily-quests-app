const App = () => {
  // Load saved quests and stats or default initial state
  const savedQuests = JSON.parse(localStorage.getItem('quests'));
  const savedStats = JSON.parse(localStorage.getItem('userStats'));

  const initialQuests = savedQuests ?? [
    { id: 1, title: "Morning Workout", description: "Complete 20 minutes of exercise", type: "main", attribute: "Physical Health", completed: false, streak: 7 },
    { id: 2, title: "Meditate", description: "Practice mindfulness for 10 minutes", type: "main", attribute: "Mental State", completed: false, streak: 3 },
    { id: 3, title: "Work on Project", description: "Make progress on important work", type: "main", attribute: "Career Progression", completed: false, streak: 5 },
    { id: 4, title: "Read 20 Pages", description: "Expand your knowledge", type: "main", attribute: "Studying", completed: false, streak: 0 },
    { id: 5, title: "Drink 8 Glasses of Water", description: "Stay hydrated throughout the day", type: "side", attribute: "Physical Health", completed: false, streak: 12 },
    { id: 6, title: "Write in Journal", description: "Reflect on your day", type: "side", attribute: "Mental State", completed: false, streak: 2 },
    { id: 7, title: "Learn New Skill", description: "Spend 30 minutes learning something new", type: "side", attribute: "Studying", completed: false, streak: 8 },
    { id: 8, title: "Network with Colleagues", description: "Reach out to professional contacts", type: "side", attribute: "Career Progression", completed: false, streak: 1 }
  ];

  const initialUserStats = savedStats ?? {
    rank: "Gold",
    xp: 245,
    totalPoints: 245,
    streak: 12,
    combo: 1.0,
    attributes: {
      "Physical Health": 45,
      "Mental State": 38,
      "Career Progression": 62,
      "Studying": 40
    }
  };

  const [quests, setQuests] = React.useState(initialQuests);
  const [userStats, setUserStats] = React.useState(initialUserStats);

  // Save to localStorage on changes
  React.useEffect(() => {
    localStorage.setItem('quests', JSON.stringify(quests));
  }, [quests]);

  React.useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Rank thresholds
  const rankThresholds = [
    { name: "Bronze", min: 0, max: 99, color: "#CD7F32" },
    { name: "Silver", min: 100, max: 199, color: "#C0C0C0" },
    { name: "Gold", min: 200, max: 399, color: "#FFD700" },
    { name: "Platinum", min: 400, max: 699, color: "#E5E4E2" },
    { name: "Diamond", min: 700, max: Infinity, color: "#B9F2FF" }
  ];

  const getRankInfo = (xp) => {
    return rankThresholds.find(r => xp >= r.min && xp <= r.max) || rankThresholds[rankThresholds.length - 1];
  };

  const currentRank = getRankInfo(userStats.xp);

  // Toggle quest completed state & update stats
  const toggleQuest = (id) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === id) {
        const completed = !quest.completed;
        const points = quest.type === "main" ? 10 : 5;
        const streakBonus = quest.streak >= 5 ? 5 : 0;
        const totalPoints = points + streakBonus;

        setUserStats(prevStats => {
          let newXP = completed ? prevStats.xp + totalPoints : prevStats.xp - (quest.type === "main" ? 10 : 0);
          let newStreak = completed ? prevStats.streak + 1 : 0;
          let newCombo = prevStats.combo;

          // Combo multiplier if all main quests completed
          const allMainCompleted = quests.filter(q => q.type === "main" && q.id !== id)
            .every(q => q.completed) && completed;

          if (allMainCompleted && quests.filter(q => q.type === "main").length > 0) {
            newXP = Math.floor(newXP * 1.5);
            newCombo = 1.5;
          } else {
            newCombo = 1.0;
          }

          // Update attributes
          const newAttributes = { ...prevStats.attributes };
          if (completed) {
            newAttributes[quest.attribute] = Math.min(100, newAttributes[quest.attribute] + points);
          }

          return {
            ...prevStats,
            xp: newXP,
            totalPoints: newXP,
            streak: newStreak,
            combo: newCombo,
            attributes: newAttributes
          };
        });

        return {
          ...quest,
          completed,
          streak: completed ? quest.streak + 1 : 0
        };
      }
      return quest;
    }));
  };

  const mainQuests = quests.filter(q => q.type === "main");
  const sideQuests = quests.filter(q => q.type === "side");
  const allMainCompleted = mainQuests.every(q => q.completed);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 font-roboto">
        <h1 className="font-orbitron text-3xl mb-6">Daily Quests</h1>

        {/* Main Quests */}
        <section className="mb-8">
        <h2 className="font-orbitron text-xl mb-3">Main Quests</h2>
        {mainQuests.map(q => (
            <div
            key={q.id}
            onClick={() => toggleQuest(q.id)}
            className={`p-4 rounded-lg mb-3 cursor-pointer transition ${
                q.completed ? "bg-green-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
            >
            <h3 className="text-lg font-semibold">{q.title}</h3>
            <p className="text-sm text-gray-400">{q.description}</p>
            </div>
        ))}
        </section>

        {/* Side Quests */}
        <section>
        <h2 className="font-orbitron text-xl mb-3">Side Quests</h2>
        {sideQuests.map(q => (
            <div
            key={q.id}
            onClick={() => toggleQuest(q.id)}
            className={`p-4 rounded-lg mb-3 cursor-pointer transition ${
                q.completed ? "bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
            >
            <h3 className="text-lg font-semibold">{q.title}</h3>
            <p className="text-sm text-gray-400">{q.description}</p>
            </div>
        ))}
        </section>
    </div>
    );

};

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
