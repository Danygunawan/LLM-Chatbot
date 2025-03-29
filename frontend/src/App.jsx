import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Profile from "./Profile";
import FoodAnalysis from "./FoodAnalysis";
import RecipeRecommendations from "./RecipeRecommendations";
import Signup from "./Signup";
import Login from "./Login";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Add useEffect to check for authentication on load
  useEffect(() => {
    // Check if user is already authenticated
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserProfile(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUserProfile(null);
    setCurrentPage("home");
  };

  // Footer component to reuse
  const Footer = () => (
    <footer className="bg-white py-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">Eat</span>
            <span className="text-sm text-blue-600 font-semibold">Smart</span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            A blockchain-based platform with decentralized AI for personalized recipe recommendations and food nutrition analysis on the Internet Computer Protocol.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 EatSmart. All rights reserved.
            <span className="mx-2 text-blue-600">•</span>
            <span>Powered by Internet Computer Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // Make sure there's only ONE place where the Home component is rendered
  const renderContent = () => {
    switch (currentPage) {
      case "about":
        return <About />;
      case "login":
        return (
          <Login 
            onPageChange={handlePageChange} 
            onLogin={(user) => {
              setIsAuthenticated(true);
              setUserProfile(user);
            }}
          />
        );
      case "signup":
        return (
          <Signup 
            onPageChange={handlePageChange} 
            onLogin={(user) => {
              setIsAuthenticated(true);
              setUserProfile(user);
            }}
          />
        );
      case "profile":
        return isAuthenticated ? (
          <Profile 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
          />
        ) : (
          <div className="text-center mt-10 p-4 bg-white rounded-lg shadow">
            Please log in to view your profile
          </div>
        );
      case "food-analysis":
        return isAuthenticated ? (
          <FoodAnalysis />
        ) : (
          <div className="text-center mt-10 p-4 bg-white rounded-lg shadow">
            Please log in to analyze food
          </div>
        );
      case "recipes":
        return isAuthenticated ? (
          <RecipeRecommendations userProfile={userProfile} />
        ) : (
          <div className="text-center mt-10 p-4 bg-white rounded-lg shadow">
            Please log in to see recipe recommendations
          </div>
        );
      case "home":
      default:
        // This should be the ONLY place Home is rendered
        return <Home onPageChange={handlePageChange} isAuthenticated={isAuthenticated} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm z-10 fixed top-0 left-0 right-0">
        <Navbar 
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          onPageChange={handlePageChange}
          onLogin={() => handlePageChange('login')}
          onLogout={handleLogout}
        />
      </nav>
      
      {/* Make sure there's only ONE main content section */}
      <main className="w-full overflow-x-hidden">
        <div className="w-full px-4 py-8 mt-16">
          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 