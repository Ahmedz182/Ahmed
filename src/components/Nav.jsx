import { Dropdown, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const Nav = ({ title, menuItem }) => {
  const dropdownItems = menuItem.map((item, index) => ({
    key: index,
    label: (
      <span
        onClick={() => {
          const section = document.getElementById(item.replace(/\s+/g, "-"));
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}>
        {item}
      </span>
    ),
  }));

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const menuVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="glass-nav flex justify-between items-center mx-5 lg:mx-10 md:mx-5 sm:mx-2 py-4 px-6 rounded-2xl mt-4 sticky top-4 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible">
      <motion.img
        src="/logo.png"
        alt="Logo"
        className="glass-button w-14 h-14 object-contain rounded-xl shadow-lg p-2 bg-white/10"
        variants={logoVariants}
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.97 }}
      />

      {/* Desktop Menu */}
      <motion.div
        className="gap-x-10 justify-end hidden lg:flex"
        variants={menuVariants}>
        {menuItem.map((item, index) => (
          <motion.span
            key={index}
            onClick={() => {
              const section = document.getElementById(
                item.replace(/\s+/g, "-")
              );
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-lg font-semibold text-white transition duration-200 ease-linear hover:text-blue-200 cursor-pointer"
            variants={menuItemVariants}
            whileHover={{
              scale: 1.1,
              color: "#dbeafe",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}>
            {item}
          </motion.span>
        ))}
      </motion.div>

      {/* Mobile Dropdown Menu */}
      <motion.div
        className="lg:hidden"
        variants={menuVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}>
        <Dropdown menu={{ items: dropdownItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <i className="ri-menu-4-line cursor-pointer text-2xl text-white"></i>
            </Space>
          </a>
        </Dropdown>
      </motion.div>
    </motion.div>
  );
};

export default Nav;
