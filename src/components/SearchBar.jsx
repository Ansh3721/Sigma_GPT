// src/components/SearchBar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Globe, Paperclip } from 'lucide-react';

// --- Web Speech API Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
}
// --------------------------

export default function SearchBar({ value, onChange, onSubmit, onPickFile }) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US'); // en-US for English, hi-IN for Hindi
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Effect to handle the speech recognition events
  useEffect(() => {
    if (!recognition) return;
    recognition.lang = language;
    const handleResult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (onChange && finalTranscript) {
        onChange(value + finalTranscript); // Append final results
      }
    };
    recognition.addEventListener('result', handleResult);
    return () => recognition.removeEventListener('result', handleResult);
  }, [language, onChange, value]);

  // Effect to handle clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleMicClick = () => {
    if (!recognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isListening) {
        recognition.stop();
        setIsListening(false);
    }
    onSubmit();
  };

  const selectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsLangDropdownOpen(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full shadow-lg flex items-center relative p-2"
    >
      {/* --- Language Dropdown Button --- */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          className="p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Select language"
        >
          <Globe size={20} className="text-neutral-600 dark:text-neutral-300" />
        </button>
        {isLangDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg shadow-xl overflow-hidden">
            <button onClick={() => selectLanguage('en-US')} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">English</button>
            <button onClick={() => selectLanguage('hi-IN')} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700">Hindi</button>
          </div>
        )}
      </div>

      {/* --- Input Field --- */}
      <input
       type="text"
        value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={isListening ? "Listening..." : "Ask Startup.ai anything..."}
         className="flex-1 bg-transparent outline-none px-4 text-base sm:text-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
      />
      
      {/* --- Right-side Buttons --- */}
      <div className="flex items-center space-x-1">
         {/* ADDED THIS BUTTON BACK */}
        <button
            type="button"
            onClick={onPickFile}
            className="p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Upload file"
        >
            <Paperclip size={20} className="text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
            type="button"
            onClick={handleMicClick}
            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
        >
            <Mic size={20} />
        </button>
        <button
          type="submit"
          className="p-3 ml-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400"
          aria-label="Submit query"
          disabled={!value.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}