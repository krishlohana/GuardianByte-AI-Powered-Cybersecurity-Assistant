import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Play, Pause, RotateCcw, Settings, ChevronUp, ChevronDown, Minimize2, AlertTriangle, Sparkles } from 'lucide-react';

interface VoiceSettings {
  voice: string;
  speed: number;
  volume: number;
  autoRead: boolean;
  useElevenLabs: boolean;
  elevenLabsVoice: string;
}

const VoiceAssistant = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [isSpeechPending, setIsSpeechPending] = useState(false);
  const [isUsingElevenLabs, setIsUsingElevenLabs] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const [settings, setSettings] = useState<VoiceSettings>({
    voice: '',
    speed: 1.0,
    volume: 0.8,
    autoRead: true,
    useElevenLabs: false,
    elevenLabsVoice: 'Rachel'
  });

  // ElevenLabs voice options - carefully selected for maximum distinction
  const elevenLabsVoices = [
    { id: 'Rachel', name: 'Rachel (Professional Female)', description: 'Young, clear, professional female voice' },
    { id: 'Drew', name: 'Drew (Confident Male)', description: 'Young, confident, clear male voice' },
    { id: 'Clyde', name: 'Clyde (Deep Authoritative)', description: 'Middle-aged, deep, authoritative male voice' },
    { id: 'Bella', name: 'Bella (Soft Female)', description: 'Young, soft, friendly female voice' },
    { id: 'Antoni', name: 'Antoni (Warm Male)', description: 'Young, warm, well-rounded male voice' }
  ];

  // Determine if text should use ElevenLabs (important announcements)
  const shouldUseElevenLabs = (text: string): boolean => {
    if (!settings.useElevenLabs) return false;
    
    const importantKeywords = [
      'critical alert', 'security alert', 'threat level', 'ransomware', 'breach',
      'urgent', 'immediate action', 'high priority', 'emergency', 'warning',
      'phishing campaign', 'malware detected', 'vulnerability', 'attack detected',
      'critical security', 'high priority', 'threat update', 'security warning'
    ];
    
    const lowerText = text.toLowerCase();
    return importantKeywords.some(keyword => lowerText.includes(keyword));
  };

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && !voice.name.includes('Google')
      );
      setAvailableVoices(englishVoices);
      
      // Set default voice if none selected
      if (!settings.voice && englishVoices.length > 0) {
        const preferredVoice = englishVoices.find(voice => 
          voice.name.includes('Microsoft') || 
          voice.name.includes('Samantha') ||
          voice.name.includes('Alex')
        ) || englishVoices[0];
        
        setSettings(prev => ({ ...prev, voice: preferredVoice.name }));
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
        setMicrophoneError(null);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        
        switch (event.error) {
          case 'not-allowed':
            setMicrophoneError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
            break;
          case 'no-speech':
            setMicrophoneError('No speech detected. Please try speaking again.');
            break;
          case 'audio-capture':
            setMicrophoneError('No microphone found. Please check your microphone connection.');
            break;
          case 'network':
            setMicrophoneError('Network error occurred. Please check your internet connection.');
            break;
          case 'service-not-allowed':
            setMicrophoneError('Speech recognition service not allowed. Please check your browser settings.');
            break;
          default:
            setMicrophoneError(`Speech recognition error: ${event.error}`);
        }
        
        console.warn('Speech recognition error:', event.error);
      };
    } else {
      setSpeechRecognitionSupported(false);
      setMicrophoneError('Speech recognition is not supported in this browser.');
    }
  }, []);

  // ElevenLabs TTS function with better voice handling
  const speakWithElevenLabs = async (text: string) => {
    if (isMuted) return;
    
    setIsLoading(true);
    setIsUsingElevenLabs(true);
    setIsSpeechPending(true);
    
    try {
      console.log(`🎤 ElevenLabs TTS Request:`);
      console.log(`   Voice: ${settings.elevenLabsVoice}`);
      console.log(`   Text: "${text.substring(0, 50)}..."`);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          text: text,
          voice_id: settings.elevenLabsVoice,
          model_id: 'eleven_monolingual_v1'
          // Let the server use optimized voice settings
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log(`✅ ElevenLabs audio generated successfully (${audioBlob.size} bytes)`);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = settings.volume;
        
        audioRef.current.onloadeddata = () => {
          setIsSpeechPending(false);
          setIsPlaying(true);
          setIsPaused(false);
          audioRef.current?.play().catch(console.error);
        };
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setIsUsingElevenLabs(false);
          URL.revokeObjectURL(audioUrl);
          processNextInQueue();
        };
        
        audioRef.current.onerror = () => {
          setIsSpeechPending(false);
          setIsPlaying(false);
          setIsPaused(false);
          setIsUsingElevenLabs(false);
          URL.revokeObjectURL(audioUrl);
          console.error('❌ Audio playback error, falling back to Web Speech API');
          speakWithWebAPI(text);
        };
      }
    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error);
      setIsSpeechPending(false);
      setIsUsingElevenLabs(false);
      // Always fallback to Web Speech API
      console.log('🔄 Falling back to Web Speech API');
      speakWithWebAPI(text);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API with proper settings application
  const speakWithWebAPI = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      if (isSpeechPending && !isUsingElevenLabs) {
        return;
      }

      speechSynthesis.cancel();
      setCurrentUtterance(null);
      setIsSpeechPending(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = settings.speed;
      utterance.volume = settings.volume;
      utterance.pitch = 1.0;
      
      if (settings.voice) {
        const selectedVoice = availableVoices.find(voice => voice.name === settings.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeechPending(false);
        setIsPlaying(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsSpeechPending(false);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentUtterance(null);
        processNextInQueue();
      };
      
      utterance.onerror = (event) => {
        setIsSpeechPending(false);
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event);
        }
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentUtterance(null);
        processNextInQueue();
      };

      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    }
  };

  // Main speak function with hybrid logic
  const speak = async (text: string) => {
    if (isMuted || (isSpeechPending && !isUsingElevenLabs)) return;
    
    setCurrentText(text);
    
    // Decide which TTS to use
    if (shouldUseElevenLabs(text)) {
      console.log('🚨 Using ElevenLabs for important announcement');
      await speakWithElevenLabs(text);
    } else {
      console.log('💬 Using Web Speech API for general text');
      speakWithWebAPI(text);
    }
  };

  // Process audio queue
  const processNextInQueue = () => {
    if (audioQueue.length > 0 && !isMuted && !isSpeechPending) {
      const nextText = audioQueue[0];
      setAudioQueue(prev => prev.slice(1));
      speak(nextText);
    }
  };

  // Add to queue
  const addToQueue = (text: string) => {
    if ((isPlaying || isSpeechPending) && !isPaused) {
      setAudioQueue(prev => [...prev, text]);
    } else {
      speak(text);
    }
  };

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    event?.preventDefault?.();
    
    const lowerCommand = command.toLowerCase();
    
    try {
      if (lowerCommand.includes('read alerts') || lowerCommand.includes('security alerts')) {
        const alertText = 'CRITICAL SECURITY ALERT: A new ransomware campaign has been detected targeting healthcare institutions. Immediate action required. Please ensure your systems are updated and backups are current.';
        addToQueue(alertText);
      } else if (lowerCommand.includes('security tips') || lowerCommand.includes('tips')) {
        const tipsText = 'Here are today\'s security tips: Use strong, unique passwords for each account. Enable two-factor authentication on all important services. Keep your software updated. Be cautious with email links and attachments.';
        addToQueue(tipsText);
      } else if (lowerCommand.includes('threat level') || lowerCommand.includes('current threats')) {
        const threatText = 'HIGH PRIORITY THREAT UPDATE: Current threat level is elevated. We are monitoring 47 active threats globally, including 12 critical incidents. The most significant threats are ransomware attacks and phishing campaigns.';
        addToQueue(threatText);
      } else if (lowerCommand.includes('stop') || lowerCommand.includes('pause')) {
        pauseSpeaking();
      } else if (lowerCommand.includes('help')) {
        const helpText = 'I can read cybersecurity alerts, provide security tips, give threat updates, and answer security questions. Try saying "read alerts", "security tips", or "current threats".';
        addToQueue(helpText);
      } else {
        const defaultText = 'I didn\'t understand that command. Try saying "read alerts", "security tips", "current threats", or "help" for available commands.';
        addToQueue(defaultText);
      }
    } catch (error) {
      console.error('Error handling voice command:', error);
    }
  };

  // Improved pause functionality
  const pauseSpeaking = () => {
    if (isUsingElevenLabs && audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  // Improved resume functionality
  const resumeSpeaking = () => {
    if (isUsingElevenLabs && audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPaused(false);
      setIsPlaying(true);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else if (currentText && !isPlaying && !isSpeechPending) {
      speak(currentText);
    }
  };

  // Control functions
  const togglePlay = () => {
    if (isPlaying) {
      pauseSpeaking();
    } else if (isPaused) {
      resumeSpeaking();
    } else if (currentText) {
      speak(currentText);
    } else {
      speak('Voice assistant is ready. Use voice commands or quick actions to get started.');
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    speechSynthesis.cancel();
    
    setIsSpeechPending(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
    setAudioQueue([]);
    setIsUsingElevenLabs(false);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      stopSpeaking();
    }
  };

  const toggleListening = () => {
    if (!speechRecognitionSupported) {
      setMicrophoneError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        setMicrophoneError(null);
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        setMicrophoneError('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const dismissError = () => {
    setMicrophoneError(null);
  };

  const readSecurityTip = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const tips = [
      'Use a password manager to generate and store unique passwords for each account.',
      'Enable two-factor authentication on all your important accounts, especially email and banking.',
      'Keep your operating system and software updated with the latest security patches.',
      'Be cautious when clicking links in emails, even from people you know.',
      'Use a VPN when connecting to public Wi-Fi networks.',
      'Regularly backup your important data using the 3-2-1 backup strategy.'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    addToQueue(`Security tip: ${randomTip}`);
  };

  const readLatestAlert = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const alerts = [
      'CRITICAL SECURITY ALERT: New ransomware variant detected targeting Windows systems. Ensure your antivirus is updated immediately.',
      'HIGH PRIORITY ALERT: Phishing campaign impersonating major banks is currently active. Verify all banking communications through official channels.',
      'URGENT SECURITY NOTICE: Zero-day vulnerability discovered in popular web browsers. Update immediately to protect your system.',
      'THREAT ALERT: Cryptocurrency scams are increasing on social media platforms. Be vigilant and verify all investment opportunities.',
      'SECURITY WARNING: Business email compromise attacks are targeting small businesses. Verify all financial requests through alternative channels.'
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    addToQueue(randomAlert);
  };

  const readThreatUpdate = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    addToQueue('THREAT LEVEL UPDATE: Current threat level is elevated. We are monitoring multiple active threats globally. Stay vigilant and follow security best practices.');
  };

  // Test voice settings with different voices
  const testVoice = () => {
    const testTexts = {
      'Rachel': 'SECURITY TEST: This is Rachel speaking. I provide clear, professional security announcements.',
      'Drew': 'SECURITY TEST: This is Drew speaking. I deliver confident security updates.',
      'Clyde': 'SECURITY TEST: This is Clyde speaking. I provide authoritative security briefings.',
      'Bella': 'SECURITY TEST: This is Bella speaking. I offer friendly security guidance.',
      'Antoni': 'SECURITY TEST: This is Antoni speaking. I provide warm security assistance.'
    };
    
    const testText = settings.useElevenLabs 
      ? (testTexts[settings.elevenLabsVoice as keyof typeof testTexts] || testTexts['Rachel'])
      : 'This is a test of the Web Speech API voice settings. The speed and volume should reflect your current settings.';
    
    addToQueue(testText);
  };

  // Auto-read functionality for new content
  useEffect(() => {
    if (settings.autoRead) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.classList.contains('security-alert') || 
                    element.classList.contains('threat-notification')) {
                  const text = element.textContent;
                  if (text) {
                    addToQueue(`SECURITY ALERT: ${text}`);
                  }
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    }
  }, [settings.autoRead]);

  // If minimized, show only a small floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMinimized(false);
          }}
          className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
          title="Open Voice Assistant"
        >
          <Volume2 className="w-6 h-6 text-white" />
          {(isPlaying || isPaused || isSpeechPending) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
          {isUsingElevenLabs && (
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-20">
      {/* Error Message */}
      {microphoneError && (
        <div className="absolute bottom-20 right-0 bg-red-900/90 border border-red-700 rounded-xl p-4 w-80 shadow-2xl mb-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-300 mb-1">Microphone Error</h4>
              <p className="text-sm text-red-200 mb-3">{microphoneError}</p>
              {microphoneError.includes('denied') && (
                <div className="text-xs text-red-300 bg-red-800/50 rounded-lg p-2 mb-3">
                  <strong>How to fix:</strong>
                  <br />1. Look for a microphone icon in your browser's address bar
                  <br />2. Click it and select "Allow" for microphone access
                  <br />3. Refresh the page if needed
                </div>
              )}
              <button
                onClick={dismissError}
                className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute bottom-20 right-0 bg-gray-800 border border-gray-700 rounded-xl p-4 w-80 shadow-2xl mb-2">
          <h3 className="text-lg font-semibold mb-3">Voice Settings</h3>
          
          <div className="space-y-3">
            {/* Hybrid Mode Toggle */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">AI Voice Enhancement</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useElevenLabs"
                  checked={settings.useElevenLabs}
                  onChange={(e) => setSettings(prev => ({ ...prev, useElevenLabs: e.target.checked }))}
                  className="rounded border-gray-700 bg-gray-900 text-purple-500"
                />
                <label htmlFor="useElevenLabs" className="text-sm text-purple-200">
                  Use ElevenLabs AI for security alerts
                </label>
              </div>
              <p className="text-xs text-purple-400 mt-1">
                High-quality AI voice for important announcements
              </p>
            </div>

            {/* ElevenLabs Voice Selection */}
            {settings.useElevenLabs && (
              <div>
                <label className="block text-sm font-medium mb-1">ElevenLabs Voice</label>
                <select
                  value={settings.elevenLabsVoice}
                  onChange={(e) => setSettings(prev => ({ ...prev, elevenLabsVoice: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm"
                >
                  {elevenLabsVoices.map(voice => (
                    <option key={voice.id} value={voice.id} title={voice.description}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {elevenLabsVoices.find(v => v.id === settings.elevenLabsVoice)?.description}
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Web Speech Voice</label>
              <select
                value={settings.voice}
                onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm"
              >
                <option value="">Default Voice</option>
                {availableVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Speed: {settings.speed}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speed}
                onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Volume: {Math.round(settings.volume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRead"
                checked={settings.autoRead}
                onChange={(e) => setSettings(prev => ({ ...prev, autoRead: e.target.checked }))}
                className="rounded border-gray-700 bg-gray-900 text-blue-500"
              />
              <label htmlFor="autoRead" className="text-sm">Auto-read alerts</label>
            </div>

            {/* Test Voice Button */}
            <button
              onClick={testVoice}
              className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition"
            >
              Test Voice Settings
            </button>
          </div>
        </div>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 bg-gray-800 border border-gray-700 rounded-xl p-4 w-80 shadow-2xl mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="text-gray-400 hover:text-white transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={readLatestAlert}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition text-left flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              🚨 Read Critical Security Alert
            </button>
            <button
              onClick={readSecurityTip}
              className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition text-left"
            >
              💡 Get Security Tip
            </button>
            <button
              onClick={readThreatUpdate}
              className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition text-left flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              📊 Threat Level Update
            </button>
          </div>

          {/* Queue indicator */}
          {audioQueue.length > 0 && (
            <div className="mt-3 text-xs text-gray-400 text-center bg-gray-900 rounded-lg p-2">
              {audioQueue.length} item(s) queued
            </div>
          )}
        </div>
      )}

      {/* Main Compact Control Panel */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg relative">
              <Volume2 className="w-4 h-4 text-blue-400" />
              {isUsingElevenLabs && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-1">
                Voice Assistant
                {settings.useElevenLabs && (
                  <Sparkles className="w-3 h-3 text-purple-400" title="ElevenLabs AI Enhanced" />
                )}
              </h3>
              <p className="text-xs text-gray-400">
                {isLoading ? 'Loading AI voice...' : 
                 isMuted ? 'Muted' :
                 isSpeechPending ? 'Starting...' :
                 isPlaying ? (isUsingElevenLabs ? `AI Speaking (${settings.elevenLabsVoice})...` : 'Speaking...') : 
                 isPaused ? 'Paused' : 'Ready'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition"
              title="Quick Actions"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="p-1.5 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition"
              title="Minimize"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Compact Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePlay();
              }}
              className={`p-2 rounded-lg transition ${
                isPlaying ? 'bg-yellow-500/20 text-yellow-400' : 
                isPaused ? 'bg-green-500/20 text-green-400' :
                'bg-green-500/20 text-green-400'
              }`}
              title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
              disabled={isMuted || (isSpeechPending && !isUsingElevenLabs)}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopSpeaking();
              }}
              className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition"
              title="Stop"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMute();
              }}
              className={`p-2 rounded-lg transition ${
                isMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleListening();
              }}
              className={`p-2 rounded-lg transition ${
                isListening ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 
                microphoneError ? 'bg-red-500/20 text-red-400' :
                'bg-gray-700 text-gray-400'
              }`}
              title={
                !speechRecognitionSupported ? 'Speech recognition not supported' :
                microphoneError ? 'Microphone error - click for details' :
                isListening ? 'Stop listening' : 'Start voice commands'
              }
              disabled={isMuted || !speechRecognitionSupported}
            >
              {isListening ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition"
              title="Settings"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden audio element for ElevenLabs playback */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          processNextInQueue();
        }}
        onError={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default VoiceAssistant;