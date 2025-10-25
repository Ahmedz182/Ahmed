import React from "react";
import { motion } from "framer-motion";

const Experience = () => {
  const experiences = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Artilence",
      period: "Sept 2025 - Present",
      type: "Full-time",
      description:
        "Building modern and responsive web applications using React and contemporary frontend technologies. Collaborating with cross-functional teams to deliver high-quality user experiences and implementing best practices in web development.",
      icon: "ri-code-s-slash-line",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Fullstack Developer",
      company: "Freelancer",
      period: "2024 - Present",
      type: "Freelance",
      description:
        "Developing end-to-end web solutions for diverse clients, handling both frontend and backend development. Specialized in creating scalable applications, optimizing performance, and delivering projects that exceed client expectations.",
      icon: "ri-global-line",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "Smash Code",
      period: "2024 (3 Months)",
      type: "Internship",
      description:
        "Gained hands-on experience in frontend development, working on real-world projects and learning industry-standard practices. Contributed to building responsive user interfaces and collaborated with senior developers to enhance coding skills.",
      icon: "ri-lightbulb-line",
      color: "from-green-500 to-teal-500",
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

  const itemVariants = {
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

  const cardVariants = {
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

  return (
    <motion.div
      id="Experience"
      className="min-h-[80vh] py-20 px-5 lg:px-10 md:px-5 sm:px-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}>
      <div className="w-full mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="flex items-center justify-center gap-2 text-sm font-medium text-white mb-4"
            variants={itemVariants}>
            <motion.span
              className="inline-block w-6 h-[2px] bg-white"
              initial={{ width: 0 }}
              whileInView={{ width: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}></motion.span>
            <span>My Journey</span>
            <motion.span
              className="inline-block w-6 h-[2px] bg-white"
              initial={{ width: 0 }}
              whileInView={{ width: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}></motion.span>
          </motion.div>

          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            variants={itemVariants}>
            Work Experience
          </motion.h2>

          <motion.p
            className="text-lg text-blue-100 max-w-2xl mx-auto"
            variants={itemVariants}>
            A timeline of my professional journey, showcasing the roles and
            experiences that have shaped my career in web development.
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#2694d4] via-purple-500 to-transparent opacity-30"></div>

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                variants={cardVariants}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.3 }}>
                {/* Content Card */}
                <motion.div
                  className="glass-card p-6 lg:p-8 rounded-2xl w-full md:w-5/12 relative group"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}>
                  {/* Icon */}
                  <motion.div
                    className={`absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}>
                    <i className={`${exp.icon} text-2xl text-white`}></i>
                  </motion.div>

                  {/* Type Badge */}
                  <motion.span
                    className="glass-button inline-block px-3 py-1 text-xs font-semibold text-white rounded-full mb-3"
                    whileHover={{ scale: 1.05 }}>
                    {exp.type}
                  </motion.span>

                  {/* Title & Company */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-building-line text-[#2694d4]"></i>
                    <span className="text-lg font-semibold text-blue-100">
                      {exp.company}
                    </span>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-calendar-line text-[#2694d4]"></i>
                    <span className="text-sm text-blue-200">{exp.period}</span>
                  </div>

                  {/* Description */}
                  <p className="text-blue-100 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Decorative gradient line */}
                  <div
                    className={`mt-4 h-1 w-20 rounded-full bg-gradient-to-r ${exp.color}`}></div>
                </motion.div>

                {/* Timeline Dot - Hidden on mobile */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#2694d4] to-purple-500 ring-4 ring-white ring-opacity-20 z-10"></div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <motion.div className="glass-card inline-block px-8 py-4 rounded-2xl">
            <p className="text-white font-semibold mb-2">
              Interested in working together?
            </p>
            <motion.button
              onClick={() => {
                const section = document.getElementById("Contact-Me");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="glass-button px-6 py-2 text-white font-semibold rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Let's Connect <i className="ri-arrow-right-line ml-2"></i>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Experience;
