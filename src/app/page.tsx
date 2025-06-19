"use client";

import { useState } from "react";

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    // Here you would handle what happens when a difficulty is selected
    console.log(`Selected difficulty: ${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">
        Web of Influence
      </h1>

      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-800 border-b-2 border-blue-300 pb-2">
          Select Difficulty
        </h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleDifficultySelect("easy")}
            className={`py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
              selectedDifficulty === "easy"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            Easy
          </button>

          <button
            onClick={() => handleDifficultySelect("medium")}
            className={`py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
              selectedDifficulty === "medium"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
          >
            Medium
          </button>

          <button
            onClick={() => handleDifficultySelect("hard")}
            className={`py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
              selectedDifficulty === "hard"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            Hard
          </button>
        </div>

        {selectedDifficulty && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="font-medium">
              You selected:{" "}
              <span className="font-bold capitalize">{selectedDifficulty}</span>
            </p>
            <button
              onClick={() => setSelectedDifficulty(null)}
              className="mt-2 text-blue-600 hover:underline"
            >
              Change difficulty
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

