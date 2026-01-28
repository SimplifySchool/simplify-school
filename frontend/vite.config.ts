import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'json', 'json-summary'],
            reportOnFailure: true,
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/main.tsx'],
        },
    },
})
