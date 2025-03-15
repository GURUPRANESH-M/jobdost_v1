// SpeechCapture.jsx
import React, { useState } from "react";

const SpeechCapture = () => {
    const [text, setText] = useState("");
    const [processing, setProcessing] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);
    const [confirmText, setConfirmText] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.onstart = () => setProcessing(true);

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            setText(speechText);
            setConfirmText(speechText);
            setShowConfirmation(true);
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
                body: JSON.stringify({ text: speechText }),
            });

            const data = await response.json();
            console.log("Processed:", data);

            if (data.message === "Processed successfully") {
                alert("Registered successfully!");
                setRegisteredData({
                    name: data.data.name,
                    mobile: data.data.mobile,
                    profession: data.data.profession,
                });
            } else if (data.error && data.error.includes("Error sending to save_worker")) {
                alert("Error: Speak your details correctly.");
            } else if (data.error && data.error.includes("Could not extract required details, likely an invalid mobile number")) {
                alert("Error: Speak your details correctly.");
            }

        } catch (error) {
            console.error("Error sending speech:", error);
        }
    };

    const handleConfirm = () => {
        sendToBackend(confirmText);
        setShowConfirmation(false);
        setEditMode(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleConfirmTextChange = (event) => {
        setConfirmText(event.target.value);
    };

    return (
        <div>
            <h2>Speak your details (Name Mobile_No Profession)</h2>
            <button onClick={handleVoiceInput} disabled={processing}>
                {processing ? "Listening..." : "Start Speaking"}
            </button>
            <p>Detected: {text}</p>

            {showConfirmation && (
                <div>
                    {!editMode && <p>Did you say: "{confirmText}"?</p>}
                    {editMode && (
                        <input
                            type="text"
                            value={confirmText}
                            onChange={handleConfirmTextChange}
                        />
                    )}
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}

            {registeredData && (
                <div>
                    <p>Name: {registeredData.name}</p>
                    <p>Mobile: {registeredData.mobile}</p>
                    <p>Profession: {registeredData.profession}</p>
                </div>
            )}
        </div>
    );
};

export default SpeechCapture;