import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Images are in public directory, accessed from root
const img1 = "/img10.jpeg";
const img2 = "/img15.jpeg";
const img3 = "/img13.jpeg";

gsap.registerPlugin(ScrollTrigger);

const Hero2 = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 2 },
      });

      tl.fromTo(".img1", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1 });

      tl.fromTo(".img2", { scale: 0.2, opacity: 0 }, { scale: 2, opacity: 1 });

      tl.fromTo(".img3", { scale: 0.2, opacity: 0 }, { scale: 2, opacity: 1 });

      ScrollTrigger.create({
        animation: tl,
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000",
        scrub: true,
        pin: true,
      });

      ScrollTrigger.refresh();
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="flex-center h-screen w-full overflow-hidden"
      id="container"
      ref={containerRef}
    >
      <div className="relative h-full w-full max-w-full">
        <img
          src={img1}
          alt=""
          className="img1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 m-auto object-cover rounded-lg"
        />
        <img
          src={img2}
          alt=""
          className="img2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 m-auto object-cover rounded-lg"
        />

        <img
          src={img3}
          alt=""
          className="img3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 m-auto object-cover rounded-lg"
        />
      </div>
    </section>
  );
};

export default Hero2;
