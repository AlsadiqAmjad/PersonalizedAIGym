import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useEffect, useRef } from "react";
gsap.registerPlugin(SplitText);
const Hero = () => {
  const heroRef = useRef(null);
  useEffect(() => {
    const hero = heroRef.current;
    let welcoming, mainText, secondaryText;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        hero,
        {
          opacity: 0,
          display: "none",
        },
        { opacity: 1, duration: 1, delay: 5, display: "flex" }
      );
      let welcoming = new SplitText(hero.querySelector(".welcoming"), {
        type: "words",
        wordsClass: "word",
      });
      let mainText = SplitText.create(hero.querySelector(".main-text"), {
        type: "words",
      });
      let secondaryText = SplitText.create(
        hero.querySelector(".secondary-text"),
        {
          type: "lines",
        }
      );
      gsap.from(welcoming.words, {
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        delay: 5,
      });
      gsap.from(mainText.words, {
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        delay: 5.5,
      });
      gsap.from(secondaryText.lines, {
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        delay: 6,
      });
    }, heroRef);
    return () => {
      ctx.revert();
      welcoming?.revert();
      mainText?.revert();
      secondaryText?.revert();
    };
  }, []);
  return (
    <>
      <section id="hero" ref={heroRef} className="flex-center w-full overflow-x-hidden">
        <div className="container flex-center flex-col w-full px-4 sm:px-6 md:px-8 lg:w-[90%] relative con">
          <h1 className="welcoming text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            Welcome to The Rec
          </h1>
          <div className="w-full max-w-full md:max-w-[60%] absolute left-0 md:left-auto md:right-auto bottom-4 sm:bottom-6 md:bottom-10 px-4 md:px-0">
            <p className="main-text text-lg sm:text-xl md:text-2xl text-center md:text-left">Where AI meets. determination</p>
            <p className="secondary-text text-sm sm:text-base md:text-lg text-center md:text-left mt-2">
              Unlock customized workouts that adapt to your body, your progress,
              and your lifestyle.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
