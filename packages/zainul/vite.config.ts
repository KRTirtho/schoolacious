import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    hmr: {
      // for making hmr work in gitpod 
      host: "3000-violet-chicken-ifvho6mo.ws-us11.gitpod.io"
    }
  }
})
