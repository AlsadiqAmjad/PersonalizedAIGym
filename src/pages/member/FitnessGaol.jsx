import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { onboardingStorage } from "../../utils/onboardingStorage";

const FitnessGaol = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Load saved data
  useEffect(() => {
    const saved = onboardingStorage.getAll();
    if (saved.selectedGoal) setSelectedGoal(saved.selectedGoal);
    if (saved.fitnessLevel) setSelectedLevel(saved.fitnessLevel);
  }, []);
  const goals = [
    "Lose weight",
    "Build muscle",
    "Improve endurance",
    "General fitness",
    "Increase strength",
  ];

  const levels = [
    "Beginner (0-6 months experience)",
    "Intermediate (6 months - 2 years)",
    "Advanced (2+ years)",
  ];
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Target className="w-8 h-8" />
            Fitness Goals
          </h1>
          <p className="text-gray-400">Tell us about your fitness objectives</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 space-y-6">
          {/* Fitness Goal Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              What's your primary fitness goal?
            </h2>
            <div className="space-y-2">
              {goals.map((goal, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedGoal(goal)}
                  className={`p-3 cursor-pointer transition rounded-lg border ${
                    selectedGoal === goal
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650"
                  }`}
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>

          {/* Fitness Level Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              What's your current fitness level?
            </h2>
            <div className="space-y-2">
              {levels.map((level, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedLevel(level)}
                  className={`p-3 cursor-pointer transition rounded-lg border ${
                    selectedLevel === level
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650"
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <button
              onClick={() => navigate("/member/questionary")}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => {
                onboardingStorage.save('selectedGoal', selectedGoal);
                onboardingStorage.save('fitnessLevel', selectedLevel);
                navigate("/member/schedule");
              }}
              disabled={!selectedGoal || !selectedLevel}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessGaol;
