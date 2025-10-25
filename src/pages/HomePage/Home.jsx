import React from "react";
import { motion } from "framer-motion";
import Title from "../../Ui/Title";
import AboutMe from "../../components/AboutMe";
import Skills from "../../components/Skills";
import Projects from "../../components/Projects";
import Contact from "../../components/Contact";
import HeroSection from "../../components/HeroSection";
import FloatingNav from "../../components/FloatingNav";
import Footer from "../../components/Footer";

const Home = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      <motion.div variants={sectionVariants}>
        <HeroSection />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <AboutMe />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Title title="Skills" />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Skills />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Title title="Projects" name="Projects" link="/projects" />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Projects />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Title title="Contact" />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Contact />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Footer />
      </motion.div>

      {/* Floating Navigation */}
      <FloatingNav />
    </motion.div>
  );
};

export default Home;
