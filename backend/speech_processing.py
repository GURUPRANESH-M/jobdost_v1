import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def process_user_input(text):
    words = text.split()

    # Extract and clean mobile number (allow spaces anywhere)
    mobile_match = re.search(r"(\d\s*){10,}", text)  # Match at least 10 digits, allowing spaces
    mobile = "".join(re.findall(r"\d", mobile_match.group(0))) if mobile_match else ""  # Remove all spaces

    # Extract name (assume first word before the mobile number)
    name = text.split(mobile_match.group(0), 1)[0].strip() if mobile_match else ""

    # Extract profession (words after the mobile number)
    profession = text.split(mobile_match.group(0), 1)[1].strip() if mobile_match else ""

    if not mobile or not profession:
        return None  # Error case

    return {"name": name, "mobile": mobile, "profession": profession}

@app.route("/process_speech", methods=["POST"])
def process_speech():
    try:
        data = request.json
        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data["text"]
        print("Received Speech:", text)

        processed_data = process_user_input(text)
        if processed_data:
            response = requests.post("http://localhost:5000/save_worker", json=processed_data)
            return jsonify({"message": "Processed successfully", "data": processed_data}), 200
        else:
            return jsonify({"error": "Could not extract required details"}), 400
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
