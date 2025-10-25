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
    <>
      <motion.div
        className="flex justify-between  items-center  me-5 lg:me-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}>
        <motion.div
          className="flex justify-start lg:ms-24 ms-5 gap-x-2 items-center lg:my-10 sm:my-5"
          variants={titleVariants}>
          <motion.span
            className="w-5 h-[2px] bg-[#2694d4]"
            variants={lineVariants}></motion.span>
          <motion.span
            className="text-4xl font-mono"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            {title}
          </motion.span>
        </motion.div>

        {name && (
          <motion.span
            className="bg-[#0481bf] text-white font-medium  rounded-full px-3 py-2 hover:bg-[#2694d4] transition duration-200 ease-linear"
            variants={buttonVariants}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#2694d4",
            }}
            whileTap={{ scale: 0.95 }}>
            <a href={link}>
              View All{" "}
              <motion.i
                className="ri-arrow-right-long-line"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}></motion.i>
            </a>
          </motion.span>
        )}
      </motion.div>
    </>
  );
};

export default Title;
