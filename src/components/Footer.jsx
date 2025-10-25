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
      className="bg-[#2694d4] text-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3
              className="text-2xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}>
              Muhammad Ahmed Fayyaz
            </motion.h3>
            <p className="text-blue-100 leading-relaxed">
              Full Stack Developer passionate about creating innovative web
              solutions and bringing ideas to life through code.
            </p>
            <motion.div className="flex space-x-4" variants={containerVariants}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-blue-200 ${social.color} transition-colors duration-300`}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                  }}
                  whileTap={{ scale: 0.9 }}>
                  <i className={`${social.icon} text-xl`}></i>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.a
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}>
                    <motion.i
                      className="ri-arrow-right-line mr-2 opacity-0 group-hover:opacity-100"
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
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
            <div className="space-y-3">
              <motion.div
                className="flex items-center space-x-3 text-blue-100"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}>
                <i className="ri-map-pin-line text-white"></i>
                <span>Lahore, Punjab, Pakistan</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 text-blue-100"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}>
                <i className="ri-phone-line text-white"></i>
                <span>+92 335 7035717</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 text-blue-100"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}>
                <i className="ri-mail-line text-white"></i>
                <span>ahmedmughal3182@gmail.com</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-blue-400 mt-8 pt-8"
          variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.p className="text-blue-200 text-sm" variants={itemVariants}>
              © 2025 Muhammad Ahmed Fayyaz. All rights reserved.
            </motion.p>

            {/* Back to Top */}
            <motion.button
              className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-300"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}>
              <span className="text-sm">Back to Top</span>
              <motion.i
                className="ri-arrow-up-line"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}></motion.i>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-white"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.footer>
  );
};

export default Footer;
