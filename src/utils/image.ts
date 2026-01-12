
export const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    
    // If we are in production (or not on localhost) and the image URL points to localhost, fix it
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        if (url.includes('localhost:8000') || url.includes('127.0.0.1:8000')) {
             // Extract the filename part (everything after /uploads/)
             const parts = url.split('/uploads/');
             if (parts.length > 1) {
                 // Use the environment variable if set, otherwise fallback to the hardcoded Render URL
                 // note: API_BASE_URL in api.ts might have a trailing slash or not, but usually provided clean.
                 // We'll hardcode the known production endpoint fallback as a safety net.
                 const prodBackend = 'https://legalwise-python.onrender.com';
                 return `${prodBackend}/uploads/${parts[1]}`;
             }
        }
    }
    return url;
};
