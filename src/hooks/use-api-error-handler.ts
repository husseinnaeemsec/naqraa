// This hook is now empty - 401 error handling is done directly in the API client interceptor
// This maintains backward compatibility for components that still import it

export const useApiErrorHandler = () => {
  // No-op hook - error handling is now in api/client.tsx interceptor
};

export default useApiErrorHandler;