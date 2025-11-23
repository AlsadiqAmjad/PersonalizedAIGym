import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Images are in public directory, accessed from root
const image1 = "/service1.jpg";
const image2 = "/service2.jpg";
const image3 = "/service3.jpg";
gsap.registerPlugin(ScrollTrigger);
const Services = () => {
  const serviceRef = useRef();
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 1.5 },
      });

      tl.fromTo(
        ".image1",
        { y: 500, scale: 0.8, rotate: -10, opacity: 0 },
        { y: 0, scale: 1, rotate: -5, opacity: 1 }
      );
      tl.fromTo(
        ".image2",
        { y: 500, scale: 0.8, rotate: 5, opacity: 0 },
        { y: 0, scale: 1, rotate: 8, opacity: 1 }
      );
      tl.fromTo(
        ".image3",
        { y: 500, scale: 0.8, rotate: -3, opacity: 0 },
        { y: 0, scale: 1, rotate: -1, opacity: 1 }
      );

      tl.to(".image1", { x: -200, rotate: -2, scale: 0.9 }, "+=0.5");
      tl.to(".image2", { x: 0, rotate: 0, scale: 0.9 }, "<");
      tl.to(".image3", { x: 200, rotate: 2, scale: 0.9 }, "<");

      ScrollTrigger.create({
        animation: tl,
        trigger: serviceRef.current,
        start: "top top",
        end: "+=4000",
        scrub: true,
        pin: true,
      });
    }, serviceRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      className="h-screen bg-yellow-400 relative overflow-hidden flex-center w-full"
      id="service"
      href="service"
      ref={serviceRef}
    >
      <div className="container overflow-hidden w-full px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-9xl text-center md:text-left leading-tight">
          Start transforming — with smart plans built specifically for you.
          <span className="block text-xl sm:text-2xl md:text-3xl mt-2 sm:mt-4">Sign Up Now</span>
        </h1>
        <div className="images abs-center w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] h-64 sm:h-80 md:h-96">
          <div className="image-container">
            <img
              src={image1}
              alt=""
              className="image1 w-full h-full object-cover abs-center rounded-lg"
            />
          </div>
          <div className="image-container">
            <img
              src={image2}
              alt=""
              className="image2 w-full h-full object-cover abs-center rounded-lg"
            />
          </div>
          <div className="image-container">
            <img
              src={image3}
              alt=""
              className="image3 w-full h-full object-cover abs-center rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
