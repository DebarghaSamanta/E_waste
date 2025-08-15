import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../assets/logo.png'
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Logo */}
      <motion.div
        className="flex items-center mb-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={logo}
          alt="EcoWaste Logo"
          className="w-60 h-45 mr-3 drop-shadow-md"
        />
      </motion.div>

      {/* Icons Row */}
      <motion.div
        className="flex gap-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="p-5 bg-white rounded-2xl shadow-md text-3xl animate-pulse">🌲</div>
        <div className="p-5 bg-white rounded-2xl shadow-md text-3xl animate-pulse">🌍</div>
        <div className="p-5 bg-white rounded-2xl shadow-md text-3xl animate-pulse">⚡</div>
      </motion.div>

      {/* Heading */}
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mb-5 text-gray-900 leading-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Welcome to{" "}
        <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          EcoWaste
        </span>
      </motion.h2>
      
      <motion.p
        className="text-gray-600 max-w-2xl mb-10 text-lg leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        Join the sustainable future with our e-waste management platform. Track,
        manage, and optimize your recycling impact with cutting-edge technology.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <button
          onClick={() => navigate("/register")}
          className="px-10 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all"
        >
          Get Started
        </button>
        <button className="px-10 py-3 rounded-lg font-medium border border-blue-400 text-blue-500 hover:bg-blue-50 transition-all">
          Learn More
        </button>
      </motion.div>
    </div>
  );
}
