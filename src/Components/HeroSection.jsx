import { Flame, TrendingUp, Zap } from "lucide-react";

const HeroSection = () => {

  const scrollToSection = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                Transform Your Life Today
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Crush Your{" "}
              <span className="text-gradient">Fitness Goals</span>{" "}
              With Us
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Get personalized workout plans, expert coaching, and nutrition guidance 
              to help you achieve the body and health you've always wanted.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                onClick={() => scrollToSection("#services")}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 animate-pulse-glow"
              >
                Get Started Free
              </a>
              <a
                onClick={() => scrollToSection("#coaches")}
                className="px-8 py-4 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all border border-border"
              >
                Meet Our Coaches
              </a>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid gap-4">
              {/* Streak Card */}
              <div className="bg-card border border-border rounded-2xl p-6 card-glow animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Flame className="w-6 h-6 text-accent" />
                    <span className="font-semibold">Your Streak</span>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Complete Workout
                  </button>
                </div>
                <div className="text-4xl font-display font-bold text-accent">7 days</div>
              </div>

              {/* Today's Workout Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Today's Workout
                </h3>
                <div className="space-y-3">
                  {[
                    { num: 1, name: "Jumping Jacks", time: "1 min", color: "bg-primary" },
                    { num: 2, name: "Leg Swings", time: "1 min", color: "bg-primary" },
                    { num: 3, name: "Squats", time: "3 sets x 12 reps", color: "bg-blue-500" },
                    { num: 4, name: "Bench Press", time: "3 sets x 12 reps", color: "bg-blue-500" },
                  ].map((exercise) => (
                    <div
                      key={exercise.num}
                      className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
                    >
                      <div className={`w-8 h-8 ${exercise.color} rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground`}>
                        {exercise.num}
                      </div>
                      <div>
                        <div className="font-medium text-primary">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">{exercise.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
