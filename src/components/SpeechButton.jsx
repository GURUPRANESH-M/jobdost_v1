import { useState } from "react";

const SpeechButton = ({ onUserDataExtracted }) => {
  const [isListening, setIsListening] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    speak("Speak your name, mobile number, and profession.");

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);
      const extractedData = processUserInput(transcript);
      if (extractedData) onUserDataExtracted(extractedData);
    };

    recognition.start();
  };

  const processUserInput = (text) => {
    const words = text.split(" ");
    
    let mobileMatch = words.find(word => /^\d{5,10}$/.test(word)); // Find a 5-10 digit number
    let mobile = mobileMatch || "";

    let mobileIndex = words.indexOf(mobile);
    let name = words[0] || ""; // First word as name
    let profession = mobileIndex !== -1 ? words.slice(mobileIndex + 1).join(" ") : "";

    if (!name || !mobile || !profession) {
        speak("I couldn't understand. Please try again.");
        return null;
    }

    return { name, mobile, profession };
};

  return (
    <button onClick={startListening} disabled={isListening} className={isListening ? "listening" : ""}>
      🎤 Tap to Speak
    </button>
  );
};

export default SpeechButton;
