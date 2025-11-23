import PersonalInfo from "./PersonalInfo";
import { Target } from "lucide-react";

const Questionary = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Target className="w-8 h-8" />
            Let's Create Your Perfect Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Help us to understand your goals so we can build a personalized
            workout & nutrition plan suitable for you
          </p>
        </div>
        <PersonalInfo />
      </div>
    </div>
  );
};

export default Questionary;
