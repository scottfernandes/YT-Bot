"use client";
import axios from "axios";
import React, { useState } from "react";
import YouTube from "react-youtube";

export default function YTInput() {
  const [url, setURL] = useState("");
  const [videoId, setVideoId] = useState("");
  const [question, setQuestion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const opts = {
    height: "600",
    width: "1000",
  };

  const extractVideoId = () => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      return match[1];
    } else {
      alert("Invalid YouTube URL");
      return null;
    }
  };

  const handleSubmitURL = (e) => {
    e.preventDefault();
    const id = extractVideoId();
    if (id) {
      setVideoId(id);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const response = await axios.post(
        "http://localhost:5000/ask",
        {
          video_id: videoId,
          question: question.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAnswer(response.data.answer);
      setQuestion("");
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Input URL Form */}
      <form
        className="flex items-center justify-center mt-10"
        onSubmit={handleSubmitURL}
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="w-full max-w-md px-4 py-3 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl shadow-md transition duration-300 ease-in-out ml-5"
        >
          Submit
        </button>
      </form>

      {/* YouTube Video and Ask Button */}
      {videoId && (
        <div className="flex flex-col items-center mt-10 space-y-4">
          <YouTube videoId={videoId} opts={opts} />
          <button
            aria-label="Ask a question"
            onClick={() => setShowModal(true)}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h8m-6 8a9 9 0 110-18 9 9 0 010 18z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Ask Question Modal */}
      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
          />

          <div className="fixed top-0 right-0 h-screen w-full max-w-md bg-gray-900 text-white shadow-xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Ask a question</h3>
                <button
                  className="text-gray-400 hover:text-white text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleQuestionSubmit}
                className="flex flex-col flex-grow"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  autoFocus
                />
                {answer && (
                  <div className="mt-6">
                    <label className="block mb-2 text-lg font-medium text-gray-300">
                      Response
                    </label>
                    <div className="max-h-60 overflow-y-auto bg-gray-800 p-4 rounded-xl text-md whitespace-pre-wrap border border-white/10">
                      {answer}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-8 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  {loading?"Please wait...":"Send"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

    

      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Something went wrong</h2>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
