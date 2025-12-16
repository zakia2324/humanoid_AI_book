// frontend/src/services/api.ts

interface ChatRequest {
  query: string;
}

interface ChatResponse {
  answer: string;
  source_url?: string;
}

interface IngestDataResponse {
  message: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-backend.com/api/v1' 
  : 'http://localhost:8000/api/v1'; // Adjust if your backend runs on a different port

export async function ingestData(): Promise<IngestDataResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ingest-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to ingest data');
    }
    return response.json();
  } catch (error) {
    console.error("Error ingesting data:", error);
    throw error;
  }
}

export async function sendMessage(query: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get chat response');
    }
    return response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
