import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { 
  Search, 
  Clock, 
  Target, 
  Zap, 
  Play,
  Star,
  Filter
} from "lucide-react";

const workoutLibrary = [
  {
    id: 1,
    name: "Upper Body Strength",
    category: "Strength",
    duration: 45,
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Bench"],
    muscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
    rating: 4.8,
    description: "Build upper body strength with compound movements",
    image: "💪",
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    category: "Cardio",
    duration: 20,
    difficulty: "Advanced",
    equipment: ["Bodyweight"],
    muscleGroups: ["Full Body"],
    rating: 4.9,
    description: "High-intensity interval training for maximum calorie burn",
    image: "🔥",
  },
  {
    id: 3,
    name: "Lower Body Power",
    category: "Strength",
    duration: 50,
    difficulty: "Intermediate",
    equipment: ["Barbell", "Dumbbells"],
    muscleGroups: ["Legs", "Glutes"],
    rating: 4.7,
    description: "Develop explosive power in your legs and glutes",
    image: "🦵",
  },
  {
    id: 4,
    name: "Core & Stability",
    category: "Core",
    duration: 30,
    difficulty: "Beginner",
    equipment: ["Bodyweight", "Mat"],
    muscleGroups: ["Core", "Abs"],
    rating: 4.6,
    description: "Strengthen your core and improve stability",
    image: "⚡",
  },
  {
    id: 5,
    name: "Full Body Circuit",
    category: "Circuit",
    duration: 35,
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Kettlebells"],
    muscleGroups: ["Full Body"],
    rating: 4.8,
    description: "Complete full-body workout in circuit format",
    image: "🎯",
  },
  {
    id: 6,
    name: "Yoga Flow",
    category: "Flexibility",
    duration: 40,
    difficulty: "Beginner",
    equipment: ["Mat"],
    muscleGroups: ["Full Body"],
    rating: 4.5,
    description: "Improve flexibility and mental clarity",
    image: "🧘",
  },
];

const categories = ["All", "Strength", "Cardio", "Core", "Circuit", "Flexibility"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const Workouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredWorkouts = workoutLibrary.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || workout.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || workout.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-success";
      case "Intermediate": return "text-warning";
      case "Advanced": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "default";
      case "Intermediate": return "secondary";
      case "Advanced": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workout Library</h1>
          <p className="text-muted-foreground">
            Discover personalized workouts designed by AI to match your fitness goals
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredWorkouts.length} of {workoutLibrary.length} workouts
          </p>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="bg-gradient-card border-0 shadow-card hover:shadow-accent transition-smooth group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{workout.image}</div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-accent transition-smooth">
                        {workout.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{workout.category}</Badge>
                        <Badge variant={getDifficultyBadgeVariant(workout.difficulty) as any}>
                          {workout.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-current" />
                    <span className="text-sm font-medium">{workout.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription>{workout.description}</CardDescription>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{workout.muscleGroups.join(", ")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Equipment needed:</p>
                  <div className="flex flex-wrap gap-1">
                    {workout.equipment.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-gradient-hero text-white hover:opacity-90 transition-smooth">
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No workouts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Recommended Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutLibrary.slice(0, 3).map((workout) => (
              <Card key={workout.id} className="bg-gradient-accent/10 border border-accent/20 shadow-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{workout.image}</div>
                    <div>
                      <CardTitle className="text-lg text-accent">{workout.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{workout.category}</Badge>
                        <Badge variant="secondary">{workout.duration} min</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{workout.description}</p>
                  <Button className="w-full bg-gradient-hero text-white hover:opacity-90">
                    <Zap className="h-4 w-4 mr-2" />
                    Try This Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;