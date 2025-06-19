// Utility function to generate a sample connection path
export async function getSampleConnection(person1: string, person2: string, difficulty: string): Promise<string[]> {
  try {
    // Create a prompt template for generating a connection path
    const prompt = generateConnectionPrompt(person1, person2, difficulty);
    
    // Call the AI API
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the connection path from the AI response
    const content = data.choices[0].message.content;
    return parseConnectionPath(content, person1, person2);
  } catch (error) {
    console.error('Error fetching sample connection:', error);
    // Return a fallback connection
    return generateFallbackConnection(person1, person2, difficulty);
  }
}

// Function to generate the prompt template for connection paths
function generateConnectionPrompt(person1: string, person2: string, difficulty: string): string {
  const pathLength = difficulty === 'easy' ? '2-4' : difficulty === 'medium' ? '3-5' : '5-7';
  
  return `I need a plausible chain of connections between ${person1} and ${person2}, where each person in the chain has plausibly met the next person in real life. 
  The chain should start with ${person1} and end with ${person2}, and should include about ${pathLength} intermediate people.
  
  KEEP ALL EXPLANATIONS EXTREMELY SHORT - NO MORE THAN 3-5 WORDS EACH. For example: "colleagues", "same TV show", "both in politics", etc.
  
  YOU MUST FOLLOW THIS EXACT FORMAT WITH A NUMBERED LIST:
  1. ${person1}
  2. [Person Name] - [3-5 word explanation]
  3. [Next Person] - [3-5 word explanation]
  ... 
  [Last Number]. ${person2} - [3-5 word explanation]
  
  DO NOT ADD ANY OTHER TEXT, INTRODUCTION OR EXPLANATION BEFORE OR AFTER THE NUMBERED LIST.`;
}

// Function to parse the AI response and extract the connection path
function parseConnectionPath(content: string, person1: string, person2: string): string[] {
  try {
    // Normalize line breaks and filter empty lines
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
    const path: string[] = [];
    
    // Step 1: Extract numbered entries
    for (const line of lines) {
      // Look for numbered list entries (e.g., "1. Person Name - explanation")
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match) {
        const personEntry = match[1].trim();
        
        // Format the entry to ensure explanations are short
        const formattedEntry = formatExplanation(personEntry);
        path.push(formattedEntry);
      }
    }
    
    // If we couldn't find any numbered entries, try alternative parsing
    if (path.length === 0) {
      // Try to extract anything that looks like a person with explanation
      for (const line of lines) {
        // Look for lines that might have a person name at the beginning
        if (/^[A-Z]/.test(line)) {
          const formattedEntry = formatExplanation(line);
          path.push(formattedEntry);
        }
      }
    }
    
    // Ensure we have at least the original two people
    if (path.length < 2) {
      console.warn('Could not parse enough people from the connection path');
      return [person1, person2];
    }
    
    // Step 2: Ensure the path starts and ends with the right people
    
    // Make sure the first entry is properly formatted
    let firstEntry = path[0];
    if (!firstEntry.toLowerCase().includes(person1.toLowerCase())) {
      // If first entry doesn't contain person1, replace it
      path[0] = person1;
    } else {
      // If it does contain but might have explanation, clean it
      const dashIndex = firstEntry.indexOf('-');
      if (dashIndex > -1) {
        path[0] = firstEntry.substring(0, dashIndex).trim();
      } else {
        path[0] = person1;
      }
    }
    
    // Make sure the last entry is properly formatted
    const lastIndex = path.length - 1;
    let lastEntry = path[lastIndex];
    if (!lastEntry.toLowerCase().includes(person2.toLowerCase())) {
      // If last entry doesn't contain person2, replace it
      path[lastIndex] = person2;
    } else {
      // If it does contain but might have explanation, clean it
      const dashIndex = lastEntry.indexOf('-');
      if (dashIndex > -1) {
        path[lastIndex] = lastEntry.substring(0, dashIndex).trim();
      } else {
        path[lastIndex] = person2;
      }
    }
    
    return path;
  } catch (error) {
    console.error('Error parsing connection path:', error, content);
    return generateFallbackConnection(person1, person2, 'medium');
  }
}

// Helper function to format explanations to be short
function formatExplanation(entry: string): string {
  // Check if the entry has an explanation (contains a dash)
  const dashIndex = entry.indexOf('-');
  if (dashIndex === -1) {
    return entry; // No explanation
  }
  
  const name = entry.substring(0, dashIndex).trim();
  let explanation = entry.substring(dashIndex + 1).trim();
  
  // Truncate long explanations to keep them short (approximately 3-5 words)
  if (explanation.length > 30) {
    // Try to find a good stopping point (space) around 25-30 chars
    const stopIndex = explanation.indexOf(' ', 25);
    if (stopIndex > 0 && stopIndex < 35) {
      explanation = explanation.substring(0, stopIndex);
    } else {
      explanation = explanation.substring(0, 30);
    }
  }
  
  // Count words to ensure we have at most 5
  const words = explanation.split(/\s+/);
  if (words.length > 5) {
    explanation = words.slice(0, 5).join(' ');
  }
  
  return `${name} - ${explanation}`;
}

// Function to generate a fallback connection path if AI fails
function generateFallbackConnection(person1: string, person2: string, difficulty: string): string[] {
  let intermediateCount: number;
  
  switch (difficulty) {
    case 'easy':
      intermediateCount = 1;
      break;
    case 'medium':
      intermediateCount = 3;
      break;
    case 'hard':
      intermediateCount = 5;
      break;
    default:
      intermediateCount = 2;
  }
  
  // Create fallback intermediate connections with very short explanations
  const intermediates = [
    'Mutual Friend - social circle',
    'Famous Actor - industry event',
    'Talk Show Host - TV interview',
    'Director - film collaboration',
    'Politician - public event'
  ].slice(0, intermediateCount);
  
  return [person1, ...intermediates, person2];
}
