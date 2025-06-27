import React, { useState, useRef } from 'react';
import { Shield, AlertTriangle, Brain, BookOpen, Mail, Bell, Activity, Globe2, Building2, GamepadIcon, Menu, X, Github, Linkedin, ExternalLink, User, Code, Trophy, MessageSquare } from 'lucide-react';
import ThreatMap from './components/ThreatMap';
import NewsSection from './components/NewsSection';
import ThreatAdvisor from './components/ThreatAdvisor';
import EmergencyGuide from './components/EmergencyGuide';
import EmailAnalyzer from './components/EmailAnalyzer';
import SecurityTips from './components/SecurityTips';
import SecurityCourses from './components/SecurityCourses';
import CommunityIncidentBoard from './components/CommunityIncidentBoard';
import PersonalRiskScanner from './components/PersonalRiskScanner';
import BusinessSecurity from './components/BusinessSecurity';
import PhishingGame from './components/PhishingGame';
import EmailNotifications from './components/EmailNotifications';
import VoiceAssistant from './components/VoiceAssistant';
import TavusVideoBot from './components/TavusVideoBot';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const riskScannerRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'threat-map', title: 'Global Threat Map', icon: Globe2 },
    { id: 'news', title: 'News & Alerts', icon: Activity },
    { id: 'risk-scanner', title: 'Risk Scanner', icon: AlertTriangle },
    { id: 'incident-board', title: 'Community Board', icon: Shield },
    { id: 'phishing-game', title: 'Phishing Game', icon: GamepadIcon },
    { id: 'business', title: 'Business Security', icon: Building2 },
    { id: 'video-bot', title: 'AI Video Expert', icon: MessageSquare },
    { id: 'advisor', title: 'AI Advisor', icon: Brain },
    { id: 'emergency', title: 'Emergency Guide', icon: AlertTriangle },
    { id: 'email-analyzer', title: 'Email Analyzer', icon: Mail },
    { id: 'courses', title: 'Security Courses', icon: BookOpen },
    { id: 'tips', title: 'Security Tips', icon: Bell }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleScanThreats = () => {
    if (riskScannerRef.current) {
      riskScannerRef.current.scrollIntoView({ behavior: 'smooth' });
      // Trigger the scan start
      const event = new CustomEvent('startScan');
      riskScannerRef.current.dispatchEvent(event);
    }
  };

  const handleTalkToAI = () => {
    scrollToSection('advisor');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Toggle - Higher z-index to stay above menu */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-[60] bg-gray-800 p-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Side Navigation */}
      <nav className={`nav-menu ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Navigation</h2>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <ul className="space-y-2">
            {sections.map(({ id, title, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
                >
                  <Icon className="w-5 h-5" />
                  <span>{title}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Close button at bottom for better UX */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={closeMenu}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 sm:gap-6 mb-8">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                <h1 className="text-3xl sm:text-4xl font-bold">GuardianByte</h1>
                <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="ml-4 transition-transform hover:scale-105">
                  <img src="/white_circle_360x360.png" alt="Verified by Bolt" className="w-16 h-16 sm:w-24 sm:h-24" />
                </a>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">AI-Powered Cybersecurity Assistant</h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8">Your intelligent companion in the fight against cyber threats. Get real-time alerts, expert guidance, and comprehensive protection.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleScanThreats}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Scan Threats Now
                </button>
                <button 
                  onClick={handleTalkToAI}
                  className="border border-purple-400 hover:bg-purple-900/50 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Talk to AI Assistant
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Shield className="w-48 h-48 xl:w-64 xl:h-64 text-blue-400 opacity-80" />
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />}
              title="Threat Detection"
              description="Real-time monitoring and alerts for emerging cyber threats"
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />}
              title="AI Analysis"
              description="Advanced AI-powered analysis of potential security risks"
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />}
              title="Security Education"
              description="Comprehensive cybersecurity courses and training"
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />}
              title="Email Security"
              description="Advanced email threat detection and analysis"
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />}
              title="Real-time Alerts"
              description="Instant notifications about security incidents"
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />}
              title="AI Assistant"
              description="Intelligent cybersecurity guidance and support"
            />
          </div>
        </div>
      </section>

      {/* Email Notifications */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <EmailNotifications />
        </div>
      </section>

      {/* Global Threat Map */}
      <section id="threat-map" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <Globe2 className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">Global Threat Map</h2>
          </div>
          <ThreatMap />
        </div>
      </section>

      {/* News and Alerts */}
      <section id="news" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <NewsSection />
        </div>
      </section>

      {/* Personal Risk Scanner */}
      <section id="risk-scanner" className="py-20 bg-gray-900" ref={riskScannerRef}>
        <div className="container mx-auto px-6">
          <PersonalRiskScanner />
        </div>
      </section>

      {/* Community Incident Board */}
      <section id="incident-board" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <CommunityIncidentBoard />
        </div>
      </section>

      {/* Phishing Game */}
      <section id="phishing-game" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <GamepadIcon className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold">Hack Me If You Can</h2>
          </div>
          <PhishingGame />
        </div>
      </section>

      {/* Business Security Solutions */}
      <section id="business" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <BusinessSecurity />
        </div>
      </section>

      {/* AI Video Bot Section */}
      <section id="video-bot" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold">AI Video Security Expert</h2>
          </div>
          <TavusVideoBot />
        </div>
      </section>

      {/* AI Advisor Section */}
      <section id="advisor" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <ThreatAdvisor />
        </div>
      </section>

      {/* Emergency Guide */}
      <section id="emergency" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <EmergencyGuide />
        </div>
      </section>

      {/* Email Analyzer */}
      <section id="email-analyzer" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <EmailAnalyzer />
        </div>
      </section>

      {/* Security Courses */}
      <section id="courses" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <SecurityCourses />
        </div>
      </section>

      {/* Security Tips Carousel */}
      <section id="tips" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <SecurityTips />
        </div>
      </section>

      {/* Creator & Founder Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-gray-700 p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold">👨‍💻 Meet the Creator</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Creator Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-blue-400">Krish Lohana</h3>
                      <p className="text-lg text-gray-300 leading-relaxed">
                        GuardianByte was founded and developed by <span className="font-semibold text-white">Krish Lohana</span> as part of the <span className="font-semibold text-blue-400">World's Largest Hackathon 2025</span> powered by Bolt.
                      </p>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      Krish is a tech enthusiast passionate about cybersecurity, AI, and building solutions that help people stay safer online. This project represents the first step towards launching a meaningful startup in the cybersecurity space.
                    </p>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-200">🔗 Connect with Krish:</h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href="https://github.com/krishlohana"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all group border border-gray-600 hover:border-gray-500"
                        >
                          <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                          <span className="font-medium">GitHub</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        
                        <a
                          href="https://pk.linkedin.com/in/krish-lohana-304409283"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-all group border border-blue-500/50 hover:border-blue-400"
                        >
                          <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                          <span className="font-medium">LinkedIn</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        
                        <a
                          href="https://devpost.com/krishlohana"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-all group border border-purple-500/50 hover:border-purple-400"
                        >
                          <Code className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                          <span className="font-medium">Devpost</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-600 p-6 text-center max-w-sm">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-yellow-500/20 rounded-full">
                          <Trophy className="w-12 h-12 text-yellow-400" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Hackathon 2025</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        Built during the World's Largest Hackathon powered by Bolt
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">Cybersecurity Innovation</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 pt-6 border-t border-gray-600">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      Interested in collaborating or learning more about GuardianByte?
                    </p>
                    <a
                      href="https://pk.linkedin.com/in/krish-lohana-304409283"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      <Linkedin className="w-5 h-5" />
                      Connect with Krish
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 text-center">
              © 2025 GuardianByte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Voice Assistant */}
      <VoiceAssistant />
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default App;