import react from '@vitejs/plugin-react'

export default {
  base: '', 
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store'
    }
  }
}
