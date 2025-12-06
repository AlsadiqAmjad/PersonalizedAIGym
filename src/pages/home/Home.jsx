import Header from "../../Components/Header.jsx";
import HeroSection from "../../Components/HeroSection.jsx";
import ServicesSection from "../../Components/ServicesSection.jsx";
import CoachesSection from "../../Components/CoachesSection.jsx";
import Footer from "../../Components/Footer.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <CoachesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
