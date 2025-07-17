"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-950 text-white text-center">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to YT-Bot</h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Paste any YouTube video URL, ask questions about it, and get answers instantly powered by AI.
          Our system uses language models to help you understand video content without watching the entire video.
          Our platform also allows you to watch the video on the website directly.
        </p>
      </div>

      <button
        onClick={() => router.push("/ask")}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl shadow-md transition duration-300 ease-in-out"
      >
        Get Started
      </button>

     
    </div>
  );
}
