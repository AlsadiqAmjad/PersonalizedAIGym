import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

// Image is in public directory, accessed from root
const img1 = "/img9.png";

gsap.registerPlugin(SplitText);

const SubHero = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    // Use gsap.context to safely scope animations to this container
    const ctx = gsap.context(() => {
      // Timeline for text / image animations
      const tl = gsap.timeline();

      tl.to(".the", {
        x: -100,
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "power2.out",
      })
        .to(
          ".rec",
          {
            x: 100,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "<" // start at same time as previous
        )
        .fromTo(
          ".middle-photo",
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );

      // Fade out the container safely
      gsap.fromTo(
        containerRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          delay: 4,
          duration: 1,
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
          },
        }
      );
    }, containerRef);

    // Cleanup: revert all animations if component unmounts
    return () => ctx.revert();
  }, []);
  return (
    <div ref={containerRef} className="flex-center sub-hero w-full overflow-x-hidden">
      <div className="flex-between w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] px-4">
        <h1 className="the text-4xl sm:text-5xl md:text-6xl lg:text-7xl">The</h1>
        <h1 className="rec text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-yellow-300">Rec</h1>
      </div>
      <img
        src={img1}
        alt=""
        className="middle-photo absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default SubHero;
