import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert("Thank you for your message! I'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 2000);
  };

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

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const contactInfoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      id="Contact-Me"
      className="min-h-[100vh] bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-6 lg:px-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 mb-4"
            variants={itemVariants}>
            <motion.span
              className="inline-block w-6 h-[2px] bg-[#2694d4]"
              initial={{ width: 0 }}
              whileInView={{ width: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}></motion.span>
            <span>Get In Touch</span>
            <motion.span
              className="inline-block w-6 h-[2px] bg-[#2694d4]"
              initial={{ width: 0 }}
              whileInView={{ width: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}></motion.span>
          </motion.div>

          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
            variants={itemVariants}>
            Let's Work Together
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}>
            Have a project in mind? I'd love to hear about it. Send me a message
            and let's discuss how we can bring your ideas to life.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            variants={formVariants}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2694d4] focus:border-transparent transition duration-200"
                    placeholder="John Doe"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2694d4] focus:border-transparent transition duration-200"
                    placeholder="john@example.com"
                  />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2694d4] focus:border-transparent transition duration-200"
                  placeholder="Project Discussion"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2694d4] focus:border-transparent transition duration-200 resize-none"
                  placeholder="Tell me about your project..."></textarea>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2694d4] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#0481bf] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Message
                    <i className="ri-send-plane-line"></i>
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div className="space-y-8" variants={contactInfoVariants}>
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}>
                <div className="bg-[#2694d4] text-white p-3 rounded-lg">
                  <i className="ri-mail-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">ahmedmughal3182@gmail.com</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}>
                <div className="bg-[#2694d4] text-white p-3 rounded-lg">
                  <i className="ri-phone-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">+92 335 7035717</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}>
                <div className="bg-[#2694d4] text-white p-3 rounded-lg">
                  <i className="ri-map-pin-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Location</h3>
                  <p className="text-gray-600">Lahore, Punjab, Pakistan</p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              variants={itemVariants}>
              <h3 className="font-semibold text-gray-800 mb-4">Follow Me</h3>
              <div className="flex gap-4">
                {[
                  {
                    icon: "ri-linkedin-line",
                    href: "https://www.linkedin.com/in/ahmedz182/",
                    color: "hover:bg-blue-600",
                  },
                  {
                    icon: "ri-github-line",
                    href: "https://github.com/Ahmedz182",
                    color: "hover:bg-gray-800",
                  },

                  {
                    icon: "ri-instagram-line",
                    href: "https://www.instagram.com/ahmedz182/",
                    color: "hover:bg-pink-500",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition duration-300 ${social.color} hover:text-white`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}>
                    <i className={`${social.icon} text-xl`}></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              className="bg-gradient-to-r from-[#2694d4] to-[#0481bf] rounded-xl shadow-lg p-6 text-white"
              variants={itemVariants}>
              <div className="flex items-center gap-3 mb-3">
                <i className="ri-time-line text-2xl"></i>
                <h3 className="font-semibold">Quick Response</h3>
              </div>
              <p className="text-blue-100">
                I typically respond to messages within 24 hours. Looking forward
                to hearing from you!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
