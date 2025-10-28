import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const useScrollAnimation = (threshold = 0.1, triggerOnce = true) => {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  return [ref, inView ? 'visible' : 'hidden'];
};

export const AnimatedSection = ({ children, className = '', variants = fadeInUp, ...props }) => {
  const [ref, animationState] = useScrollAnimation();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animationState}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const HoverScale = ({ children, scale = 1.05, className = '' }) => (
  <motion.div
    whileHover={{ scale }}
    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverTilt = ({ children, className = '' }) => (
  <motion.div
    whileHover={{
      rotate: [0, -2, 2, -2, 0],
      transition: { duration: 0.6 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);
