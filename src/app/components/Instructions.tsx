"use client";

import { useState } from 'react';

interface InstructionsProps {
  onClose: () => void;
}

export default function Instructions({ onClose }: InstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b-2 border-blue-300 pb-2">
          How to Play "Web of Influence"
        </h2>
        
        <div className="space-y-4 text-gray-800">
          <p className="font-medium">
            Web of Influence challenges you to find connections between seemingly unrelated people through a chain of direct meetings or interactions.
          </p>
          
          <h3 className="font-bold text-xl mt-4">Game Rules:</h3>
          <ol className="list-decimal list-inside space-y-2 font-medium">
            <li>You'll be presented with two people.</li>
            <li>Your task is to create a mental chain of people who have plausibly met each other in real life.</li>
            <li>Each person in your chain must have plausibly met both the person before and after them.</li>
            <li>The chain must start with the first person and end with the second person.</li>
            <li>Once you've figured out a chain, click "Got It!" to see how you did.</li>
          </ol>
          
          <h3 className="font-bold text-xl mt-4">Example:</h3>
          <p className="font-medium">If the challenge is to connect <span className="font-bold">Albert Einstein</span> to <span className="font-bold">Barack Obama</span>, a valid chain might be:</p>
          <ol className="list-decimal list-inside ml-4 mt-2 font-medium">
            <li>Albert Einstein</li>
            <li>J. Robert Oppenheimer (Manhattan Project)</li>
            <li>Robert McNamara (Pentagon colleagues)</li>
            <li>Bill Clinton (political circles)</li>
            <li>Barack Obama (former presidents)</li>
          </ol>
          
          <h3 className="font-bold text-xl mt-4">Difficulty Levels:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 font-medium">
            <li><span className="font-bold text-green-700">Easy:</span> Connections typically require 2-4 links between well-known people.</li>
            <li><span className="font-bold text-yellow-700">Medium:</span> Connections typically require 3-5 links between people from somewhat different fields.</li>
            <li><span className="font-bold text-red-700">Hard:</span> Connections typically require 5-7 links between people from very different eras or fields.</li>
          </ul>
          
          <p className="mt-4 font-medium">
            The beauty of this game is that there are many possible valid solutions. Your chain might be completely different from someone else's but equally valid!
          </p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
