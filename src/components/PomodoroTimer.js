import React, { useState, useEffect } from 'react';
import { Bell, Coffee, PlayCircle, PauseCircle, RotateCcw, Settings } from 'lucide-react';

const PomodoroTimer = () => {
  // Timer states
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [cycle, setCycle] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    cycles: 4
  });

  // Sound effect for timer completion
  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABMYXZjNTguMTMuMTAwAGRhdGFEBgAApHtwdnV5fYKBf314dHRyc3N5f4OIiYmHhYOAfXp4eHl8foGFh4iJiIaEgn57eXh3d3l7foGEhoeHh4WEgYB+fHt6ent9f4GEhYaGhYSDgYB+fHt7e3x+gIKEhYWFhYSEgoF/fXx7e3x+gIKDhISEhISDgoF/fnx8fH1+gIKDhISEhISDgoF/fnx8fH1+gIKDhISEhISDgoF/fn19fX5/gYKDg4ODg4KCgYB/fn19fX5/gYKDg4ODg4KCgYB/fn19fX9/gYKDg4ODg4KCgYB/fn19fX9/gYKDg4ODg4OCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');
    audio.play();
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
    setSettings({
      ...settings,
      [setting]: parseInt(value, 10)
    });
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
      <div className={`w-full max-w-md rounded-xl shadow-xl overflow-hidden ${getBackgroundColor()} text-white transition-all duration-500`}>
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
                <svg className="w-full h-full" viewBox="0 0 100 100">
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
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                
                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{formatTime(time)}</span>
                  <span className="uppercase mt-2 font-medium">
                    {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </span>
                </div>
              </div>
              
              {/* Cycles */}
              <div className="flex space-x-2 mb-4">
                {Array.from({ length: settings.cycles }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < cycle - 1 ? 'bg-white' : 'bg-white bg-opacity-30'}`}
                  ></div>
                ))}
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-8">
                <button
                  onClick={resetTimer}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <RotateCcw size={28} />
                </button>
                
                <button
                  onClick={toggleTimer}
                  className="p-4 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  {isActive ? <PauseCircle size={48} /> : <PlayCircle size={48} />}
                </button>
                
                {mode === 'work' ? (
                  <Coffee size={28} className="p-2" />
                ) : (
                  <Bell size={28} className="p-2" />
                )}
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