import Hero from "./Hero";
import SubHero from "./SubHero";
import Hero2 from "./Hero2";
import Services from "./Services";
import Coaches from "./Coaches";
const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <SubHero />
      <Hero />
      <Hero2 />
      <Services />
      <Coaches />
    </div>
  );
};

export default Home;
