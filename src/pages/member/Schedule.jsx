import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Layout, ChevronLeft, ChevronRight } from "lucide-react";
import { onboardingStorage } from "../../utils/onboardingStorage";

const Schedule = () => {
  const navigate = useNavigate();

  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [sessionLength, setSessionLength] = useState(null);
  const [workoutSplit, setWorkoutSplit] = useState(null);

  // Load saved data
  useEffect(() => {
    const saved = onboardingStorage.getAll();
    if (saved.daysPerWeek) setDaysPerWeek(saved.daysPerWeek);
    if (saved.sessionLength) setSessionLength(saved.sessionLength);
    if (saved.workoutSplit) setWorkoutSplit(saved.workoutSplit);
  }, []);

  const daysOptions = [
    "2 days",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "7 days",
  ];

  const sessionOptions = [
    "30 minutes",
    "45 minutes",
    "60 minutes",
    "75 minutes",
    "90 minutes",
  ];

  const splitOptions = [
    "Full body",
    "Upper / Lower",
    "Push / Pull / Legs",
    "Bro split (Chest, Back, Shoulders, Arms, Legs)",
    "Body part focused",
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Workout Schedule
          </h1>
          <p className="text-gray-400">Customize your workout routine</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 space-y-6">
          {/* Question 1 — dropdown */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              How many days per week can you workout?
            </h2>
            <select
              value={daysPerWeek || ""}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" disabled>
                Select days per week
              </option>
              {daysOptions.map((day, i) => (
                <option key={i} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Question 2 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              How long will each workout session be?
            </h2>
            <div className="space-y-2">
              {sessionOptions.map((option, i) => (
                <div
                  key={i}
                  onClick={() => setSessionLength(option)}
                  className={`p-3 cursor-pointer transition rounded-lg border ${
                    sessionLength === option
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5" />
              What workout split do you prefer?
            </h2>
            <div className="space-y-2">
              {splitOptions.map((split, i) => (
                <div
                  key={i}
                  onClick={() => setWorkoutSplit(split)}
                  className={`p-3 cursor-pointer transition rounded-lg border ${
                    workoutSplit === split
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650"
                  }`}
                >
                  {split}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <button
              onClick={() => navigate("/member/fitnessGaol")}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => {
                onboardingStorage.save('daysPerWeek', daysPerWeek);
                onboardingStorage.save('sessionLength', sessionLength);
                onboardingStorage.save('workoutSplit', workoutSplit);
                navigate("/member/preferences");
              }}
              disabled={!daysPerWeek || !sessionLength || !workoutSplit}
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

export default Schedule;
