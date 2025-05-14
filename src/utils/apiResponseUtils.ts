export const createResponse = <T>(
  status: number,
  data?: T | null,
  error?: unknown,
  message?: string | null
): Response => {
  interface ApiResponse<T> {
    status: number;
    data?: T | null;
    error?: unknown;
    message?: string | null;
  }

  const responseBody: ApiResponse<T> = {
    status,
    data: data ?? null,
    error: error ?? null,
    message: message ?? null,
  };

  return new Response(JSON.stringify(responseBody), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};
