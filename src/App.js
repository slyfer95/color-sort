import "./App.css";
import { useTheme } from "./context/ThemeContext";
import Game from "./components/Game";

function App() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        !darkMode ? "bg-gray-50 text-gray-900" : "bg-gray-900 text-white"
      } 
                    transition-colors duration-200 p-2 sm:p-4`}
    >
      <button
        onClick={toggleTheme}
        className={`fixed top-2 sm:top-4 right-2 sm:right-4 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg bg-opacity-80 backdrop-blur-sm shadow-lg
          ${!darkMode ? "bg-white text-gray-900" : "bg-gray-700 text-white"}`}
      >
        {!darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <Game />
      </div>
    </div>
  );
}

export default App;
