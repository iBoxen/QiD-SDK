class Api {
  private baseUrl: string;
  private options: RequestInit;

  constructor(baseUrl: string, apiOptions: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = apiOptions;
  }

  async request<R>(
    endpoint: string,
    body: any = null,
    options: RequestInit = {}
  ): Promise<R> {
    if (this.baseUrl === '') {
      // Get mocked data
      return {} as R;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`[${options.method}] ${this.baseUrl}${endpoint}`);
    const result = await fetch(`${this.baseUrl}${endpoint}`, {
      ...this.options,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.options.headers || {}),
        ...(options.headers || {}),
      },
    });

    const response = result.headers
      .get('Content-Type')
      ?.match(/^application\/json/i)
      ? await result.json()
      : await result.text();

    console.log({ response });
    if (Math.floor(result.status / 100) === 2) {
      return response as R;
    } else {
      throw new Error(response);
    }
  }

  get<R>(endpoint: string, options: RequestInit = {}): Promise<R> {
    return this.request<R>(endpoint, null, {
      ...options,
      method: 'GET',
    });
  }

  post<R>(endpoint: string, body: any, options: RequestInit = {}): Promise<R> {
    return this.request<R>(endpoint, body, {
      ...options,
      method: 'POST',
    });
  }

  put<R>(endpoint: string, body: any, options: RequestInit = {}): Promise<R> {
    return this.request<R>(endpoint, body, {
      ...options,
      method: 'PUT',
    });
  }

  patch<R>(endpoint: string, body: any, options: RequestInit = {}): Promise<R> {
    return this.request<R>(endpoint, body, {
      ...options,
      method: 'PATCH',
    });
  }
}

export default Api;
