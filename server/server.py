from flask import Flask, request, jsonify
from rag_backend import fetch_video_transcript,rag
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
@app.route('/ask', methods=['POST'])
def ask():
    try:
  

        data = request.get_json(force=True)
        video_id = data['video_id']
        question = data['question']
    

        transcript = fetch_video_transcript(video_id)
        if not transcript:
            return jsonify({"error": "Transcript not available"}), 400

        answer = rag(video_id, transcript, question)
        return jsonify({"answer": answer})
    
    except Exception as e:
        print("Error in /ask:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
