import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Users, Brain, Clock, Shield } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description: "Advanced algorithms create workout plans tailored specifically to your goals, fitness level, and available equipment.",
    },
    {
      icon: Target,
      title: "Goal-Oriented Training",
      description: "Whether you want to build muscle, lose weight, or improve endurance, our AI adapts your plan for optimal results.",
    },
    {
      icon: Clock,
      title: "Time-Efficient Workouts",
      description: "Maximize your results with workouts designed to fit your schedule, from 15-minute HIIT to full gym sessions.",
    },
    {
      icon: Shield,
      title: "Safe & Sustainable",
      description: "Evidence-based programming that prioritizes proper form, injury prevention, and long-term progress.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Busy Professional",
      content: "Finally found a workout plan that adapts to my crazy schedule. The AI knows exactly what I need each day!",
      avatar: "👩‍💼",
    },
    {
      name: "Mike Chen",
      role: "Fitness Enthusiast",
      content: "The personalization is incredible. It's like having a personal trainer who understands my goals perfectly.",
      avatar: "🏋️‍♂️",
    },
    {
      name: "Emma Rodriguez",
      role: "Beginner",
      content: "As someone new to fitness, the guidance and progression has been exactly what I needed to stay motivated.",
      avatar: "🌟",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AI Gym Trainer
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-hero text-white hover:opacity-90 transition-smooth">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
        <div className="container px-4 py-24 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  Powered by Advanced AI
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your{" "}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Personal AI
                  </span>{" "}
                  Fitness Coach
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Get personalized workout plans, nutrition guidance, and real-time coaching 
                  powered by artificial intelligence. Transform your fitness journey today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-hero text-white hover:opacity-90 transition-smooth shadow-accent"
                  >
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">4.9★</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">1M+</div>
                  <div className="text-sm text-muted-foreground">Workouts Generated</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 rounded-3xl blur-3xl"></div>
              <img
                src={heroImage}
                alt="AI Gym Trainer - Personalized fitness coaching"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose AI Gym Trainer?
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of fitness with intelligent, adaptive training that evolves with your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-card hover:shadow-accent transition-smooth">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-gradient-hero p-3 rounded-full w-fit mx-auto">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Fitness Enthusiasts
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands who have transformed their fitness journey with AI-powered coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-xl text-white/80">
              Join thousands of users who have achieved their fitness goals with AI-powered personal training.
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 transition-smooth"
              >
                <Users className="w-5 h-5 mr-2" />
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-hero p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">AI Gym Trainer</span>
              </div>
              <p className="text-muted-foreground">
                Revolutionizing fitness with AI-powered personal training for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-smooth">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-smooth">Pricing</Link></li>
                <li><Link to="/demo" className="hover:text-foreground transition-smooth">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-smooth">About</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-smooth">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-smooth">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-smooth">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-smooth">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-smooth">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 AI Gym Trainer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;