'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function VoiceInput({ onTranscript, disabled }) {
    const [isRecording, setIsRecording] = useState(false);
    const locale = useLocale();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', blob);
                formData.append('language', locale === 'ur' ? 'ur' : 'en');

                try {
                    // Call our server-side proxy instead of the Worker directly.
                    // This avoids CORS — the server forwards the audio to Cloudflare.
                    const response = await fetch('/api/transcribe', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!response.ok) throw new Error('Failed to transcribe audio');
                    
                    const data = await response.json();
                    onTranscript(data.text);
                } catch (err) {
                    console.error("Transcription error:", err);
                    alert("Failed to transcribe audio. Please try again.");
                }
            };

            mediaRecorder.start();
            setIsRecording(true);

            setTimeout(() => {
                if (mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                    setIsRecording(false);
                    stream.getTracks().forEach(track => track.stop());
                }
            }, 10000); // Auto-stop after 10 seconds

        } catch (error) {
            console.error("Recording error:", error);
            setIsRecording(false);
            alert("Please allow microphone access or use Google Chrome.");
        }
    };

    return (
        <button
            type="button"
            onClick={startRecording}
            disabled={disabled || isRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
            {isRecording ? "⏺️ Recording..." : "🎤"}
        </button>
    );
}