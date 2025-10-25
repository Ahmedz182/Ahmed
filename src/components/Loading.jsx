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
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div className="glass-card text-center p-12 rounded-3xl">
        {/* Loading Animation */}
        <motion.div
          className="flex justify-center space-x-3 mb-8"
          variants={containerVariants}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-white rounded-full"
              variants={dotVariants}
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div variants={textVariants}>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#2694d4] to-[#0481bf] mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Name Animation */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}>
          <h1 className="text-3xl font-bold text-white">
            Muhammad Ahmed Fayyaz
          </h1>
          <p className="text-base text-blue-100 mt-2">Full Stack Developer</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Loading;
