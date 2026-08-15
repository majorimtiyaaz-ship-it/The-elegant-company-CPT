import React from 'react';
import { motion } from 'motion/react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className = "", 
  delay = 0,
  once = true 
}) => {
  // Split the text into individual words
  const words = text.split(" ");

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      y: "115%", 
      rotate: 2,
    },
    visible: {
      y: 0,
      rotate: 0,
      transition: {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1], // Custom cinematic cubic-bezier (out-expo)
      }
    }
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap overflow-hidden py-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
    >
      {words.map((word, wordIndex) => (
        <span 
          key={wordIndex} 
          className="inline-block overflow-hidden mr-[0.25em] pb-1 leading-none"
        >
          <motion.span 
            className="inline-block origin-bottom-left"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};
