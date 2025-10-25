import React from "react";
import { motion } from "framer-motion";
import img from "../assets/img/self-bg2.png";
import CV from "../assets/PDF/CV.pdf"; // Assuming you have a CV file in the assets folder
const AboutMe = () => {
  const handlePdf = () => {
    const link = document.createElement("a");
    link.href = CV; // Make sure CV is a valid URL to the PDF
    link.download = "Resume.pdf"; // Optional: name the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -100, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      id="About-Me"
      className="min-h-screen flex flex-col lg:flex-row gap-10 lg:gap-16 items-center px-6 lg:px-20 py-16 lg:py-24"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}>
      {/* Image Section */}
      <motion.div className="w-full lg:w-2/5" variants={imageVariants}>
        <motion.div className="glass-card p-8 rounded-3xl">
          <motion.img
            className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
            src={img}
            alt="ahmed"
            whileHover={{
              scale: 1.05,
              rotate: 3,
              transition: { duration: 0.3 },
            }}
          />
        </motion.div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        className="flex flex-col gap-y-8 w-full lg:w-3/5"
        variants={textVariants}>
        {/* Heading with line */}
        <motion.div
          className="flex items-center gap-4 text-lg font-medium text-white"
          variants={itemVariants}>
          <motion.span
            className="inline-block w-8 h-[3px] bg-gradient-to-r from-[#2694d4] to-[#0481bf] rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}></motion.span>
          <span className="text-blue-100">About Me</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={itemVariants}>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight"
            variants={itemVariants}>
            Who is{" "}
            <motion.span
              className="font-bold bg-gradient-to-r from-[#2694d4] to-[#0481bf] bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}>
              Muhammad Ahmed Fayyaz
            </motion.span>{" "}
            ?
          </motion.h2>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-blue-100 text-lg md:text-xl leading-relaxed"
          variants={itemVariants}>
          I'm an experienced website developer with 1+ year in the field.
          Collaborating with individuals, I bring passion and precision to every
          project I work on. I specialize in creating modern, responsive web
          applications with clean code and beautiful user interfaces.
        </motion.p>

        {/* Additional Description */}
        <motion.p
          className="text-white text-base md:text-lg leading-relaxed"
          variants={itemVariants}>
          My expertise lies in frontend technologies including React,
          JavaScript, and modern CSS frameworks. I believe in continuous
          learning and staying updated with the latest web development trends to
          deliver exceptional digital experiences.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          variants={statsVariants}>
          <motion.div
            className="glass-card flex flex-col gap-y-3 px-6 py-6 rounded-2xl text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}>
            <motion.span
              className="font-bold text-3xl md:text-4xl text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}>
              10+
            </motion.span>
            <span className="text-blue-100 text-base font-medium">
              Projects Completed
            </span>
          </motion.div>

          <motion.div
            className="glass-card flex flex-col gap-y-3 px-6 py-6 rounded-2xl text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}>
            <motion.span
              className="font-bold text-3xl md:text-4xl text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}>
              2+
            </motion.span>
            <span className="text-blue-100 text-base font-medium">
              Industries Served
            </span>
          </motion.div>

          <motion.div
            className="glass-card flex flex-col gap-y-3 px-6 py-6 rounded-2xl text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}>
            <motion.span
              className="font-bold text-3xl md:text-4xl text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}>
              1+
            </motion.span>
            <span className="text-blue-100 text-base font-medium">
              Years Experience
            </span>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          variants={itemVariants}>
          <motion.button
            onClick={handlePdf}
            className="glass-button relative inline-flex items-center justify-center overflow-hidden rounded-full group px-8 py-4 cursor-pointer text-white font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <span className="absolute inset-0 bg-gradient-to-r from-[#2694d4] to-[#0481bf] transition-all duration-300 ease-in-out scale-x-0 origin-left group-hover:scale-x-100 z-0 rounded-full"></span>
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              Download Resume
              <motion.i
                className="ri-download-line text-xl"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}></motion.i>
            </span>
          </motion.button>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-lg">
              Available for freelance projects
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutMe;
