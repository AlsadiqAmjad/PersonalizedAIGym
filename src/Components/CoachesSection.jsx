// src/Components/CoachesSection.jsx
import { useEffect, useState } from "react";
import { publicAPI } from "../services/api";

// fallback data in case backend is empty or fails
const FALLBACK_COACHES = [
  {
    id: "fallback-1",
    name: "Sarah Johnson",
    specialty: "Strength & HIIT",
    image: "https://i.postimg.cc/P5f1yMZY/Screenshot-3.png",
  },
  {
    id: "fallback-2",
    name: "Mike Chen",
    specialty: "CrossFit & Conditioning",
    image: "https://i.postimg.cc/P5f1yMZY/Screenshot-3.png",
  },
  {
    id: "fallback-3",
    name: "Emma Davis",
    specialty: "Yoga & Flexibility",
    image: "https://i.postimg.cc/P5f1yMZY/Screenshot-3.png",
  },
  {
    id: "fallback-4",
    name: "Alex Rivera",
    specialty: "Strength & Mobility",
    image: "https://i.postimg.cc/P5f1yMZY/Screenshot-3.png",
  },
];

const CoachesSection = () => {
  const [coaches, setCoaches] = useState(FALLBACK_COACHES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCoaches = async () => {
      try {
        const res = await publicAPI.getCoaches(4);

        if (
          res?.success &&
          Array.isArray(res.data) &&
          res.data.length > 0 &&
          isMounted
        ) {
          // backend already returns { id, name, specialty, experienceYears, bio }
          const mapped = res.data.map((coach, index) => ({
            id: coach.id || coach._id || `coach-${index}`,
            name: coach.name,
            specialty: coach.specialty || "Personal Coach",
            image: "https://i.postimg.cc/P5f1yMZY/Screenshot-3.png", // still using same image for now
          }));
          setCoaches(mapped);
        }
      } catch (err) {
        console.error("Failed to load coaches", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCoaches();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="coaches" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-4">
            Expert Team
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Meet Our{" "}
            <span className="text-gradient">Elite Coaches</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Learn from the best in the industry. Our certified coaches are dedicated to helping you achieve your fitness dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="group bg-card border border-border rounded-3xl overflow-hidden shadow-lg shadow-primary/10 hover:shadow-primary/40 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold mb-1">
                  {coach.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-3">
                  {coach.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <p className="mt-4 text-sm text-muted-foreground">
            Loading coaches…
          </p>
        )}
      </div>
    </section>
  );
};

export default CoachesSection;
