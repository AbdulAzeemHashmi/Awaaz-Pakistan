'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function VoiceInput({ onTranscript, disabled }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);
    const locale = useLocale();
    const t = useTranslations();

    useEffect(() => {
        const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
        if (!SpeechRecognition) {
            setIsSupported(false);
        }
    }, []);

    const toggleRecording = () => {
        const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
        
        if (!SpeechRecognition) {
            alert("Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Apple Safari.");
            return;
        }

        if (isRecording) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = locale === 'ur' ? 'ur-PK' : 'en-US';

            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onresult = (event) => {
                let currentText = '';
                for (let i = 0; i < event.results.length; i++) {
                    currentText += event.results[i][0].transcript;
                }
                if (currentText) {
                    onTranscript(currentText);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsRecording(false);
                if (event.error === 'not-allowed') {
                    alert("Microphone access denied. Please allow microphone permission in your browser.");
                } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    alert(`Speech recognition error: ${event.error}`);
                }
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } catch (error) {
            console.error("Failed to start speech recognition:", error);
            setIsRecording(false);
        }
    };

    return (
        <button
            type="button"
            onClick={toggleRecording}
            disabled={disabled || !isSupported}
            title={!isSupported ? "Voice input is not supported in this browser" : (isRecording ? t('voice_input_stop') : t('voice_input'))}
            className={`px-4 py-2 text-white font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                isRecording 
                    ? "bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/50" 
                    : "bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
        >
            {isRecording ? (
                <>
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                    <span>{t('voice_input_stop')}</span>
                </>
            ) : (
                <>
                    <span>🎤</span>
                    <span className="hidden sm:inline">{t('voice_input')}</span>
                </>
            )}
        </button>
    );
}