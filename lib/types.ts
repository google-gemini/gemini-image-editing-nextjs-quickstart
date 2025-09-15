// Define the interface for conversation history items
export interface HistoryItem {
  // Role can be either "user" or "model"
  role: "user" | "model";
  // Parts can contain text and/or images
  parts: HistoryPart[];
}

// Define the interface for history parts
export interface HistoryPart {
  // Text content (optional)
  text?: string;
  // Image content as data URL (optional)
  // Format: data:image/png;base64,... or data:image/jpeg;base64,...
  image?: string;
}

// Design details returned by the API
export interface DesignDetails {
  designDescription: string;
  materialSuggestions: string;
  costEstimate: string;
  constructionTips: string;
}

// API response interface
export interface ApiResponse {
  success: boolean;
  image?: string;
  description?: string;
  designDetails?: DesignDetails;
  error?: string;
}

// Note: When sending to the Gemini API:
// 1. User messages can contain both text and images (as inlineData)
// 2. Model messages should only contain text parts
// 3. Images in history are stored as data URLs in our app, but converted to base64 for the API
