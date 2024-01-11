import { motion, useAnimation, useScroll } from "framer-motion";
import React, { useEffect } from "react";

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const widthAnimation = useAnimation();

  useEffect(() => {
    const updateProgress = (latest) => {
      widthAnimation.start({ scaleX: latest });
    };

    const unsubscribe = scrollYProgress.onChange(updateProgress);

    return () => unsubscribe();
  }, [scrollYProgress, widthAnimation]);

  return (
    <motion.div
        style={{
          scaleX: scrollYProgress,
          position: 'fixed',
          top: 0,
          right: null, // Set to null to cover the right edge
          left: null, // Set to null to cover the left edge
          width: '100%', // Cover the full width of the screen
          height: 4,
          transformOrigin: '0% 0%',
          backgroundColor: '#FF4F4F',
          zIndex: '9999',
        }}
      ></motion.div>
  );
};

export default ProgressBar;
