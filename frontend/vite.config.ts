import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const rootDir = dirname(fileURLToPath(import.meta.url))
  const env = loadEnv(mode, rootDir, '')
  const apiTarget = (env.VITE_API_TARGET ?? '').trim() || 'http://192.168.99.14:8080'

  console.log(`[vite] proxy /api -> ${apiTarget}`)

  return {
    root: rootDir,
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: false,
          configure: (proxy) => {
            const maybeOn = (proxy as { on?: unknown }).on
            if (typeof maybeOn !== 'function') return
            ;(proxy as unknown as {
              on: (event: string, cb: (err: unknown, req: { url?: string }) => void) => void
            }).on('error', (err, req) => {
              console.error('[vite][proxy] error', {
                url: req.url,
                message: err instanceof Error ? err.message : String(err),
                target: apiTarget,
              })
            })
          },
        },
      },
    },
  }
})
