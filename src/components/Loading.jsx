import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const dotVariants = {
    hidden: { y: "100%" },
    visible: {
      y: "0%",
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#2694d4] flex items-center justify-center z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit">
      <div className="text-center">
        {/* Loading Animation */}
        <motion.div
          className="flex justify-center space-x-2 mb-8"
          variants={containerVariants}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 bg-white rounded-full"
              variants={dotVariants}
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div variants={textVariants}>
          <h2 className="text-2xl font-mono text-white mb-2">
            Loading Portfolio
          </h2>
          <motion.div
            className="w-32 h-1 bg-white mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Name Animation */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}>
          <h1 className="text-4xl font-bold text-white">
            Muhammad Ahmed Fayyaz
          </h1>
          <p className="text-lg text-blue-100 mt-2">Full Stack Developer</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loading;
