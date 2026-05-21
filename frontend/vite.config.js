import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var rootDir = dirname(fileURLToPath(import.meta.url));
    var env = loadEnv(mode, rootDir, '');
    var apiTarget = ((_b = env.VITE_API_TARGET) !== null && _b !== void 0 ? _b : '').trim() || 'http://localhost:8080';
    console.log("[vite] proxy /api -> ".concat(apiTarget));
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
                    configure: function (proxy) {
                        var maybeOn = proxy.on;
                        if (typeof maybeOn !== 'function')
                            return;
                        proxy.on('error', function (err, req) {
                            console.error('[vite][proxy] error', {
                                url: req.url,
                                message: err instanceof Error ? err.message : String(err),
                                target: apiTarget,
                            });
                        });
                    },
                },
            },
        },
    };
});
