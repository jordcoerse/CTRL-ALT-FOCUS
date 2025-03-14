import React, { useState, useEffect } from 'react';
import { Bell, Coffee, PlayCircle, PauseCircle, RotateCcw, Settings } from 'lucide-react';

const PomodoroTimer = () => {
  // Timer states
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [cycle, setCycle] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    cycles: 4,
    soundEnabled: true,
    soundType: 'ping' // 'ping', 'ding', or 'sonar'
  });

  // Sound effect for timer completion
  const playSound = () => {
    if (!settings.soundEnabled) return;
    
    const soundFiles = {
      ping: './sound-ping-43757.mp3',
      ding: './sound-din-ding-89718.mp3',
      sonar: './sound-sonar-ping-290188.mp3'
    };

    const audio = new Audio(soundFiles[settings.soundType]);
    audio.volume = 1.0; // Ensure volume is at maximum
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  // Test sound function
  const testSound = () => {
    playSound();
  };

  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            playSound();
            setIsFlashing(true);
            
            // Stop flashing after 2 seconds
            setTimeout(() => {
              setIsFlashing(false);
            }, 2000);
            
            // Cycle logic
            if (mode === 'work') {
              if (cycle >= settings.cycles) {
                setMode('longBreak');
                setTime(settings.longBreakTime * 60);
                setCycle(1);
              } else {
                setMode('shortBreak');
                setTime(settings.shortBreakTime * 60);
                setCycle((prevCycle) => prevCycle + 1);
              }
            } else {
              setMode('work');
              setTime(settings.workTime * 60);
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, time, mode, cycle, settings]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setTime(settings.workTime * 60);
    } else if (mode === 'shortBreak') {
      setTime(settings.shortBreakTime * 60);
    } else {
      setTime(settings.longBreakTime * 60);
    }
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Change timer mode
  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    
    if (newMode === 'work') {
      setTime(settings.workTime * 60);
    } else if (newMode === 'shortBreak') {
      setTime(settings.shortBreakTime * 60);
    } else {
      setTime(settings.longBreakTime * 60);
    }
  };

  // Update settings
  const handleSettingChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: setting === 'soundEnabled' 
        ? value // boolean value for checkbox
        : setting === 'soundType'
          ? value // string value for sound type
          : parseInt(value, 10) // numeric value for other settings
    }));
  };

  // Apply settings
  const applySettings = () => {
    resetTimer();
    setShowSettings(false);
  };

  // Get background color based on mode
  const getBackgroundColor = () => {
    if (mode === 'work') return 'bg-red-600';
    if (mode === 'shortBreak') return 'bg-green-600';
    return 'bg-blue-600';
  };

  // Get progress percentage
  const getProgress = () => {
    let totalTime;
    if (mode === 'work') totalTime = settings.workTime * 60;
    else if (mode === 'shortBreak') totalTime = settings.shortBreakTime * 60;
    else totalTime = settings.longBreakTime * 60;
    
    return ((totalTime - time) / totalTime) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-xl overflow-hidden ${getBackgroundColor()} text-white transition-all duration-500 ${isFlashing ? 'animate-flash' : ''}`}>
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CTRL+ALT+FOCUS</h1>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings ? (
          <div className="bg-white text-gray-800 p-6 rounded-t-xl">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Work Time (minutes)</label>
                <input
                  type="number"
                  value={settings.workTime}
                  onChange={(e) => handleSettingChange('workTime', e.target.value)}
                  min="1"
                  max="60"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Short Break (minutes)</label>
                <input
                  type="number"
                  value={settings.shortBreakTime}
                  onChange={(e) => handleSettingChange('shortBreakTime', e.target.value)}
                  min="1"
                  max="30"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Long Break (minutes)</label>
                <input
                  type="number"
                  value={settings.longBreakTime}
                  onChange={(e) => handleSettingChange('longBreakTime', e.target.value)}
                  min="5"
                  max="60"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cycles before Long Break</label>
                <input
                  type="number"
                  value={settings.cycles}
                  onChange={(e) => handleSettingChange('cycles', e.target.value)}
                  min="1"
                  max="10"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2">
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Enable Sound Notifications</span>
                  </label>
                  
                  {settings.soundEnabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Sound Type</label>
                        <select
                          value={settings.soundType}
                          onChange={(e) => handleSettingChange('soundType', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="ping">Ping</option>
                          <option value="ding">Ding</option>
                          <option value="sonar">Sonar</option>
                        </select>
                      </div>
                      <button
                        onClick={testSound}
                        className="w-full p-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                      >
                        Test Sound
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={applySettings}
              className="w-full p-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Settings
            </button>
          </div>
        ) : (
          <>
            {/* Mode Selector */}
            <div className="flex justify-center space-x-2 bg-white bg-opacity-10 p-3">
              <button
                onClick={() => changeMode('work')}
                className={`px-4 py-2 rounded-lg transition-colors ${mode === 'work' ? 'bg-white text-red-600 font-bold' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
              >
                Focus
              </button>
              <button
                onClick={() => changeMode('shortBreak')}
                className={`px-4 py-2 rounded-lg transition-colors ${mode === 'shortBreak' ? 'bg-white text-green-600 font-bold' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
              >
                Short Break
              </button>
              <button
                onClick={() => changeMode('longBreak')}
                className={`px-4 py-2 rounded-lg transition-colors ${mode === 'longBreak' ? 'bg-white text-blue-600 font-bold' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
              >
                Long Break
              </button>
            </div>
            
            {/* Timer Display */}
            <div className="p-8 flex flex-col items-center">
              <div className="relative w-64 h-64 mb-8">
                {/* Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * getProgress()) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold tracking-tight">{formatTime(time)}</span>
                  <span className="uppercase mt-2 font-medium text-sm tracking-wider">
                    {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </span>
                </div>
              </div>
              
              {/* Cycles */}
              <div className="flex justify-center space-x-2 mb-8">
                {Array.from({ length: settings.cycles }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < cycle - 1 ? 'bg-white' : 'bg-white bg-opacity-30'}`}
                  ></div>
                ))}
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center space-x-12">
                <button
                  onClick={resetTimer}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <RotateCcw size={24} />
                </button>
                
                <button
                  onClick={toggleTimer}
                  className="p-4 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors flex items-center justify-center w-16 h-16"
                >
                  {isActive ? <PauseCircle size={40} /> : <PlayCircle size={40} />}
                </button>
                
                <div className="p-2">
                  {mode === 'work' ? (
                    <Coffee size={24} />
                  ) : (
                    <Bell size={24} />
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-white bg-opacity-10 p-4 text-center">
              <p className="text-sm">
                <span className="font-medium">Current Mode:</span> {mode === 'work' ? `Focus (${settings.workTime}m)` : mode === 'shortBreak' ? `Short Break (${settings.shortBreakTime}m)` : `Long Break (${settings.longBreakTime}m)`}
              </p>
              <p className="text-xs mt-1 text-white text-opacity-80">
                Complete {settings.cycles} focus sessions for a long break
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;