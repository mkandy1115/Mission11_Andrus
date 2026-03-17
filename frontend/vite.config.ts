// Matthew Andrus IS415 Mission 11
// This file serves as the Vite configuration for the React frontend development server.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Register the React plugin and keep the frontend running on port 3000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  }
})
