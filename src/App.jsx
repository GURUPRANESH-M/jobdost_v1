import React, { useState } from "react";
import SpeechCapture from "./components/SpeechCapture";
import "./styles.css"

const App = () => {
    const [speechText, setSpeechText] = useState("");

    const handleSpeechResult = (text) => {
        setSpeechText(text);
    };

    return (
        <div>
            <h1>JobDost - Voice Input</h1>
            <SpeechCapture onSpeechResult={handleSpeechResult} />
        </div>
    );
};

export default App;
