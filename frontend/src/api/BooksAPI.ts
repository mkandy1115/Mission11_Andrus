// Mission 13: single place for the API root URL so localhost dev and Azure builds stay in sync.
export const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:5000'
