import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def process_user_input(text):
    mobile_match = re.search(r"(\d\s*){10,}", text)
    if mobile_match:
        mobile = "".join(re.findall(r"\d", mobile_match.group(0)))
        if len(mobile) == 10:
            parts = text.split(mobile_match.group(0), 1)
            name = parts[0].strip()
            profession = parts[1].strip() if len(parts) > 1 else ""
            return {"name": name, "mobile": mobile, "profession": profession}
    return None

@app.route("/process_speech", methods=["POST"])
def process_speech():
    try:
        data = request.json
        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data["text"]
        print("Received Speech:", text)

        processed_data = process_user_input(text)
        print("Processed Data:", processed_data) #Added print statement
        if processed_data:
            try:
                response = requests.post("http://localhost:5000/save_worker", json=processed_data)
                response.raise_for_status()
                return jsonify({"message": "Processed successfully", "data": processed_data}), 200
            except requests.exceptions.RequestException as e:
                print(f"Error sending to save_worker: {e}")
                return jsonify({"error": f"Error sending to save_worker: {e}"}), 500
        else:
            return jsonify({"error": "Could not extract required details, likely an invalid mobile number"}), 400
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)