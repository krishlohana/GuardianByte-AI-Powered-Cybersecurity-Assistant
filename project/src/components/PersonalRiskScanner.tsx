import React, { useState, useEffect } from 'react';
import { ShieldAlert, ChevronRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  category: string;
  weight: number;
}

interface Answer {
  questionId: string;
  value: boolean;
}

const PersonalRiskScanner = () => {
  const questions: Question[] = [
    {
      id: 'passwords',
      text: 'Do you use the same password for multiple accounts?',
      category: 'Authentication',
      weight: 10
    },
    {
      id: 'mfa',
      text: 'Have you enabled two-factor authentication on your important accounts?',
      category: 'Authentication',
      weight: 8
    },
    {
      id: 'updates',
      text: 'Do you postpone software updates for more than a week?',
      category: 'System Security',
      weight: 7
    },
    {
      id: 'links',
      text: 'Do you click on links in emails without verifying the sender?',
      category: 'Email Security',
      weight: 9
    },
    {
      id: 'public_wifi',
      text: 'Do you connect to public Wi-Fi without using a VPN?',
      category: 'Network Security',
      weight: 6
    },
    {
      id: 'backups',
      text: 'Do you regularly backup your important data?',
      category: 'Data Protection',
      weight: 8
    },
    {
      id: 'antivirus',
      text: 'Is your antivirus software up to date and actively running?',
      category: 'System Security',
      weight: 7
    },
    {
      id: 'sharing',
      text: 'Do you share personal information on social media?',
      category: 'Privacy',
      weight: 6
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    const handleStartScan = () => {
      setAutoStart(true);
      resetQuiz();
    };

    const element = document.getElementById('risk-scanner');
    if (element) {
      element.addEventListener('startScan', handleStartScan);
      return () => element.removeEventListener('startScan', handleStartScan);
    }
  }, []);

  const handleAnswer = (value: boolean) => {
    setAnswers([...answers, { questionId: questions[currentQuestion].id, value }]);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setAutoStart(false);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      maxScore += question.weight;

      // For positive questions (where "Yes" is good)
      if (['mfa', 'backups', 'antivirus'].includes(question.id)) {
        if (answer.value) totalScore += question.weight;
      }
      // For negative questions (where "No" is good)
      else {
        if (!answer.value) totalScore += question.weight;
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const getRecommendations = () => {
    const recommendations = [];

    // Check password habits
    if (answers.find(a => a.questionId === 'passwords')?.value) {
      recommendations.push({
        title: 'Password Security',
        description: 'Use a password manager to create and store unique passwords for each account.',
        severity: 'high'
      });
    }

    // Check MFA usage
    if (!answers.find(a => a.questionId === 'mfa')?.value) {
      recommendations.push({
        title: 'Two-Factor Authentication',
        description: 'Enable 2FA on all important accounts, especially email and financial services.',
        severity: 'high'
      });
    }

    // Check update habits
    if (answers.find(a => a.questionId === 'updates')?.value) {
      recommendations.push({
        title: 'Software Updates',
        description: 'Install security updates promptly to protect against known vulnerabilities.',
        severity: 'medium'
      });
    }

    // Check email security
    if (answers.find(a => a.questionId === 'links')?.value) {
      recommendations.push({
        title: 'Email Safety',
        description: 'Always verify sender addresses and hover over links before clicking.',
        severity: 'high'
      });
    }

    // Check VPN usage
    if (answers.find(a => a.questionId === 'public_wifi')?.value) {
      recommendations.push({
        title: 'Network Protection',
        description: 'Use a VPN when connecting to public Wi-Fi networks.',
        severity: 'medium'
      });
    }

    // Check backup practices
    if (!answers.find(a => a.questionId === 'backups')?.value) {
      recommendations.push({
        title: 'Data Backups',
        description: 'Implement regular backups of important data using the 3-2-1 backup strategy.',
        severity: 'medium'
      });
    }

    return recommendations;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  useEffect(() => {
    if (autoStart) {
      const element = document.querySelector('.question-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [autoStart, currentQuestion]);

  if (showResults) {
    const score = calculateScore();
    const recommendations = getRecommendations();

    return (
      <div>
        <div className="flex items-center gap-4 mb-12">
          <ShieldAlert className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold">Your Cyber Hygiene Score</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Score Display */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={`${
                      score >= 80 ? 'text-green-400' :
                      score >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${score * 3.64} 364`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                  {score}%
                </span>
              </div>
            </div>
            <p className="text-center text-xl mb-4">
              {score >= 80 ? 'Excellent Security Practices!' :
               score >= 60 ? 'Good, but Room for Improvement' :
               'Significant Security Risks Detected'}
            </p>
            <p className="text-center text-gray-400">
              Based on your responses, we've identified the following areas for improvement:
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-4 mb-8">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    rec.severity === 'high' ? 'bg-red-500/20' :
                    rec.severity === 'medium' ? 'bg-yellow-500/20' :
                    'bg-green-500/20'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      rec.severity === 'high' ? 'text-red-400' :
                      rec.severity === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{rec.title}</h3>
                    <p className="text-gray-400">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetQuiz}
            className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <ShieldAlert className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold">Personal Risk Assessment</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 question-container">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 mb-4">
              {questions[currentQuestion].category}
            </span>
            <h3 className="text-2xl font-semibold">
              {questions[currentQuestion].text}
            </h3>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-gray-900 hover:bg-gray-700 px-6 py-4 rounded-lg font-semibold transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Yes</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-gray-900 hover:bg-gray-700 px-6 py-4 rounded-lg font-semibold transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <span>No</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalRiskScanner;