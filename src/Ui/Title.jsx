import React from "react";
import { motion } from "framer-motion";

const Title = ({ title, name, link }) => {
  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: 20,
      transition: {
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="flex justify-between items-center px-6 lg:px-20 py-8 lg:py-12 mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}>
      <motion.div
        className="flex justify-start gap-x-4 items-center"
        variants={titleVariants}>
        <motion.span
          className="w-8 h-[3px] bg-gradient-to-r from-[#2694d4] to-[#0481bf] rounded-full"
          variants={lineVariants}></motion.span>
        <motion.h2
          className="text-3xl lg:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          {title}
        </motion.h2>
      </motion.div>

      {name && (
        <motion.button
          className="glass-button text-white font-semibold rounded-full px-6 py-3 lg:px-8 lg:py-4 transition-all duration-300 hover:bg-white hover:bg-opacity-10"
          variants={buttonVariants}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}>
          <a
            href={link}
            className="flex items-center gap-2 text-sm lg:text-base">
            View All{" "}
            <motion.i
              className="ri-arrow-right-long-line text-lg"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}></motion.i>
          </a>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Title;
