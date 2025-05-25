// Simulated API for chat functionality

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (q, sch) => {
  try {
    
    const [question, ...rest] = q.split(' [qE] ');  // Split by the delimiter [qE]
    const schema = rest.join(' [qE] ').trim(); 
    console.log('Question:', question);

    console.log('Schema:', schema);
    const response = await fetch(`http://localhost:5000/api/generate_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, schema }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();

    return {
      id: Date.now().toString(),
      content: data.sql_query || '',
      role: 'assistant',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


export const createNewChat = async () => {
  // Simulate network request
  await delay(500);
  
  // Create a new chat
  const newChat = {
    id: Date.now().toString(),
    title: 'New conversation',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return newChat;
};