"use client";

import { useState } from "react";
import Game from "./components/Game";
import Instructions from "./components/Instructions";

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    console.log(`Selected difficulty: ${difficulty}`);
  };

  const handleReset = () => {
    setSelectedDifficulty(null);
  };

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">
        Web of Influence
      </h1>

      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowInstructions(true)}
          className="py-2 px-4 rounded-full bg-white text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          How to Play
        </button>
      </div>

      {!selectedDifficulty ? (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-8 text-blue-800 border-b-2 border-blue-300 pb-2">
            Select Difficulty
          </h2>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleDifficultySelect("easy")}
              className="py-3 px-6 rounded-lg text-lg font-medium transition-colors bg-green-100 text-green-800 hover:bg-green-200"
            >
              Easy
            </button>

            <button
              onClick={() => handleDifficultySelect("medium")}
              className="py-3 px-6 rounded-lg text-lg font-medium transition-colors bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              Medium
            </button>

            <button
              onClick={() => handleDifficultySelect("hard")}
              className="py-3 px-6 rounded-lg text-lg font-medium transition-colors bg-red-100 text-red-800 hover:bg-red-200"
            >
              Hard
            </button>
          </div>
        </div>
      ) : (
        <Game difficulty={selectedDifficulty} onReset={handleReset} />
      )}

      {showInstructions && (
        <Instructions onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
}

