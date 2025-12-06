import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, FileText, ChevronLeft, Check, Eye } from "lucide-react";
import { onboardingStorage } from "../../utils/onboardingStorage";
import { userAPI, getAuthToken } from "../../services/api";

const Preferences = () => {
  const navigate = useNavigate();
  const [injuries, setInjuries] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = onboardingStorage.getAll();
    if (saved.injuries) setInjuries(saved.injuries);
    if (saved.preferences) setPreferences(saved.preferences);
  }, []);

  const handleFinish = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return;
    }

    // Validate required fields first
    const validation = onboardingStorage.validate();
    if (!validation.isValid) {
      setError(`Please complete all required fields. Missing: ${validation.missingFields.join(', ')}`);
      return;
    }

    // Save preferences data
    onboardingStorage.save('injuries', injuries);
    onboardingStorage.save('preferences', preferences);
    onboardingStorage.save('dietaryRestrictions', injuries); // Use injuries as dietary restrictions
    onboardingStorage.save('workoutTime', 'morning'); // Default, can be updated later

    setLoading(true);
    setError("");

    try {
      // Build the complete onboarding payload
      const payload = onboardingStorage.buildPayload();
      console.log('Sending onboarding request with payload:', payload);

      // Call the onboarding API
      const response = await userAPI.completeOnboarding(token, payload);
      console.log('Onboarding response:', response);

      if (response.success) {
        // Clear onboarding data
        onboardingStorage.clear();
        
        // Navigate to landing page
        navigate("/member/landingPage");
      } else {
        const errorMsg = response.message || response.error || "Failed to complete onboarding. Please try again.";
        setError(errorMsg);
        console.error("Onboarding failed:", response);
      }
    } catch (err) {
      const errorMsg = err.message || "An error occurred while completing onboarding. Please try again.";
      setError(errorMsg);
      console.error("Onboarding error:", err);
      
      // If it's a validation error, show specific message
      if (err.message && err.message.includes('Missing required fields')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Additional Preferences
          </h1>
          <p className="text-muted-foreground">Share any additional information that will help us customize your plan</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 border border-border space-y-6">
          {/* Question 1 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Do you have any injuries or physical limitations we should know about?
            </h2>
            <textarea
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              placeholder="Write here... (e.g., knee injury, lower back pain, etc.)"
              rows={4}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Question 2 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Any specific preferences or notes for your workout plan?
            </h2>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Write here... (e.g., prefer morning workouts, dislike running, etc.)"
              rows={4}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          {error && (
            <div className="px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
              {error}
            </div>
          )}

          {/* Summary Button */}
          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                const data = onboardingStorage.getAll();
                const validation = onboardingStorage.validate();
                console.log('Onboarding Data:', data);
                console.log('Validation:', validation);
                if (validation.isValid) {
                  try {
                    const payload = onboardingStorage.buildPayload();
                    console.log('Payload:', payload);
                    setShowSummary(true);
                  } catch (err) {
                    alert('Error building payload: ' + err.message);
                  }
                } else {
                  alert('Please complete all required fields first.');
                }
              }}
              className="w-full px-4 py-2 bg-secondary hover:bg-muted text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Eye className="w-4 h-4" />
              Preview Summary
            </button>
          </div>

          {/* Summary View */}
          {showSummary && (
            <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-3">Onboarding Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Age:</strong> {onboardingStorage.get('age')}</div>
                <div><strong>Gender:</strong> {onboardingStorage.get('gender')}</div>
                <div><strong>Height:</strong> {onboardingStorage.get('height')} cm</div>
                <div><strong>Weight:</strong> {onboardingStorage.get('weight')} kg</div>
                <div><strong>Fitness Goal:</strong> {onboardingStorage.get('selectedGoal')}</div>
                <div><strong>Fitness Level:</strong> {onboardingStorage.get('fitnessLevel')}</div>
                <div><strong>Days per Week:</strong> {onboardingStorage.get('daysPerWeek')}</div>
                <div><strong>Session Length:</strong> {onboardingStorage.get('sessionLength')}</div>
                <div><strong>Workout Split:</strong> {onboardingStorage.get('workoutSplit')}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowSummary(false)}
                className="mt-3 w-full px-4 py-2 bg-secondary hover:bg-muted text-white rounded text-sm"
              >
                Close Summary
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              onClick={() => navigate("/member/schedule")}
              disabled={loading}
              className="px-4 py-2 bg-secondary hover:bg-muted disabled:bg-card disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {loading ? "Creating your plan..." : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
