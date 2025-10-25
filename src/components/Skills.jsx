import React from "react";
import { motion } from "framer-motion";
import htmllogo from "../assets/img/logo/html.png";
import csslogo from "../assets/img/logo/css.png";
import pythonlogo from "../assets/img/logo/python.png";
import gitlogo from "../assets/img/logo/git.webp";
import githublogo from "../assets/img/logo/github.webp";
import jslogo from "../assets/img/logo/js.webp";
import reactlogo from "../assets/img/logo/react.png";
import tailwindlogo from "../assets/img/logo/tailwind.png";
import wordpresslogo from "../assets/img/logo/wordpress.webp";
import visuallogo from "../assets/img/logo/visual-studio-code.png";
import botstraplogo from "../assets/img/logo/bootstrap.webp";

const Skills = () => {
  const skills = [
    { name: "HTML", img: htmllogo },
    { name: "CSS", img: csslogo },
    { name: "JavaScript", img: jslogo },
    { name: "Python", img: pythonlogo },
    { name: "React.js", img: reactlogo },
    { name: "Tailwind", img: tailwindlogo },
    { name: "Bootstrap", img: botstraplogo },
    { name: "WordPress", img: wordpresslogo },
    { name: "Git", img: gitlogo },
    { name: "GitHub", img: githublogo },
    { name: "VS Code", img: visuallogo },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const skillVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      id="Skills"
      className="flex flex-wrap min-h-[80dvh] justify-center lg:ps-24 sm:ps-5 items-center px-10 gap-5 my-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}>
      {skills.map((skill, index) => (
        <motion.span
          key={index}
          className="flex flex-col justify-center items-center cursor-pointer lg:min-h-54 sm:min-h-44 lg-w-32 sm:w-24  bg-gray-100 px-10 py-6 min-w-48  shadow-lg hover:bg-blue-500 hover:-translate-y-2 transition duration-200 ease-linear text-white rounded-lg  gap-4"
          variants={skillVariants}
          whileHover={{
            scale: 1.05,
            y: -10,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}>
          <motion.img
            src={skill.img}
            alt={skill.name}
            className="w-28 h-28 object-contain"
            whileHover={{
              rotate: 360,
              transition: { duration: 0.8 },
            }}
          />
          <motion.span
            className="text-lg font-medium text-black tracking-wider "
            whileHover={{ color: "#ffffff" }}>
            {skill.name}
          </motion.span>
        </motion.span>
      ))}
    </motion.div>
  );
};

export default Skills;
