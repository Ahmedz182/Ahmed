import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "remixicon/fonts/remixicon.css";
import "./App.css";
import Home from "./pages/HomePage/Home";
import Loading from "./components/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced loading time for better performance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="App min-h-screen relative -mt-0">
      {/* Reduced floating particles for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white bg-opacity-10 rounded-full simple-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loading key="loading" />
        ) : (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10">
            <Home />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
