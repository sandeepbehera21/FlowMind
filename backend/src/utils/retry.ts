export async function withRetry<T>(
  operation: () => Promise<T>,
  options: { retries: number; delayMs: number; shouldRetry?: (error: unknown) => boolean }
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === options.retries || options.shouldRetry?.(error) === false) break;
      await new Promise((resolve) => setTimeout(resolve, options.delayMs * (attempt + 1)));
    }
  }
  throw lastError;
}
