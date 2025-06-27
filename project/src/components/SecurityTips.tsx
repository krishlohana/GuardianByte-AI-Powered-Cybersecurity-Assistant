import React, { useState, useEffect } from 'react';
import { LightbulbIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const SecurityTips = () => {
  const tips = [
    {
      title: "Strong Password Practices",
      description: "Use a unique password for each account with at least 12 characters, mixing letters, numbers, and symbols. Consider using a password manager.",
      category: "Authentication"
    },
    {
      title: "Enable Multi-Factor Authentication",
      description: "Add an extra layer of security by enabling 2FA on all your accounts, especially email and financial services.",
      category: "Account Security"
    },
    {
      title: "Regular Software Updates",
      description: "Keep your operating system, browsers, and apps updated to protect against the latest security vulnerabilities.",
      category: "System Security"
    },
    {
      title: "Phishing Awareness",
      description: "Be cautious of unexpected emails. Check sender addresses carefully and never click suspicious links.",
      category: "Email Security"
    },
    {
      title: "Public Wi-Fi Safety",
      description: "Use a VPN when connecting to public Wi-Fi networks to encrypt your traffic and protect your data.",
      category: "Network Security"
    },
    {
      title: "Regular Backups",
      description: "Maintain regular backups of important data using the 3-2-1 rule: 3 copies, 2 different media types, 1 offsite.",
      category: "Data Protection"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % tips.length);
      }, 5000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, tips.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
    setIsAutoPlaying(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <LightbulbIcon className="w-8 h-8 text-yellow-400" />
        <h2 className="text-3xl font-bold">Daily Security Tips</h2>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="overflow-hidden rounded-xl bg-gray-800 border border-gray-700">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 p-8"
                  style={{ minWidth: '100%' }}
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="inline-block px-4 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 mb-6">
                      {tip.category}
                    </span>
                    <h3 className="text-2xl font-semibold mb-4">{tip.title}</h3>
                    <p className="text-gray-400 text-lg max-w-2xl">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/90 hover:bg-gray-700 p-2 rounded-full border border-gray-700 transition-colors"
            aria-label="Previous tip"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/90 hover:bg-gray-700 p-2 rounded-full border border-gray-700 transition-colors"
            aria-label="Next tip"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-yellow-400' : 'bg-gray-700'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityTips;