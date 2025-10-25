import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "../Ui/ProjectCard";
import p1 from "../assets/img/projects/p11.png";
import p2 from "../assets/img/projects/p2.png";
import p3 from "../assets/img/projects/p3.png";
import p4 from "../assets/img/projects/p4.png";
import p5 from "../assets/img/projects/p5.png";
import p6 from "../assets/img/projects/p6.png";
const Projects = () => {
  const projects = [
    {
      title: "Picture Perfect Productions",
      img: p1,
      preview: "https://www.pictureperfect-productions.co.uk/",
      tags: [
        "Next",
        "Tailwind",
        "ANT Design",
        "NextAPI",
        "NextAuth",
        "PDF Generation",
      ],
      BuildIn: "Next.js",
      desc: "A web application that allows Admin to create and share their own photo albums. Admikn can upload photos, add captions, and organize their albums into categories.",
    },
    {
      title: "Virtual Question Bank",
      img: p2,
      preview: "https://virtual-question.vercel.app/",
      BuildIn: "React.js",
      desc: "A web application that allows users attempt quizzes and track their progress. Users can create their own quizzes, share them with others, and view detailed analytics on their performance.",
      tags: ["Next", "Tailwind", "ANT Design", "NextAPI", "NextAuth"],
    },
    {
      title: "Quick Shop Store Landing page",
      img: p3,
      preview: "https://quickshopstore.netlify.app/",
      BuildIn: "React.js",
      tags: ["React", "Tailwind"],
      desc: "A web application that allows users to browse and purchase products from a variety of categories. Users can filter products by price, brand, and other criteria, and view detailed product information.",
    },
    {
      title: "OLX Clone",
      img: p4,
      preview: "http://cloneeolx.netlify.app/",
      BuildIn: "Vite React.js",
      tags: ["React", "Tailwind", "Firebase", "Vite"],
      desc: "A web application that allows users to buy and sell products locally. Users can create listings, chat with potential buyers, and manage their transactions.",
    },
    {
      title: "Waffle & Cones",
      img: p5,
      preview: "https://waffleandcones.com/",
      BuildIn: "WordPress",
      tags: ["Wordpress", "Elementor", "WooCommerce"],
      desc: "Waffle & Cones is a premium dessert shop based just minutes from the beach in the heart of Whitley Bay, United Kingdom.",
    },
    {
      title: "Unsplash Clone",
      img: p6,
      preview: "https://ahmedz182.github.io/Unslpash-clone-in-react/",
      BuildIn: "React.js",
      tags: ["React", "Bootstrap", "Axios"],
      desc: "A web application that allows users to search and view high-quality images from Unsplash. Users can filter images by category, color, and other criteria, and view detailed image information.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const projectVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
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
      id="Projects"
      className="flex flex-wrap justify-center lg:ps-24 sm:ps-5 items-center px-10 gap-5 py-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}>
      {projects.map((project, index) => (
        <motion.div key={index} variants={projectVariants}>
          <ProjectCard
            title={project.title}
            img={project.img}
            tags={project.tags}
            BuildIn={project.BuildIn}
            preview={project.preview}
            desc={project.desc}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Projects;
