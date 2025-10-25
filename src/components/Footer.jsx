import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: "ri-github-line",
      url: "https://github.com/Ahmedz182",
      color: "hover:text-gray-300",
    },
    {
      name: "LinkedIn",
      icon: "ri-linkedin-line",
      url: "https://linkedin.com/in/ahmed",
      color: "hover:text-gray-300",
    },
    {
      name: "Twitter",
      icon: "ri-twitter-line",
      url: "https://twitter.com/ahmed",
      color: "hover:text-gray-300",
    },
    {
      name: "Email",
      icon: "ri-mail-line",
      url: "mailto:ahmedmughal3182@gmail.com",
      color: "hover:text-gray-300",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.footer
      className="relative backdrop-blur-lg text-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}>
      {/* Glass overlay matching the theme */}
      <div className="absolute inset-0 glass-card"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h3
              className="text-3xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}>
              Muhammad Ahmed Fayyaz
            </motion.h3>
            <p className="text-blue-100 leading-relaxed text-lg">
              Full Stack Developer passionate about creating innovative web
              solutions and bringing ideas to life through clean, modern code.
            </p>
            <motion.div className="flex space-x-6" variants={containerVariants}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button p-3 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                  }}
                  whileTap={{ scale: 0.9 }}>
                  <i className={`${social.icon} text-xl`}></i>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-bold text-white">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.a
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group text-lg"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}>
                    <motion.i
                      className="ri-arrow-right-line mr-3 opacity-0 group-hover:opacity-100 text-[#2694d4]"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}></motion.i>
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-bold text-white">Get In Touch</h4>
            <div className="space-y-4">
              <motion.div
                className="glass-card flex items-center space-x-4 text-blue-100 p-4 rounded-xl hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ duration: 0.2 }}>
                <div className="glass-button p-2 rounded-full">
                  <i className="ri-map-pin-line text-white text-lg"></i>
                </div>
                <span className="text-base">Lahore, Punjab, Pakistan</span>
              </motion.div>

              <motion.div
                className="glass-card flex items-center space-x-4 text-blue-100 p-4 rounded-xl hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ duration: 0.2 }}>
                <div className="glass-button p-2 rounded-full">
                  <i className="ri-phone-line text-white text-lg"></i>
                </div>
                <span className="text-base">+92 335 7035717</span>
              </motion.div>

              <motion.div
                className="glass-card flex items-center space-x-4 text-blue-100 p-4 rounded-xl hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ duration: 0.2 }}>
                <div className="glass-button p-2 rounded-full">
                  <i className="ri-mail-line text-white text-lg"></i>
                </div>
                <span className="text-base">ahmedmughal3182@gmail.com</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-white border-opacity-20 mt-12 pt-8"
          variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Copyright */}
            <motion.p
              className="text-blue-200 text-base"
              variants={itemVariants}>
              © 2025 Muhammad Ahmed Fayyaz. All rights reserved.
            </motion.p>

            {/* Back to Top */}
            <motion.button
              className="glass-button flex items-center space-x-3 text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ y: 0 }}>
              <span className="text-base">Back to Top</span>
              <motion.i
                className="ri-arrow-up-line text-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}></motion.i>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#2694d4] to-[#0481bf]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Floating particles for extra visual appeal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.footer>
  );
};

export default Footer;
