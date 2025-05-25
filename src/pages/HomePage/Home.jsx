import React from "react";
import Title from "../../Ui/Title";
import AboutMe from "../../Components/AboutMe";
import Skills from "../../Components/Skills";
import Projects from "../../Components/Projects";
import Contact from "../../Components/Contact";
import HeroSection from "../../Components/HeroSection";

const Home = () => {
  const linkItem = {
    name: "View all Projects",
    link: "/projects",
  };
  return (
    <>
      <HeroSection />
      <AboutMe />
      <Title title="Skills" />
      <Skills />
      <Title title="Projects" name="Projects" link="/projects" />
      <Projects />
      <Title title="Contact" />
      <Contact />
    </>
  );
};

export default Home;
