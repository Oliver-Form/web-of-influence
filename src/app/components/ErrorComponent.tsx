"use client";

import { useState } from 'react';

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorComponent({ message, onRetry }: ErrorComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
      <p className="mb-6">{message}</p>
      <div className="flex justify-center">
        <button
          onClick={onRetry}
          className="py-3 px-6 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
