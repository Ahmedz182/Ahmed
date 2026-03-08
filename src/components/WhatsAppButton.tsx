"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export const WhatsAppButton = () => {
    const phoneNumber = "923357035717";
    const message = "Hi Ahmed, I'm interested in working with you!";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all group"
            title="Chat on WhatsApp"
        >
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none group-hover:hidden" />
            <FaWhatsapp className="w-8 h-8" />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-4 py-2 bg-theme-dark/90 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-4 group-hover:translate-x-0 transition-transform duration-300">
                Chat with me
            </span>
        </motion.a>
    );
};
