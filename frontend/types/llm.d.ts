interface LLMModel {
  model: string;
  messages?: Message[];
  stream: boolean;
  max_tokens: number;
  temperature: number;
  top_p: number;
}

interface LLMMessage {
  role: string;
  content: string;
}