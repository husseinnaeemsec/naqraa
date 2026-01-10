// Utility to detect error type from API error response
export type ErrorType = 'network' | '404' | '500' | '429' | 'timeout' | 'unknown';

export const detectErrorType = (error: any): ErrorType => {
    // Network error (no response)
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network'))) {
        return 'network';
    }

    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'timeout';
    }

    // HTTP status code errors
    if (error.response?.status || error.status) {
        const status = error.response?.status || error.status;
        
        if (status === 404) return '404';
        if (status === 429) return '429';
        if (status >= 500) return '500';
    }

    return 'unknown';
};

export const getErrorMessage = (error: any): string => {
    return error.response?.data?.message || error.message || 'An unexpected error occurred';
};
