import React from "react";
import { motion } from "framer-motion";

const ProjectCard = ({
  img,
  title,
  tags,
  BuildIn = "N/A",
  desc = "N/A",
  preview,
}) => {
  const handlePreview = () => {
    window.open(preview, "_blank");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div variants={cardVariants} whileHover="hover">
      <motion.div
        onClick={handlePreview}
        className="glass-card relative group flex flex-col pb-5 cursor-pointer min-h-72 w-96 text-white rounded-lg overflow-hidden"
        variants={hoverVariants}>
        {/* Image Wrapper */}
        <div className="relative min-h-72 w-full">
          <motion.img
            src={img}
            alt={title}
            className="w-full h-full object-contain rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          {/* Link Icon Overlay */}
          <motion.div
            className="absolute inset-0 flex justify-center items-center glass-dark opacity-0 group-hover:opacity-100 transition duration-200 ease-linear rounded-lg"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}>
            <motion.i
              className="ri-links-line text-5xl text-white"
              initial={{ scale: 0.8, rotate: 0 }}
              whileHover={{
                scale: 1.2,
                rotate: 360,
                transition: { duration: 0.5 },
              }}></motion.i>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          className="flex flex-col justify-between items-start px-3 py-2 gap-y-1"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}>
          <motion.span
            className="text-lg font-medium line-clamp-1 text-white tracking-wider"
            whileHover={{ x: 5 }}>
            {title}
          </motion.span>

          <motion.span
            className="text-sm line-clamp-1 text-blue-100 tracking-wider"
            whileHover={{ x: 5 }}>
            {desc}
          </motion.span>

          <motion.span
            className="text-sm font-medium text-blue-100 tracking-wider"
            whileHover={{ x: 5 }}>
            Build In: <span className="text-white uppercase">{BuildIn}</span>
          </motion.span>

          <motion.div
            className="flex flex-wrap gap-2 mt-1"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}>
            {tags.slice(0, 4).map((tag, index) => (
              <motion.span
                key={index}
                className="glass-button text-sm px-3 py-1 rounded text-white"
                initial={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.05,
                  transition: { delay: index * 0.1 },
                }}>
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
