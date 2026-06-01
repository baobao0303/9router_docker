# Technical Specification: Chat Provider Wrapper

## 1. Overview
This document outlines the technical design for a wrapper library to interact with the Chat Provider API (`https://cpab.hiennq.dev/v1/chat/completions`). The goal is to provide a clean, type-safe, and robust interface for consuming this service.

## 2. Supported Models
The wrapper must strictly enforce the following model selection:
- `gpt-5.5`
- `gpt-5.4`
- `gpt-5.4-mini`
- `gpt-5.3-codex`

## 3. Configuration & Initialization
The client should be initialized with:
- **`apiKey`**: String (Required) - Used for Bearer authentication.
- **`baseUrl`**: String (Default: `https://cpab.hiennq.dev/v1`)
- **`defaultModel`**: String (Optional) - Sets the default model for requests.

## 4. API Interface Specification

### Method: `chat`
Submits a request to the chat completion endpoint.

**Parameters:**
* `messages` (Array of Objects):
    * `role`: 'user' | 'assistant' | 'system'
    * `content`: String
* `options` (Object, Optional):
    * `model`: String (Must be from the allowed models list)
    * `temperature`: Float (Range 0.0 - 2.0)
    * `max_tokens`: Integer

### HTTP Headers
* `Authorization`: `Bearer <API_KEY>`
* `Content-Type`: `application/json`

## 5. Error Handling
The wrapper must catch and throw meaningful exceptions:
* **`AuthenticationError`**: HTTP 401 - Invalid API Key.
* **`ModelError`**: Thrown if the provided model name is not in the allowed list.
* **`APIError`**: HTTP non-200 responses.
* **`NetworkError`**: Connection issues or timeouts.

## 6. Implementation Example (TypeScript)

```typescript
type Model = 'gpt-5.5' | 'gpt-5.4' | 'gpt-5.4-mini' | 'gpt-5.3-codex';

interface ChatRequest {
  model: Model;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

class ChatProviderClient {
  constructor(private apiKey: string, private defaultModel: Model = 'gpt-5.5') {}

  async chat(messages: any[], options: Partial<ChatRequest> = {}) {
    const model = options.model || this.defaultModel;
    
    // Validate model
    const allowedModels = ['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.3-codex'];
    if (!allowedModels.includes(model)) {
      throw new Error(`Invalid model: ${model}`);
    }

    // Call API
    return await fetch('https://cpab.hiennq.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...options, model, messages })
    });
  }
}
```

## 7. Security Best Practices
- Never hardcode the `apiKey` in production code. Use environment variables.
- Implement a request timeout (e.g., 60 seconds) to avoid hanging processes.
- Sanitize user input before sending it to the `content` field.