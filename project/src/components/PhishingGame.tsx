import React, { useState, useEffect } from 'react';
import { Mail, Shield, Trophy, AlertTriangle, CheckCircle2, XCircle, Timer, Brain } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  sender: string;
  content: string;
  isPhishing: boolean;
  telltales: string[];
}

const PhishingGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('phishingGameHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const emails: Email[] = [
    {
      id: '1',
      subject: 'Urgent: Your Account Security',
      sender: 'security@bankofamerica.com.secure-verify.com',
      content: 'Dear valued customer, Your account has been temporarily suspended. Click here to verify your identity and restore access.',
      isPhishing: true,
      telltales: [
        'Suspicious sender domain',
        'Creates urgency',
        'Generic greeting',
        'Asks for immediate action'
      ]
    },
    {
      id: '2',
      subject: 'Invoice #INV-2024-03-15',
      sender: 'billing@dropbox.com',
      content: 'Your Dropbox Business invoice for March 2024 is now available. View your invoice in your billing settings.',
      isPhishing: false,
      telltales: [
        'Legitimate sender domain',
        'Expected business communication',
        'No urgent action required',
        'Directs to account settings'
      ]
    },
    {
      id: '3',
      subject: 'You\'ve Won an iPhone 15 Pro!',
      sender: 'prizes@lucky-winner.net',
      content: 'Congratulations! You\'ve been randomly selected to receive a free iPhone 15 Pro. Click here to claim your prize within 24 hours!',
      isPhishing: true,
      telltales: [
        'Too good to be true offer',
        'Unknown sender domain',
        'Creates urgency with deadline',
        'Free high-value item'
      ]
    },
    {
      id: '4',
      subject: 'Calendar: Team Meeting Tomorrow',
      sender: 'calendar-noreply@google.com',
      content: 'A new event has been added to your calendar: Q1 Planning Meeting, Tomorrow at 10:00 AM EST',
      isPhishing: false,
      telltales: [
        'Legitimate Google domain',
        'Expected calendar notification',
        'Specific meeting details',
        'No suspicious links'
      ]
    },
    {
      id: '5',
      subject: 'HR: Update Your Direct Deposit Info',
      sender: 'hr.payroll@company-verify.org',
      content: 'Due to a system upgrade, all employees must verify their direct deposit information. Click here to update your banking details.',
      isPhishing: true,
      telltales: [
        'Suspicious HR domain',
        'Requests sensitive banking info',
        'System upgrade excuse',
        'Unusual process change'
      ]
    }
  ];

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setCurrentLevel(1);
    selectNewEmail();
  };

  const selectNewEmail = () => {
    const randomEmail = emails[Math.floor(Math.random() * emails.length)];
    setCurrentEmail(randomEmail);
    setShowFeedback(false);
    setLastAnswer(null);
  };

  const handleAnswer = (isPhishingGuess: boolean) => {
    if (!currentEmail || showFeedback) return;

    const correct = isPhishingGuess === currentEmail.isPhishing;
    setLastAnswer(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prev) => prev + 100);
    }

    setTimeout(() => {
      if (currentLevel < 5) {
        setCurrentLevel((prev) => prev + 1);
        selectNewEmail();
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('phishingGameHighScore', score.toString());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted || gameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-xl border border-gray-700">
        <Shield className="w-16 h-16 text-blue-400 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Hack Me If You Can!</h2>
        <p className="text-gray-400 text-center max-w-md mb-8">
          Test your phishing detection skills! Analyze emails and identify which ones are legitimate and which are phishing attempts.
        </p>
        
        {gameOver && (
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">{score} points</div>
            <div className="text-gray-400">High Score: {highScore}</div>
            {score === highScore && score > 0 && (
              <div className="flex items-center justify-center gap-2 text-yellow-400 mt-2">
                <Trophy className="w-5 h-5" />
                <span>New High Score!</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <Brain className="w-5 h-5" />
          {gameOver ? 'Play Again' : 'Start Game'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">{score}</span>
          </div>
          <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span>Level {currentLevel}/5</span>
          </div>
        </div>
        <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2">
          <Timer className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Email Display */}
      {currentEmail && (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{currentEmail.subject}</h3>
              <div className="text-gray-400">From: {currentEmail.sender}</div>
            </div>
            <Mail className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-300 border-t border-gray-700 pt-4">{currentEmail.content}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer(false)}
          className={`p-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            showFeedback
              ? currentEmail?.isPhishing
                ? 'bg-red-500/20 text-red-400'
                : 'bg-green-500/20 text-green-400'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          disabled={showFeedback}
        >
          <CheckCircle2 className="w-5 h-5" />
          Legitimate
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className={`p-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            showFeedback
              ? currentEmail?.isPhishing
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          disabled={showFeedback}
        >
          <AlertTriangle className="w-5 h-5" />
          Phishing
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && currentEmail && (
        <div className={`mt-6 p-4 rounded-lg ${
          lastAnswer ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          <div className="font-semibold mb-2 flex items-center gap-2">
            {lastAnswer ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Incorrect!</span>
              </>
            )}
          </div>
          <div className="text-gray-300">
            <p className="mb-2">Key indicators:</p>
            <ul className="list-disc list-inside space-y-1">
              {currentEmail.telltales.map((telltale, index) => (
                <li key={index} className="text-sm">{telltale}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhishingGame;