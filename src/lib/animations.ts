import type { Variants } from 'framer-motion';
import gsap from 'gsap';

// --- Framer Motion Standard Variants ---

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

export const hoverScale = {
  scale: 1.02,
  transition: { type: 'spring', stiffness: 400, damping: 10 }
};

export const tapScale = {
  scale: 0.98
};

// --- GSAP Global Configuration ---

// Register any GSAP plugins here in the future (e.g. ScrollTrigger, Flip)
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger);

/**
 * A handy utility to fade in a list of elements sequentially via GSAP.
 * Ideal for complex lists where Framer Motion stagger is overkill or conflicts.
 */
export const gsapStaggerFade = (elements: Element[] | string, duration = 0.4, stagger = 0.1) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
  );
};

// Lottie configurations can be handled at the component level
// using lottie-react's <Lottie animationData={...} /> component.
