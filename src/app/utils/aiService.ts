// Utility function to interact with the AI model
export async function getConnectionPair(difficulty: string): Promise<{ person1: string; person2: string }> {
  try {
    // Create a prompt template based on difficulty
    const prompt = generatePromptTemplate(difficulty);
    
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
    
    // Extract the two people from the AI response
    const content = data.choices[0].message.content;
    return parseConnectionPair(content);
  } catch (error) {
    console.error('Error fetching connection pair:', error);
    // Fallback pairs for different difficulties in case API fails
    const fallbackPairs = {
      easy: { person1: 'Barack Obama', person2: 'Taylor Swift' },
      medium: { person1: 'Albert Einstein', person2: 'Beyoncé' },
      hard: { person1: 'Ada Lovelace', person2: 'Cristiano Ronaldo' }
    };
    
    return fallbackPairs[difficulty as keyof typeof fallbackPairs] || fallbackPairs.medium;
  }
}

// Function to generate the prompt template based on difficulty
function generatePromptTemplate(difficulty: string): string {
  const basePrompt = `I'm playing a game called "Web of Influence" where I need to think of a chain of direct meetings between two people. Please give me two real people (full names) that might be connected through a chain of acquaintances.`;
  
  let difficultyPrompt = '';
  
  switch (difficulty) {
    case 'easy':
      difficultyPrompt = `The connection should be relatively easy to figure out - choose two famous people from similar time periods or industries who are likely only 2-4 connections apart. Examples could be: two modern celebrities, two politicians, a famous actor and a famous musician, etc.`;
      break;
    case 'medium':
      difficultyPrompt = `The connection should be moderately challenging - choose two well-known people who are likely 3-5 connections apart. They could be from somewhat different fields or time periods, like a modern politician and a famous athlete, or a current celebrity and a historical figure from the late 20th century.`;
      break;
    case 'hard':
      difficultyPrompt = `The connection should be very challenging - choose two people who would require creative thinking to connect, likely 5-7 connections apart. They could be from completely different eras (but with some potential overlap through very old/young people), different cultures, or obscure fields. Examples: a historical scientist and a modern artist, an ancient philosopher and a current athlete, etc.`;
      break;
    default:
      difficultyPrompt = `The connection should be moderately challenging - choose two people who are likely 3-5 connections apart.`;
  }
  
  const formatInstructions = `YOU MUST RETURN YOUR RESPONSE USING EXACTLY THIS FORMAT WITH NO ADDITIONAL TEXT OR EXPLANATION:
Person1: [First Person Full Name]
Person2: [Second Person Full Name]`;
  
  return `${basePrompt} ${difficultyPrompt} ${formatInstructions}`;
}

// Function to parse the AI response and extract the two people
function parseConnectionPair(content: string): { person1: string; person2: string } {
  try {
    // Normalize the content by trimming and replacing any variations in format
    const normalizedContent = content
      .trim()
      .replace(/person 1/i, 'Person1')
      .replace(/person 2/i, 'Person2')
      .replace(/person1 :/i, 'Person1:')
      .replace(/person2 :/i, 'Person2:');
    
    // Split by lines for easier parsing
    const lines = normalizedContent.split('\n').map(line => line.trim()).filter(line => line !== '');
    
    // Try multiple parsing strategies
    
    // Strategy 1: Look for "Person1:" and "Person2:" at the beginning of lines
    const person1Line = lines.find(line => line.toLowerCase().startsWith('person1:'));
    const person2Line = lines.find(line => line.toLowerCase().startsWith('person2:'));
    
    if (person1Line && person2Line) {
      const person1 = person1Line.substring(person1Line.indexOf(':') + 1).trim();
      const person2 = person2Line.substring(person2Line.indexOf(':') + 1).trim();
      
      if (person1 && person2) {
        return { person1, person2 };
      }
    }
    
    // Strategy 2: If there are exactly two lines, assume they are the two people
    if (lines.length === 2) {
      // Check if each line contains a colon
      const extractName = (line: string) => {
        const colonIndex = line.indexOf(':');
        return colonIndex > -1 ? line.substring(colonIndex + 1).trim() : line.trim();
      };
      
      const person1 = extractName(lines[0]);
      const person2 = extractName(lines[1]);
      
      if (person1 && person2) {
        return { person1, person2 };
      }
    }
    
    // Strategy 3: Look for a comma-separated format "Person1: X, Person2: Y"
    const commaFormat = normalizedContent.match(/Person1:\s*([^,]+),\s*Person2:\s*(.+)/i);
    if (commaFormat) {
      return {
        person1: commaFormat[1].trim(),
        person2: commaFormat[2].trim()
      };
    }
    
    // If we get here, try a more aggressive parsing approach
    // Just extract any two proper nouns or names that seem like people
    const potentialNames = normalizedContent.match(/[A-Z][a-z]+ [A-Z][a-z]+/g);
    if (potentialNames && potentialNames.length >= 2) {
      return {
        person1: potentialNames[0].trim(),
        person2: potentialNames[1].trim()
      };
    }
    
    // If all else fails, use fallback values
    console.warn('Could not parse the response format, using fallback values');
    return {
      person1: 'Albert Einstein',
      person2: 'Barack Obama'
    };
    
  } catch (error) {
    console.error('Error parsing connection pair:', error, content);
    return {
      person1: 'Albert Einstein',
      person2: 'Barack Obama'
    };
  }
}
