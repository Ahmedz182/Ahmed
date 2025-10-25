import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsExpanded(false);
  };

  const navItems = [
    { id: "Home", icon: "ri-home-line", label: "Home" },
    { id: "About-Me", icon: "ri-user-line", label: "About" },
    { id: "Skills", icon: "ri-code-line", label: "Skills" },
    { id: "Experience", icon: "ri-briefcase-line", label: "Experience" },
    { id: "Projects", icon: "ri-folder-line", label: "Projects" },
    { id: "Contact-Me", icon: "ri-mail-line", label: "Contact" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden">
          {/* Navigation Items */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-3 mb-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}>
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="glass-nav group flex items-center gap-3 text-white px-4 py-3 rounded-full hover:glass-button transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, x: -10 }}
                    whileTap={{ scale: 0.95 }}>
                    <i className={`${item.icon} text-lg`}></i>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Menu Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass-button w-14 h-14 text-white rounded-full flex items-center justify-center transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isExpanded ? 45 : 0 }}>
            <i
              className={`${
                isExpanded ? "ri-close-line" : "ri-menu-line"
              } text-xl`}></i>
          </motion.button>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className="glass-dark w-12 h-12 text-white rounded-full flex items-center justify-center transition-all duration-300 mt-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Scroll to Top">
            <motion.i
              className="ri-arrow-up-line text-lg"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}></motion.i>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;
