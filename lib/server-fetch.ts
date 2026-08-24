export interface ServerFetchOptions extends Omit<RequestInit, 'body'> {
  tags?: string[];
  revalidate?: number;
  body?: any;
}

export async function serverFetch<T>(endpoint: string, options?: ServerFetchOptions): Promise<T> {
  let apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
  
  // Ensure endpoint starts with a slash
  const url = endpoint.startsWith('/') ? `${apiUrl}${endpoint}` : `${apiUrl}/${endpoint}`;

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  // Stringify body if it's an object and not already a string
  if (options?.body && typeof options.body !== 'string') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  // Handle Next.js cache options
  if (options?.tags || options?.revalidate !== undefined) {
    fetchOptions.next = {
      ...(options.tags && { tags: options.tags }),
      ...(options.revalidate !== undefined && { revalidate: options.revalidate }),
    };
  }

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      // Try to parse error message if possible
      let errorMsg = `ServerFetch Error: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (e) {
        // Ignore json parse error for non-json error responses
      }
      throw new Error(errorMsg);
    }

    // Check if response is empty (e.g. 204 No Content)
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return null as any;
    }

    return await res.json();
  } catch (error) {
    console.error(`[serverFetch] Failed to fetch ${url}:`, error);
    throw error;
  }
}
