"use client";

import { useState, useEffect } from 'react';
import { getConnectionPair } from '../utils/aiService';
import { getSampleConnection } from '../utils/connectionService';

interface GameProps {
  difficulty: string;
  onReset: () => void;
}

export default function Game({ difficulty, onReset }: GameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionPair, setConnectionPair] = useState<{ person1: string; person2: string } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [sampleConnection, setSampleConnection] = useState<string[] | null>(null);
  const [loadingExample, setLoadingExample] = useState(false);

  useEffect(() => {
    async function loadConnectionPair() {
      try {
        setIsLoading(true);
        setError(null);
        const pair = await getConnectionPair(difficulty);
        
        // Validate the returned pair to ensure both names exist
        if (!pair || !pair.person1 || !pair.person2) {
          throw new Error('Invalid connection pair returned');
        }
        
        // Ensure they're not the same person
        if (pair.person1.toLowerCase() === pair.person2.toLowerCase()) {
          throw new Error('Same person returned for both ends of the connection');
        }
        
        setConnectionPair(pair);
      } catch (err) {
        console.error('Error loading connection pair:', err);
        setError('Failed to generate a valid connection. Please try again.');
        
        // Use fallback as a last resort
        setConnectionPair({
          person1: difficulty === 'easy' ? 'Barack Obama' : 
                  difficulty === 'hard' ? 'Leonardo da Vinci' : 'Albert Einstein',
          person2: difficulty === 'easy' ? 'Taylor Swift' : 
                  difficulty === 'hard' ? 'Elon Musk' : 'Beyoncé'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadConnectionPair();
  }, [difficulty]);

  const handleShowExample = async () => {
    if (!connectionPair) return;
    
    setLoadingExample(true);
    try {
      const connection = await getSampleConnection(
        connectionPair.person1, 
        connectionPair.person2,
        difficulty
      );
      
      // Validate the returned connection
      if (!connection || connection.length < 2) {
        throw new Error('Invalid connection path returned');
      }
      
      setSampleConnection(connection);
    } catch (err) {
      console.error('Failed to get sample connection:', err);
      
      // Create a simple fallback connection if the API fails
      const fallbackConnection = [
        connectionPair.person1,
        `Mutual ${difficulty === 'easy' ? 'friend' : 'acquaintance'}`,
        connectionPair.person2
      ];
      
      setSampleConnection(fallbackConnection);
    } finally {
      setLoadingExample(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Generating Challenge...</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
        <p className="mb-6">{error}</p>
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="py-3 px-6 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!connectionPair) {
    return null;
  }

  const handleGotItClick = () => {
    setShowResults(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Challenge
      </h2>
      
      <p className="mb-6 text-center text-black font-bold text-lg">
        Find a chain of direct meetings connecting these two people:
      </p>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="bg-blue-200 p-4 rounded-lg text-center w-full sm:w-5/12 border-2 border-blue-300">
          <p className="font-bold text-lg text-blue-900">{connectionPair.person1}</p>
        </div>
        
        <div className="text-2xl font-bold text-blue-900">→</div>
        
        <div className="bg-blue-200 p-4 rounded-lg text-center w-full sm:w-5/12 border-2 border-blue-300">
          <p className="font-bold text-lg text-blue-900">{connectionPair.person2}</p>
        </div>
      </div>
      
      {!showResults ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-800 mb-2 font-medium">
            Think of a chain of people who have met each other, starting with the first person and ending with the second. 
            Press "Got It!" when you've thought of a connection.
          </p>
          
          <button
            onClick={handleGotItClick}
            className="py-3 px-6 rounded-lg text-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Got It!
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-800 mb-4 font-medium">
            Great job! How does your connection compare to others? The average connection for this difficulty is about:
            {difficulty === 'easy' ? ' 2-4' : difficulty === 'medium' ? ' 3-5' : ' 5-7'} links.
          </p>
          
          {!sampleConnection && (
            <button
              onClick={handleShowExample}
              disabled={loadingExample}
              className="py-2 px-4 rounded-lg font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors mb-4"
            >
              {loadingExample ? 'Loading Example...' : 'Show Me an Example'}
            </button>
          )}
          
          {sampleConnection && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">Example Connection:</h3>
              <ol className="list-decimal list-inside">
                {sampleConnection.map((person, index) => (
                  <li key={index} className="mb-1 text-sm text-gray-800 font-medium">
                    {person}
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          <div className="flex justify-between gap-3">
            <button
              onClick={onReset}
              className="py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-1"
            >
              Change Difficulty
            </button>
            
            <button
              onClick={() => {
                setShowResults(false);
                setSampleConnection(null);
                setIsLoading(true);
                getConnectionPair(difficulty).then(pair => {
                  setConnectionPair(pair);
                  setIsLoading(false);
                }).catch(err => {
                  setError('Failed to generate a new connection. Please try again.');
                  console.error(err);
                });
              }}
              className="py-2 px-4 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex-1"
            >
              New Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
