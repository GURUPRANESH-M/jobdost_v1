import React, { useState, useEffect } from "react";
import SpeechCapture from "./components/SpeechCapture";
import "./styles.css";

const App = () => {
    const [speechText, setSpeechText] = useState("");

    useEffect(() => {
        document.title = "JobDost - Worker Registration"; 
    }, []);

    const handleSpeechResult = (text) => {
        setSpeechText(text);
    };

    return (
        <div>
            <h1>VOICE-BASED WORKER REGISTRATION MODULE</h1>
            <SpeechCapture onSpeechResult={handleSpeechResult} />
        </div>
    );
};

export default App;
