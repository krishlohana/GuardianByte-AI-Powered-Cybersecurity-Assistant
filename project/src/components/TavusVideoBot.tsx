import React, { useState } from 'react';
import { Video, Calendar, Sparkles, User, Bot, Mail, CheckCircle2, AlertTriangle, Bell, Users, TrendingUp, Gift, Star } from 'lucide-react';

interface WaitlistEntry {
  email: string;
  name: string;
  interests: string[];
  priority: 'standard' | 'priority' | 'vip';
  joinedAt: string;
  referralCode?: string;
}

const TavusVideoBot = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({
    name: '',
    email: '',
    interests: [] as string[],
    referralCode: ''
  });
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);

  const comingSoonFeatures = [
    {
      id: 'custom-videos',
      title: 'Custom AI Video Generation',
      description: 'Generate personalized cybersecurity videos based on your specific questions and scenarios',
      icon: <Video className="w-6 h-6 text-purple-400" />,
      eta: 'Q2 2025',
      priority: 'high'
    },
    {
      id: 'real-time-analysis',
      title: 'Real-time Threat Analysis Videos',
      description: 'AI-generated video explanations of current threats and how to protect yourself',
      icon: <Bot className="w-6 h-6 text-blue-400" />,
      eta: 'Q2 2025',
      priority: 'medium'
    },
    {
      id: 'personalized-training',
      title: 'Personalized Security Training',
      description: 'Custom video training modules based on your security assessment results',
      icon: <User className="w-6 h-6 text-green-400" />,
      eta: 'Q3 2025',
      priority: 'medium'
    }
  ];

  const interestOptions = [
    'Custom Video Generation',
    'Threat Analysis Videos',
    'Security Training',
    'Real-time Alerts',
    'Interactive Tutorials',
    'Business Solutions',
    'Personal Security',
    'Technical Deep-dives'
  ];

  const handleInterestToggle = (interest: string) => {
    setWaitlistForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateReferralCode = (email: string): string => {
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `GUARD${Math.abs(hash).toString(36).toUpperCase().slice(0, 6)}`;
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!waitlistForm.email || !waitlistForm.name) {
      setWaitlistStatus('error');
      setWaitlistMessage('Please fill in all required fields');
      return;
    }

    setWaitlistStatus('loading');
    setWaitlistMessage('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate referral code for the user
      const referralCode = generateReferralCode(waitlistForm.email);
      
      // Determine priority based on interests and referral
      let priority: 'standard' | 'priority' | 'vip' = 'standard';
      if (waitlistForm.referralCode) {
        priority = 'priority';
      }
      if (waitlistForm.interests.length >= 4) {
        priority = priority === 'priority' ? 'vip' : 'priority';
      }

      const waitlistEntry: WaitlistEntry = {
        email: waitlistForm.email,
        name: waitlistForm.name,
        interests: waitlistForm.interests,
        priority,
        joinedAt: new Date().toISOString(),
        referralCode
      };

      // Store in localStorage (in production, this would be sent to your backend)
      const existingWaitlist = JSON.parse(localStorage.getItem('video_waitlist') || '[]');
      
      // Check if email already exists
      const existingEntry = existingWaitlist.find((entry: WaitlistEntry) => entry.email === waitlistForm.email);
      if (existingEntry) {
        setWaitlistStatus('error');
        setWaitlistMessage('This email is already on the waitlist!');
        return;
      }

      existingWaitlist.push(waitlistEntry);
      localStorage.setItem('video_waitlist', JSON.stringify(existingWaitlist));

      // Calculate position (VIP first, then priority, then standard by join date)
      const sortedWaitlist = existingWaitlist.sort((a: WaitlistEntry, b: WaitlistEntry) => {
        const priorityOrder = { vip: 0, priority: 1, standard: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      });

      const position = sortedWaitlist.findIndex((entry: WaitlistEntry) => entry.email === waitlistForm.email) + 1;
      
      setWaitlistPosition(position);
      setUserReferralCode(referralCode);
      setWaitlistStatus('success');
      setWaitlistMessage(`Welcome to the waitlist! You're #${position} in line.`);
      
      // Reset form
      setWaitlistForm({
        name: '',
        email: '',
        interests: [],
        referralCode: ''
      });

    } catch (error) {
      console.error('Waitlist submission error:', error);
      setWaitlistStatus('error');
      setWaitlistMessage('Something went wrong. Please try again.');
    }
  };

  const getWaitlistStats = () => {
    const waitlist = JSON.parse(localStorage.getItem('video_waitlist') || '[]');
    const totalUsers = waitlist.length;
    const vipUsers = waitlist.filter((entry: WaitlistEntry) => entry.priority === 'vip').length;
    const priorityUsers = waitlist.filter((entry: WaitlistEntry) => entry.priority === 'priority').length;
    
    return { totalUsers, vipUsers, priorityUsers };
  };

  const stats = getWaitlistStats();

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-4 bg-purple-500/20 rounded-xl">
            <Video className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">AI Video Security Expert</h3>
            <p className="text-gray-400">Powered by advanced AI video generation</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h4 className="text-xl font-semibold text-purple-300">Coming Soon!</h4>
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <p className="text-gray-300 text-lg mb-4">
            We're developing cutting-edge AI video technology to provide personalized cybersecurity education through dynamic video content.
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-400 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Expected Launch: Q2 2025</span>
          </div>
          
          {/* Waitlist Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Users</span>
              </div>
              <div className="text-xl font-bold text-blue-400">{stats.totalUsers}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">VIP Access</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{stats.vipUsers}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Priority</span>
              </div>
              <div className="text-xl font-bold text-green-400">{stats.priorityUsers}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {comingSoonFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
            className={`p-6 rounded-xl border transition-all text-left relative ${
              selectedFeature === feature.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
            }`}
          >
            {feature.priority === 'high' && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                High Priority
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              {feature.icon}
              <h4 className="font-semibold">{feature.title}</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3 text-purple-400" />
              <span className="text-purple-400 font-medium">ETA: {feature.eta}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedFeature && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-8">
          <h4 className="text-lg font-semibold mb-3">Feature Details</h4>
          {selectedFeature === 'custom-videos' && (
            <div className="space-y-3">
              <p className="text-gray-300">
                Our AI video generation system will create personalized cybersecurity videos tailored to your specific questions and scenarios.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Ask any cybersecurity question and get a custom video explanation</li>
                <li>• Personalized AI presenter with professional appearance</li>
                <li>• Multiple voice options and presentation styles</li>
                <li>• Real-time video generation in under 60 seconds</li>
                <li>• Download videos for offline viewing and sharing</li>
              </ul>
            </div>
          )}
          {selectedFeature === 'real-time-analysis' && (
            <div className="space-y-3">
              <p className="text-gray-300">
                Get AI-generated video explanations of current cybersecurity threats and protection strategies.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Daily threat briefings in video format</li>
                <li>• Visual demonstrations of attack methods</li>
                <li>• Step-by-step protection guides</li>
                <li>• Industry-specific threat analysis</li>
                <li>• Emergency response video alerts</li>
              </ul>
            </div>
          )}
          {selectedFeature === 'personalized-training' && (
            <div className="space-y-3">
              <p className="text-gray-300">
                Custom video training modules based on your security assessment results and learning preferences.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Adaptive learning paths based on your skill level</li>
                <li>• Interactive video quizzes and assessments</li>
                <li>• Progress tracking and certification</li>
                <li>• Role-based training scenarios</li>
                <li>• Gamified learning experience</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Waitlist Section */}
      <div className="text-center">
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <h4 className="text-lg font-semibold mb-3">🚀 Join the Exclusive Waitlist</h4>
          <p className="text-gray-400 mb-6">
            Be among the first to experience revolutionary AI-powered cybersecurity videos. Get early access, exclusive updates, and special perks!
          </p>

          {!showWaitlist ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <Gift className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <h5 className="font-semibold text-purple-300 mb-1">Early Access</h5>
                  <p className="text-xs text-purple-200">Get access 30 days before public launch</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <Bell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <h5 className="font-semibold text-blue-300 mb-1">Exclusive Updates</h5>
                  <p className="text-xs text-blue-200">Behind-the-scenes development insights</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <Star className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <h5 className="font-semibold text-green-300 mb-1">VIP Features</h5>
                  <p className="text-xs text-green-200">Priority support and premium features</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => setShowWaitlist(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Join Waitlist Now
                </button>
                <button className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition">
                  Learn More
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {waitlistStatus === 'success' ? (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-green-300 mb-2">Welcome to the Waitlist!</h4>
                  <p className="text-green-200 mb-4">{waitlistMessage}</p>
                  
                  {waitlistPosition && (
                    <div className="bg-green-900/30 rounded-lg p-4 mb-4">
                      <div className="text-2xl font-bold text-green-300">#{waitlistPosition}</div>
                      <div className="text-sm text-green-400">Your position in line</div>
                    </div>
                  )}

                  {userReferralCode && (
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold mb-2">🎁 Your Referral Code</h5>
                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-lg text-center border border-gray-600">
                        {userReferralCode}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Share this code with friends to move up in the waitlist!
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowWaitlist(false);
                      setWaitlistStatus('idle');
                      setWaitlistMessage('');
                      setWaitlistPosition(null);
                      setUserReferralCode(null);
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">Name *</label>
                    <input
                      type="text"
                      value={waitlistForm.name}
                      onChange={(e) => setWaitlistForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white"
                      placeholder="Your full name"
                      required
                      disabled={waitlistStatus === 'loading'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">Email *</label>
                    <input
                      type="email"
                      value={waitlistForm.email}
                      onChange={(e) => setWaitlistForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white"
                      placeholder="your@email.com"
                      required
                      disabled={waitlistStatus === 'loading'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">Referral Code (Optional)</label>
                    <input
                      type="text"
                      value={waitlistForm.referralCode}
                      onChange={(e) => setWaitlistForm(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white font-mono"
                      placeholder="GUARD123456"
                      disabled={waitlistStatus === 'loading'}
                    />
                    <p className="text-xs text-gray-400 mt-1">Have a referral code? Get priority access!</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-left">What interests you most? (Select multiple)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          disabled={waitlistStatus === 'loading'}
                          className={`p-2 rounded-lg text-xs font-medium transition text-left ${
                            waitlistForm.interests.includes(interest)
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                              : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Select 4+ interests for VIP status! 🌟
                    </p>
                  </div>

                  {waitlistStatus === 'error' && (
                    <div className="p-3 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{waitlistMessage}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={waitlistStatus === 'loading'}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                        waitlistStatus === 'loading'
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                      }`}
                    >
                      {waitlistStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Join Waitlist</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowWaitlist(false)}
                      disabled={waitlistStatus === 'loading'}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Video className="w-3 h-3 text-purple-400" />
            Powered by Tavus AI
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Advanced AI Technology
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-green-400" />
            Coming Q2 2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default TavusVideoBot;