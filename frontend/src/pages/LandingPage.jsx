import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src="/logo.png" alt="EcoWaste Logo" className="w-12 h-12 mr-3 drop-shadow-md" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          EcoWaste
        </h1>
      </div>

      {/* Icons Row */}
      <div className="flex gap-6 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm text-2xl">🌲</div>
        <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm text-2xl">🌍</div>
        <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm text-2xl">⚡</div>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
        Welcome to <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">EcoWaste</span>
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-8 text-lg leading-relaxed">
        Join the sustainable future with our e-waste management platform. Track,
        manage, and optimize your recycling impact with cutting-edge technology.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all"
        >
          Get Started
        </button>
        <button className="px-8 py-3 rounded-lg font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
          Learn More
        </button>
      </div>
    </div>
  );
}
