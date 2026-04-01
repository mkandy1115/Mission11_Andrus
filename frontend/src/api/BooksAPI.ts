// Mission 13: keep the deployed API as the default while still allowing overrides through Vite env vars.
export const API_URL = import.meta.env.VITE_API_URL ?? 'https://mission13-bookstore-hxceatcjeydxhwgb.canadacentral-01.azurewebsites.net'
