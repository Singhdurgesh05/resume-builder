import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const templates = ['📝', '🎨', '⚡', '🚀', '💼'];
  
  const features = [
    {
      icon: '📝',
      title: "Easy to Use",
      description: "Simple and intuitive interface makes resume building a breeze with guided steps and auto-save functionality."
    },
    {
      icon: '🎨',
      title: "Professional Templates",
      description: "Choose from a variety of professionally designed templates that are ATS-friendly and industry-approved."
    },
    {
      icon: '📥',
      title: "Instant Download",
      description: "Download your resume in PDF, Word, or TXT format instantly with one click."
    },
    {
      icon: '🤖',
      title: "AI-Powered Suggestions",
      description: "Get intelligent recommendations to improve your resume content and formatting."
    },
    {
      icon: '📋',
      title: "Customizable Sections",
      description: "Easily add, remove, or rearrange sections to match your experience level and industry."
    },
    {
      icon: '📱',
      title: "Mobile Friendly",
      description: "Build and edit your resume on any device with our fully responsive design."
    }
  ];

  useEffect(() => {
    document.title = "ResumeNow - Build Professional Resumes in Minutes";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemplate((prev) => (prev + 1) % templates.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/signup';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-500 text-white p-3 rounded-lg z-50 font-medium"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="bg-black shadow-lg sticky top-0 z-40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2 text-green-500">🚀</span>
              <h1 className="text-2xl font-bold text-green-500">ResumeNow</h1>
            </div>
            <div className="flex gap-4">
              <Link
                to="/signin"
                className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 text-white hover:bg-green-500 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Animated Template Icon */}
            <div className="flex justify-center mb-8">
              <div className="text-8xl transform transition-all duration-500 hover:scale-110 text-green-500">
                {templates[currentTemplate]}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              Build Your Perfect Resume
              <span className="block text-green-500 bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent">
                In Minutes
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create professional, ATS-friendly resumes with our easy-to-use builder. 
              Choose from multiple templates, customize your content, and download your 
              resume instantly. Land your dream job faster!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-green-600 text-white hover:bg-green-500 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-green-500"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Get Started Free
                    <span>→</span>
                  </>
                )}
              </button>
              <Link
                to="/dashboard"
                className="bg-transparent text-green-400 hover:bg-green-900/30 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-green-500 transform transition hover:scale-105 flex items-center justify-center gap-2 hover:text-green-300"
              >
                View Live Demo
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">10K+</div>
                <div className="text-gray-400">Resumes Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">95%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">50+</div>
                <div className="text-gray-400">Templates</div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Powerful features to help you create a resume that stands out from the crowd
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-green-500"
                >
                  <div className="bg-green-900/20 w-14 h-14 rounded-lg flex items-center justify-center mb-6 border border-green-500/30">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 md:p-12 text-center text-white border border-green-500">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your Resume?
            </h2>
            <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who landed their dream jobs with ResumeNow
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transform transition hover:scale-105 shadow-lg border border-white"
              >
                Start Building Free
              </Link>
              <Link
                to="/templates"
                className="bg-transparent text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white transform transition hover:scale-105"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2 text-green-500">🚀</span>
                <h2 className="text-2xl font-bold text-white">ResumeNow</h2>
              </div>
              <p className="text-gray-400 max-w-md">
                Building better resumes for better careers. Join thousands of successful 
                job seekers who trust ResumeNow for their career advancement.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-500">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/templates" className="hover:text-green-400 transition-colors">Templates</Link></li>
                <li><Link to="/pricing" className="hover:text-green-400 transition-colors">Pricing</Link></li>
                <li><Link to="/blog" className="hover:text-green-400 transition-colors">Blog</Link></li>
                <li><Link to="/support" className="hover:text-green-400 transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-500">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-green-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ResumeNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;