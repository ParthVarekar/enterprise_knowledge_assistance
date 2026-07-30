import http from 'http';

export interface LlamaServerOptions {
  baseUrl?: string;
  timeoutMs?: number;
  modelName?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class LlamaCppClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options: LlamaServerOptions = {}) {
    this.baseUrl = options.baseUrl || 'http://127.0.0.1:8080';
    this.timeoutMs = options.timeoutMs || 15000;
  }

  public async isServerAlive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(2000) });
      return response.ok;
    } catch {
      return false;
    }
  }

  public async generateChatCompletion(messages: ChatMessage[], maxTokens: number = 512): Promise<string | null> {
    try {
      const payload = {
        messages,
        max_tokens: maxTokens,
        temperature: 0.2,
        top_p: 0.9,
      };

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) return null;

      const data: any = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message?.content || null;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}
