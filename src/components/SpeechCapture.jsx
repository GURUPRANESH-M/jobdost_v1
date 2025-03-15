import React, { useState } from "react";

const SpeechCapture = () => {
    const [text, setText] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.onstart = () => setProcessing(true);

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            setText(speechText);
            sendToBackend(speechText);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setProcessing(false);
        };

        recognition.onend = () => setProcessing(false);
        recognition.start();
    };

    const sendToBackend = async (speechText) => {
        try {
            const response = await fetch("http://localhost:5002/process_speech", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: speechText }), // Send text, not audio
            });

            const data = await response.json();
            console.log("Processed:", data);
        } catch (error) {
            console.error("Error sending speech:", error);
        }
    };

    return (
        <div>
            <h2>Speak your details (Name, Mobile No, Profession)</h2>
            <button onClick={handleVoiceInput} disabled={processing}>
                {processing ? "Listening..." : "Start Speaking"}
            </button>
            <p>Detected: {text}</p>
        </div>
    );
};

export default SpeechCapture;
