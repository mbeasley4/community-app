export class ZegoError extends Error {
    constructor(
        message: string,
        public code?: string | number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ZegoError';
    }
}

export const handleZegoError = (error: unknown): string => {
    if (error instanceof ZegoError) {
        return `${error.message} (Code: ${error.code})`;
    }
    
    if (error instanceof Error) {
        return error.message;
    }
    
    return 'An unknown error occurred';
};