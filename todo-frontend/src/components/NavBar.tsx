'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { useTheme } from "next-themes"; // Use useTheme hook

export default function NavBar() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes

  // Track mouse movement for subtle effects
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 10 - 5, // Normalize X movement
      y: (e.clientY / window.innerHeight) * 10 - 5, // Normalize Y movement
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme); // Use setTheme from next-themes
    localStorage.setItem("theme", newTheme); // Persist in localStorage
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-gradient-to-b from-blue-500 to-white/70 backdrop-blur-md shadow-md border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto flex justify-between items-center py-6 px-6">
        {/* Logo with Mouse Movement - Home link inside */}
        <motion.div
          className="flex items-center gap-2 font-bold text-3xl cursor-pointer"
          animate={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <CheckSquare className="h-8 w-8 text-blue-500 dark:text-blue-300" />
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
            To-Do App
          </span>
        </motion.div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="bg-gray-200 text-gray-800 p-2 rounded-full dark:bg-gray-700 dark:text-white"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}
